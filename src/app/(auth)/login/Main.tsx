"use client";

// LIBRAIRES
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapIcon } from "lucide-react";
import { signIn } from "next-auth/react";

// CONFIG
import { track } from "@/lib/mixpanel";

// UTILS
import { get_error_message } from "@/utils/firebase";

// HOOKS
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/lib/toast";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { GoogleSignInButton } from "./_components/GoogleSignInButton";

export default function LoginMain() {
  /*------- ATTRIBUTES -------*/
  const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();
  const isKeycloak = provider === "keycloak";
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<{
    message: string;
    field?: "email" | "password";
  } | null>(null);
  const { login } = useAuthStore();
  const router = useRouter();

  /*------- METHODS -------*/
  const handle_redirect = () => {
    // Clear the saved return URL
    const return_url = localStorage.getItem("login_return_url") || undefined;
    localStorage.removeItem("login_return_url");

    // Redirect to the return URL if available, otherwise to the dashboard
    router.push(return_url || "/dashboard/workspaces");
  };

  const handle_submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isKeycloak) return; // No form submit in Keycloak mode
    set_is_loading(true);
    set_error(null);

    try {
      await login(email, password);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      track("signed_in", {
        method: "email",
      });

      handle_redirect();
    } catch (error: any) {
      if (error.code && error.code.startsWith("auth/")) {
        set_error(get_error_message(error));
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in. Please try again.",
      });
    } finally {
      set_is_loading(false);
    }
  };

  // In Keycloak mode, immediately redirect to the IdP using NextAuth
  useEffect(() => {
    if (!isKeycloak) return;
    const return_url = localStorage.getItem("login_return_url") || "/dashboard/workspaces";
    // Clear stored return immediately to avoid loops
    localStorage.removeItem("login_return_url");
    void signIn("keycloak", { callbackUrl: return_url });
  }, [isKeycloak]);

  /*------- RENDERER -------*/
  if (isKeycloak) {
    return (
      <div className="w-full h-full bg-background grid place-items-center p-8">
        <p>Redirecting to sign in…</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-background">
      {/* BACK BUTTON */}
      <Link
        href="/"
        className="fixed top-8 left-4 md:left-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      {/* MAIN CONTENT */}
      <main className="container min-h-full mx-auto pt-16 px-4 pb-8 md:pb-16 xl:pb-24 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <MapIcon className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <GoogleSignInButton />
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background-primary px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <form onSubmit={handle_submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                  required
                  className={
                    error?.field === "email" ? "border-destructive" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                    tabIndex={-1}
                  >
                    Forgot password ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  required
                  className={
                    error?.field === "password" ? "border-destructive" : ""
                  }
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error.message}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={is_loading}>
                {is_loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
