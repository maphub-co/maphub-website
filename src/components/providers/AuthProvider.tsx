"use client";

import FirebaseAuthBridge from "./FirebaseAuthBridge";
import KeycloakAuthBridge from "./KeycloakAuthBridge";

const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (provider === "keycloak") return <KeycloakAuthBridge>{children}</KeycloakAuthBridge>;
  return <FirebaseAuthBridge>{children}</FirebaseAuthBridge>;
}
