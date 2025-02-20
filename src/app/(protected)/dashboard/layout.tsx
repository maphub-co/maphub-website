"use client";

// LIBRARIES
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Folder, Home, Settings } from "lucide-react";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import EntityManager from "@/components/entity/EntityManager";
import PageLoader from "@/components/ui/PageLoader";
import OrganizationDialog from "./_components/OrganizationDialog";
import UserUsage from "./_components/UserUsage";

/*======= LAYOUT =======*/
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, is_authenticated } = useAuthStore();
  const { last_registered_id } = useOrganizationsStore();
  const router = useRouter();
  const pathname = usePathname();
  const current_path = pathname.split("/")[2] || "home";

  /*------- HOOKS -------*/
  useEffect(() => {
    // redirect if something registered
    if (last_registered_id) {
      router.push(`/organizations/${last_registered_id}`);
    }
  }, []);

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
      {/* ASIDE */}
      <aside className="h-full p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r">
        {/* TOP */}
        <div className="flex flex-col gap-y-4">
          <EntityManager />

          <nav className="hidden md:flex flex-col gap-y-1">
            {/* HOME */}
            <Link
              href="/dashboard"
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
              href="/dashboard/workspaces"
              className={cn(
                "btn btn-ghost btn-size-default justify-start gap-x-2",
                current_path === "workspaces" &&
                  "bg-active text-active-foreground"
              )}
            >
              <Folder className="size-4" />
              My Datasets
            </Link>
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="hidden md:flex flex-col gap-y-1">
          {/* <OrganizationDialog /> */}

          <Link
            href="/settings"
            className="btn btn-ghost btn-size-default justify-start gap-x-2"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-h-full max-h-full bg-background-secondary overflow-x-hidden overflow-y-auto scroll-smooth">
        {children}
      </main>
    </div>
  );
}
