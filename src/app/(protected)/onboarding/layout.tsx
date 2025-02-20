"use client";

// LIBRARIES
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";

/*======= LAYOUT =======*/
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const { loading, is_authenticated } = useAuthStore();

  /*------- HOOKS -------*/
  useEffect(() => {
    if (loading) return;

    if (!loading && !is_authenticated) {
      localStorage.setItem("login_return_url", window.location.pathname);
      router.push("/login");
      return;
    }
  }, [loading, is_authenticated]);

  /*------- RENDERER -------*/
  if (loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
