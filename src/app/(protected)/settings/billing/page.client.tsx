"use client";

// LIBRARIES
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";
import { Button } from "@/components/ui/Button";
import UsageSection from "./_components/UsageSection";
import SubscriptionSection from "./_components/SubscriptionSection";

export default function SubscriptionPage() {
  /*------- ATTRIBUTS -------*/
  const router = useRouter();
  const { loading: auth_loading, is_authenticated } = useAuthStore();
  const { loading, fetch_user_quotas } = useUserStore();

  /*------- METHODS -------*/
  const handle_login = () => {
    localStorage.setItem("login_return_url", window.location.pathname);
    router.push("/login");
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (auth_loading) return;

    if (!auth_loading && is_authenticated) {
      fetch_user_quotas();
    }
  }, [is_authenticated, auth_loading]);

  /*------- RENDER -------*/
  if (auth_loading || loading) {
    return <PageLoader />;
  }

  if (!auth_loading && !is_authenticated) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-full">
        <h1 className="text-2xl font-bold mb-4">
          Please login to access your subscription details.
        </h1>
        <Button onClick={handle_login}>Login</Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-16">
      <UsageSection />
      <SubscriptionSection />
    </div>
  );
}
