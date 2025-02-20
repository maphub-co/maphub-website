import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  try {
    // @ts-ignore
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const idToken = (token as any)?.idToken as string | undefined;

    const authHost = process.env.KEYCLOAK_HOST; // e.g. https://auth.example.com
    const realm = process.env.KEYCLOAK_REALM; // e.g. myrealm
    const clientId = process.env.KEYCLOAK_CLIENT_ID; // required for logout without id_token_hint

    if (!authHost || !realm) {
      return new NextResponse("Keycloak not configured", { status: 500 });
    }

    const issuer = `${authHost}/realms/${realm}`;
    const endSessionEndpoint = `${issuer}/protocol/openid-connect/logout`;

    const postLogout =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const params = new URLSearchParams();

    // Prefer id_token_hint if available
    if (idToken) {
      params.set("id_token_hint", idToken);
    } else if (clientId) {
      // Fallback: some realms accept client_id when id_token_hint is not present
      params.set("client_id", clientId);
    }

    params.set("post_logout_redirect_uri", postLogout);

    const redirectUrl = `${endSessionEndpoint}?${params.toString()}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("/api/kc-logout error", err);
    return new NextResponse("Logout error", { status: 500 });
  }
}
