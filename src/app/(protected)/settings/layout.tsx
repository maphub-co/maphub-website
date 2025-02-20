"use client";

// INTERFACES
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  CreditCard,
  Key,
  Settings,
  Settings2,
  User,
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
  const pathname = usePathname();
  const { user } = useUserStore();
  const { loading, is_authenticated } = useAuthStore();
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

  const [selected_entity, other_entities] = useMemo(() => {
    if (!user) return [null, []];

    const personal: Entity = user_to_entity(user);
    const entities: Entity[] = organizations.map((org) =>
      organization_to_entity(org)
    );

    return [personal, entities];
  }, [user, organizations]);

  /*------- RENDERER -------*/
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
              <Link href="/dashboard" className="font-bold hover:underline">
                {selected_entity.name}
              </Link>
              <ContextSwitcher entities={other_entities} />
            </div>
          </div>
        )}

        <Link
          href="/dashboard/workspaces"
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
          {/* PROFILE */}
          <li className="w-full">
            <Link
              href="/settings/profile"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/profile") &&
                  "bg-active text-active-foreground"
              )}
            >
              <User className="size-4" />
              Profile
            </Link>
          </li>

          {/* ACCOUNT */}
          <li className="w-full">
            <Link
              href="/settings/account"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/account") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Settings className="size-4" />
              Account
            </Link>
          </li>

          {/* PREFERENCES */}
          <li className="w-full">
            <Link
              href="/settings/preferences"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/preferences") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Settings2 className="size-4" />
              Preferences
            </Link>
          </li>
        </ul>

        <hr className="w-full my-2 border-t border-border-1" />

        <ul className="w-full flex flex-col">
          <span className="text-xs font-medium px-3 py-2">Access</span>

          {/* BILLING & SUBSCRIPTION */}
          {/* <li className="w-full">
            <Link
              href="/settings/billing"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/billing") &&
                  "bg-active text-active-foreground"
              )}
            >
              <CreditCard className="size-4" />
              Billing & Subscription
            </Link>
          </li> */}

          {/* API KEYS */}
          <li className="w-full">
            <Link
              href="/settings/api-keys"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/api-keys") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Key className="size-4" />
              API Keys
            </Link>
          </li>

          {/* ORGANIZATIONS */}
          <li className="w-full">
            <Link
              href="/settings/organizations"
              className={cn(
                "btn btn-ghost btn-size-default w-full px-3 justify-start gap-x-2 font-normal",
                is_active("/settings/organizations") &&
                  "bg-active text-active-foreground"
              )}
            >
              <Building2 className="size-4" />
              Organizations
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}

function ContextSwitcher({ entities }: { entities: Entity[] }) {
  /*------- ATTRIBUTES -------*/
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
