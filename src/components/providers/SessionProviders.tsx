"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();
  const isKeycloak = provider === "keycloak";

  if (!isKeycloak) return <>{children}</>;
  // Refetch session regularly and on window focus so refreshed tokens propagate to the client
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  );
}
