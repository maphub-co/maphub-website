"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore, createKeycloakUserShim } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export default function KeycloakAuthBridge({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  const { set_loading: set_auth_loading, set_authenticated } = useAuthStore();
  const { set_loading: set_user_loading, fetch_current_user, clear_user } = useUserStore();

  useEffect(() => {
    const loading = status === "loading";
    set_auth_loading(loading);

    if (status === "unauthenticated") {
      set_authenticated(null);
      clear_user();
      return;
    }

    if (status === "authenticated") {
      const accessToken = (data as any)?.accessToken as string | undefined;
      const sub = (data as any)?.sub as string | undefined;
      const email = data?.user?.email ?? null;
      const name = data?.user?.name ?? null;
      const picture = (data?.user as any)?.image ?? null;
      const emailVerified = (data as any)?.email_verified ?? null;

      const shim = createKeycloakUserShim({ accessToken, sub, email, name, picture, emailVerified });
      set_authenticated(shim);

      (async () => {
        try {
          set_user_loading(true);
          await fetch_current_user();
        } catch (e) {
          console.error("Failed to fetch current user:", e);
        } finally {
          set_user_loading(false);
        }
      })();
    }
  }, [status, data, set_auth_loading, set_authenticated, set_user_loading, fetch_current_user, clear_user]);

  return <>{children}</>;
}
