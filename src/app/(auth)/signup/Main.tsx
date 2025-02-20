"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapIcon } from "lucide-react";
import { signIn } from "next-auth/react";

// CONFIG
import { toast } from "@/lib/toast";
import { track } from "@/lib/mixpanel";

// UTILS
import { get_error_message } from "@/utils/firebase";

// STORES
import { useAuthStore } from "@/stores/auth.store";

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

// COMPONENTS
import { GoogleSignUpButton } from "./_components/GoogleSignUpButton";

export default function SignUpMain() {
  /*------- ATTRIBUTES -------*/
  const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();
  const isKeycloak = provider === "keycloak";
  const { signup } = useAuthStore();
  const router = useRouter();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<{
    message: string;
    field?: "email" | "password" | "user_name";
  } | null>(null);

  const handle_submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isKeycloak) return; // No local form submit in Keycloak mode
    set_is_loading(true);
    set_error(null);

    try {
      await signup(email, password);

      toast({
        title: "Welcome to MapHub !",
        description: "Your account has been created successfully.",
      });

      track("signed_up", {
        method: "email",
      });

      router.push("/onboarding");
    } catch (error: any) {
      if (error.code && error.code.startsWith("auth/")) {
        console.log(error.message);
        set_error(get_error_message(error));
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      set_is_loading(false);
    }
  };

  // In Keycloak mode, immediately redirect to the IdP using NextAuth
  useEffect(() => {
    if (!isKeycloak) return;
    // For signup we want to go to onboarding after returning
    const callbackUrl = "/onboarding";
    void signIn("keycloak", { callbackUrl });
  }, [isKeycloak]);

  if (isKeycloak) {
    return (
      <div className="w-full h-full bg-background grid place-items-center p-8">
        <p>Redirecting to sign up…</p>
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
        <ArrowLeft className="size-4 mr-2" />
        Back to home
      </Link>

      {/* MAIN CONTENT */}
      <main className="container min-h-full mx-auto pt-16 px-4 pb-8 md:pb-16 xl:pb-24 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <MapIcon className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your details to get started with MapHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* GOOGLE SIGN UP */}
            <div className="mb-6">
              <GoogleSignUpButton />
            </div>

            {/* OR CONTINUE WITH */}
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

            {/* FORM */}
            <form onSubmit={handle_submit} className="space-y-4">
              {/* EMAIL */}
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

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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

              {/* ERROR */}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error.message}
                </div>
              )}

              {/* CREATE ACCOUNT */}
              <Button type="submit" className="w-full" disabled={is_loading}>
                {is_loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* ALREADY HAVE AN ACCOUNT */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
