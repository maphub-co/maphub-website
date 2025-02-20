"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Folder, Home, Settings, UserPlus } from "lucide-react";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import TourProvider from "@/components/providers/TourProvider";
import EntityManager from "@/components/entity/EntityManager";
import OrganizationUsage from "./_components/OrganizationUsage";
import AddMembersDialog from "@/components/organizations/AddMembersDialog";
import SubscriptionChecker from "./_components/SubscriptionChecker";

/*======= LAYOUT =======*/
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, is_authenticated } = useAuthStore();
  const { organizations } = useOrganizationsStore();
  const { id: organization_id } = useParams();
  const selected_organization = organizations.find(
    (organization) => organization.id === organization_id
  );
  const pathname = usePathname();
  const current_path = pathname.split("/")[3] || "home";
  const [is_invite_open, set_invite_open] = useState(false);

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

  return (
    <div
      className={cn(
        "w-full h-full grid grid-rows-[auto_1fr]",
        "md:grid-cols-[256px_1fr] md:grid-rows-1"
      )}
    >
      <TourProvider>
        {/* ASIDE */}
        <aside className="h-full p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r">
          {/* TOP */}
          <div className="flex flex-col gap-y-4">
            <EntityManager />

            <nav className="hidden md:flex flex-col gap-y-1">
              {/* HOME */}
              <Link
                href={`/organizations/${organization_id}`}
                className={cn(
                  "btn btn-ghost btn-size-default justify-start gap-x-2",
                  current_path === "home" && "bg-active text-active-foreground"
                )}
              >
                <Home className="size-4" />
                Home
              </Link>

              {/* MY DATASETS */}
              <Link
                href={`/organizations/${organization_id}/workspaces`}
                className={cn(
                  "btn btn-ghost btn-size-default justify-start gap-x-2",
                  current_path === "workspaces" &&
                    "bg-active text-active-foreground"
                )}
              >
                <Folder className="size-4" />
                Datasets
              </Link>
            </nav>
          </div>

          {/* BOTTOM */}
          {selected_organization && (
            <div className="hidden md:flex flex-col gap-y-1">
              <Button
                id="add-members-button"
                variant="ghost"
                size="default"
                className="w-full justify-start gap-x-2"
                onClick={() => {
                  set_invite_open(true);
                }}
              >
                <UserPlus className="size-4" />
                Add team members
              </Button>

              <Link
                href={`/organizations/${organization_id}/settings`}
                className="btn btn-ghost btn-size-default justify-start gap-x-2"
              >
                <Settings className="size-4" />
                Organization Settings
              </Link>

              <OrganizationUsage />
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="h-full bg-background-secondary overflow-y-auto scroll-smooth relative">
          {children}
        </main>
      </TourProvider>

      {/* SUBSCRIPTION CHECKER */}
      <SubscriptionChecker />

      {/* ADD MEMBERS DIALOG */}
      <AddMembersDialog
        organization_id={organization_id as string}
        is_open={is_invite_open}
        on_close={() => set_invite_open(false)}
      />
    </div>
  );
}
