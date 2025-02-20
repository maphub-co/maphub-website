"use client";

// LIBRARIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";
import { toast } from "@/lib/toast";

// COMPONENTS
import { Button } from "@/components/ui/Button";

// STORES
import { useAuthStore } from "@/stores/auth.store";

export function GoogleSignInButton() {
  /*------- ATTRIBUTES -------*/
  const mode = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();
  if (mode === "keycloak") {
    // In Keycloak mode, Google button should not render
    return null;
  }
  const router = useRouter();
  const { login_with_google } = useAuthStore();
  const [is_loading, set_is_loading] = useState(false);

  /*------- METHODS -------*/
  const handle_redirect = () => {
    // Clear the saved return URL
    const return_url = localStorage.getItem("login_return_url") || undefined;
    localStorage.removeItem("login_return_url");

    // Redirect to the return URL if available, otherwise to the dashboard
    router.push(return_url || "/dashboard/workspaces");
  };

  const handle_google_signin = async () => {
    try {
      set_is_loading(true);

      await login_with_google();

      toast({
        title: "Success!",
        description: "You are now signed in with Google.",
      });

      track("signed_in", {
        method: "google",
      });

      handle_redirect();
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    } finally {
      set_is_loading(false);
    }
  };

  /*------- RENDER -------*/
  return (
    <Button
      variant="outline"
      type="button"
      onClick={handle_google_signin}
      className="w-full"
      disabled={is_loading}
    >
      {is_loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );
}
