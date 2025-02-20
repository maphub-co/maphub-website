"use client";

// LIBRARIES
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { get_organization_async } from "@/services/organization.services";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}

function CheckoutSuccessClient() {
  /*------- ATTRIBUTES -------*/
  const search_params = useSearchParams();
  const router = useRouter();
  const organization_id = search_params.get("organization_id");
  const { set_last_registered_id } = useOrganizationsStore();

  /*------- METHODS -------*/
  const update_and_redirect = async () => {
    try {
      // Wait 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Get organization
      const organization = await get_organization_async(
        organization_id as string
      );

      set_last_registered_id(organization.id);
      router.push(`/organizations/${organization.id}/workspaces`);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization. Please try again later",
      });

      set_last_registered_id(null);
      router.push(`/dashboard/workspaces`);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    // Start the update and redirect process
    update_and_redirect();
  }, []);

  /*------- RENDER -------*/
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">You're all set !</h1>

        <div className="flex flex-col justify-center items-center gap-y-4">
          <Loader2 className="size-8 animate-spin" />

          <span className="text-muted-foreground">
            Redirecting to your dashboard...
          </span>
        </div>
      </div>
    </div>
  );
}
