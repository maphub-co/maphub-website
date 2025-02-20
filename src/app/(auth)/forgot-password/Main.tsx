"use client";

// LIBRARIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapIcon,
  Mail,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";

// CONFIG
import { auth } from "@/lib/firebase";
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

// UTILS
import { get_error_message } from "@/utils/firebase";

export default function ForgotPasswordPage() {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const [email, set_email] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const [is_submitted, set_is_submitted] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  /*------- METHODS -------*/
  const validate_email = (email: string): boolean => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email_regex.test(email);
  };

  const handle_submit = async (event: React.FormEvent) => {
    event.preventDefault();
    set_error(null);

    // Client-side validation
    if (!email.trim()) {
      set_error("Please enter your email address.");
      return;
    }

    if (!validate_email(email)) {
      set_error("Please enter a valid email address.");
      return;
    }

    set_is_loading(true);

    try {
      // Use Firebase's built-in password reset
      await sendPasswordResetEmail(auth, email);

      set_is_submitted(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      if (error.code && error.code.startsWith("auth/")) {
        set_error(get_error_message(error).message);
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      set_is_loading(false);
    }
  };

  const handle_back_to_login = () => {
    router.push("/login");
  };

  const handle_try_again = () => {
    set_is_submitted(false);
    set_email("");
    set_error(null);
  };

  /*------- RENDER -------*/
  return (
    <div className="w-full h-full bg-background">
      {/* BACK BUTTON */}
      <Link
        href="/login"
        className="fixed top-8 left-4 md:left-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      {/* MAIN CONTENT */}
      <main className="container min-h-full mx-auto pt-16 px-4 pb-8 md:pb-16 xl:pb-24 flex items-center justify-center">
        {is_submitted ? (
          <Card className="w-full max-w-sm">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="size-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-start space-x-2">
                  <Mail className="size-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Check your spam folder</p>
                    <p>
                      If you don't see the email in your inbox, please check
                      your spam or junk mail folder.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handle_back_to_login} className="w-full">
                  Back to Login
                </Button>
                <Button
                  onClick={handle_try_again}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Didn't receive an email? Please try again in a few minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-sm">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <MapIcon className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Forgot your password?</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your
                password.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handle_submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => set_email(e.target.value)}
                    required
                    className={error ? "border-destructive" : ""}
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={is_loading}>
                  {is_loading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-start text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Security note:</strong>
                  </p>
                  <p>• Password reset links are secure and time-limited</p>
                  <p>• Check your spam folder if you don't see the email</p>
                  <p>• The link will take you to a secure reset page</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
