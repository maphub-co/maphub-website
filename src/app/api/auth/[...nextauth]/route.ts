import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import { NextResponse } from "next/server"

const useKeycloak = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase() === "keycloak"

async function refreshKeycloakTokens(params: {
  issuer: string
  clientId: string
  clientSecret?: string
  refreshToken: string
}) {
  const { issuer, clientId, clientSecret, refreshToken } = params
  const tokenEndpoint = `${issuer}/protocol/openid-connect/token`

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: String(clientId),
    refresh_token: String(refreshToken),
  })
  if (clientSecret) body.set("client_secret", clientSecret)

  const resp = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => "")
    throw new Error(`Keycloak refresh failed: ${resp.status} ${text}`)
  }

  return (await resp.json()) as {
    access_token: string
    id_token?: string
    refresh_token?: string
    expires_in: number // seconds
    refresh_expires_in?: number
    token_type?: string
    scope?: string
  }
}

const authOptions: NextAuthOptions = {
  providers: useKeycloak
    ? [
        KeycloakProvider({
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
          issuer: `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}`,
        }),
      ]
    : [],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: useKeycloak
    ? {
        async jwt({ token, account, profile }) {
          const issuer = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}`
          const clientId = process.env.KEYCLOAK_CLIENT_ID!
          const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET

          // Initial sign-in, persist tokens
          if (account) {
            ;(token as any).accessToken = (account as any).access_token
            ;(token as any).idToken = (account as any).id_token
            ;(token as any).refreshToken = (account as any).refresh_token
            ;(token as any).expiresAt = (account as any).expires_at // epoch seconds
          }

          // Persist profile fields
          if (profile) {
            token.name = (profile as any).name || token.name
            token.email = (profile as any).email || token.email
            ;(token as any).sub = (token as any).sub || (profile as any).sub
            token.picture = (profile as any).picture || token.picture
          }

          // Refresh 60s before expiry if possible
          const expiresAt = (token as any).expiresAt as number | undefined
          const needsRefresh = typeof expiresAt === "number" && Date.now() / 1000 > expiresAt - 60
          if (needsRefresh && (token as any).refreshToken) {
            try {
              const refreshed = await refreshKeycloakTokens({
                issuer,
                clientId,
                clientSecret,
                refreshToken: (token as any).refreshToken as string,
              })

              ;(token as any).accessToken = refreshed.access_token
              if (refreshed.id_token) (token as any).idToken = refreshed.id_token
              if (refreshed.refresh_token) (token as any).refreshToken = refreshed.refresh_token
              ;(token as any).expiresAt = Math.floor(Date.now() / 1000) + (refreshed.expires_in || 300)
            } catch (e) {
              // Refresh failed; clear tokens to force re-auth on client
              delete (token as any).accessToken
              delete (token as any).idToken
              delete (token as any).refreshToken
              delete (token as any).expiresAt
            }
          }

          return token
        },
        async session({ session, token }) {
          ;(session as any).accessToken = (token as any).accessToken
          ;(session as any).idToken = (token as any).idToken
          ;(session as any).sub = (token as any).sub
          ;(session as any).expiresAt = (token as any).expiresAt
          return session
        },
      }
    : {},
}

// Export handlers in app router style
const handler = NextAuth(authOptions)

// If not using Keycloak, return 404 to avoid enabling NextAuth in Firebase mode
// NextAuth v4 returns a single handler function, not an object with .GET/.POST
export const GET = useKeycloak ? handler : () => new NextResponse("Not Found", { status: 404 })
export const POST = useKeycloak ? handler : () => new NextResponse("Not Found", { status: 404 })
