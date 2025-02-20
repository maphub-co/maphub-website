"use client";

// INTERFACES
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import {
  ArrowRight,
  ChevronDown,
  CreditCard,
  Lock,
  Settings,
  Users,
  X,
} from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";
import { organization_to_entity, user_to_entity } from "@/utils/entity.utils";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";
import OrganizationNotFound from "./not-found";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import EntityAvatar from "@/components/entity/EntityAvatar";

/*======= LAYOUT =======*/
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { id: organization_id } = useParams();
  const pathname = usePathname();
  const { loading, is_authenticated } = useAuthStore();
  const { user } = useUserStore();
  const [load_organizations, organizations] = useOrganizationsStore(
    useShallow((state) => [state.load_organizations, state.organizations])
  );

  /*------- METHODS -------*/
  const is_active = (path: string) => pathname.endsWith(path);

  /*------- HOOKS -------*/
  useEffect(() => {
    if (loading) return;

    if (!loading && !is_authenticated) {
      localStorage.setItem("login_return_url", window.location.pathname);
      router.push("/login");
      return;
    }

    load_organizations();
  }, [loading, is_authenticated]);

  const [selected_entity, other_entities, is_owner, not_found] = useMemo(() => {
    if (!organization_id || !user) return [null, [], true, false];

    const personal: Entity = user_to_entity(user);
    const entities: Entity[] = organizations.map((org) =>
      organization_to_entity(org)
    );

    const selected: Entity | undefined = entities.find(
      (org) => org.id === organization_id
    );

    if (!selected) {
      return [null, [], true, true];
    }

    const is_owner = user.uid === selected.owner_uid;

    const others = [
      personal,
      ...entities.filter((org) => org.id !== organization_id),
    ];

    return [selected, others, is_owner, false];
  }, [organization_id, user, organizations]);

  /*------- RENDERER -------*/
  if (loading) {
    return <PageLoader />;
  }

  if (not_found) {
    return <OrganizationNotFound />;
  }

  if (!is_owner) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
        <Lock className="size-12" />
        <p className="text-lg font-medium">
          You don't have the permissions to access this page.
        </p>
        <p className="text-sm text-muted-foreground">
          You must be the owner of the organization to access this page.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "container max-w-7xl min-h-full p-4 mx-auto",
        "grid grid-cols-1 grid-rows-[auto_auto_1fr] gap-4",
        "md:grid-cols-[200px_1fr] md:grid-rows-[auto_1fr] md:gap-8"
      )}
    >
      {/* HEADER */}
      <div className="col-span-1 md:col-span-2 w-full flex justify-between">
        {!!selected_entity && (
          <div className="flex items-center gap-x-4">
            <EntityAvatar entity={selected_entity} size={12} fallback_bg />
            <div className="flex flex-col gap-y-1">
              <Link
                href={`/organizations/${organization_id}`}
                className="font-bold hover:underline"
              >
                {selected_entity.name}
              </Link>
              <ContextSwitcher entities={other_entities} />
            </div>
          </div>
        )}

        <Link
          href={`/organizations/${organization_id}/workspaces`}
          className="h-fit md:py-4 flex items-center gap-x-2 text-muted-foreground"
        >
          <X className="size-6 md:hidden" />
          <span className="hidden md:block">Exit settings</span>
          <ArrowRight className="hidden md:block size-4" />
        </Link>
      </div>

      {/* NAV */}
      <nav className="w-full h-fit md:h-full flex flex-col">
        <ul className="w-full flex flex-col">
          {/* GENERAL */}
          <li className="w-full">
            <Link
              href={`/organizations/${organization_id}/settings/general`}
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/general") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Settings className="size-4" />
              General
            </Link>
          </li>
        </ul>

        <hr className="w-full my-2 border-t border-border-1" />

        <ul className="w-full flex flex-col">
          <span className="text-xs font-medium px-3 py-2">Access</span>

          {/* BILLING & SUBSCRIPTION */}
          <li className="w-full">
            <Link
              href={`/organizations/${organization_id}/settings/billing`}
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/billing") &&
                  "bg-active text-active-foreground"
              )}
            >
              <CreditCard className="size-4" />
              Billing & Subscription
            </Link>
          </li>

          {/* MEMBERS */}
          <li className="w-full">
            <Link
              href={`/organizations/${organization_id}/settings/members`}
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/members") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Users className="size-4" />
              Members
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}

function ContextSwitcher({ entities }: { entities: Entity[] }) {
  const { set_last_registered_id } = useOrganizationsStore();

  /*------- METHODS -------*/
  const handle_entity_clicked = (entity: Entity) => {
    set_last_registered_id(entity.type === "organization" ? entity.id : null);
  };

  /*------- RENDERER -------*/
  if (entities.length === 0) return null;
  return (
    <div className="flex items-center gap-x-2 text-xs text-primary font-medium">
      <DropdownMenu>
        {/* TRIGGER */}
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-x-1 cursor-pointer">
            <span>Switch settings context</span>
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>

        {/* CONTENT */}
        <DropdownMenuContent className="w-48" align="start">
          {entities.map((entity) => (
            <DropdownMenuItem key={entity.id} asChild>
              <Link
                href={
                  entity.type === "organization"
                    ? `/organizations/${entity.id}/settings`
                    : "/settings/profile"
                }
                className="w-full flex items-center gap-x-2"
                onClick={() => handle_entity_clicked(entity)}
              >
                <EntityAvatar entity={entity} size={4} />
                <span className="flex-1 truncate">{entity.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
