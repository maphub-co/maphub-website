// INTERFACES
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { useEffect, useState, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import {
  ChevronDown,
  Plus,
  Check,
  Settings,
  UserPlus,
  TriangleAlert,
} from "lucide-react";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";
import { organization_to_entity, user_to_entity } from "@/utils/entity.utils";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Skeleton } from "../ui/Skeleton";
import EntityAvatar from "@/components/entity/EntityAvatar";
import AddMembersDialog from "@/components/organizations/AddMembersDialog";
import { Organization } from "@/interfaces/organization";

/*======= COMPONENTS =======*/
export default function EntityManager({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const pathname = usePathname();
  const [loading] = useAuthStore(useShallow((state) => [state.loading]));
  const [user] = useUserStore(useShallow((state) => [state.user]));
  const [
    is_loading,
    load_organizations,
    organizations,
    set_last_registered_id,
  ] = useOrganizationsStore(
    useShallow((state) => [
      state.is_loading,
      state.load_organizations,
      state.organizations,
      state.set_last_registered_id,
    ])
  );
  const [switcher_open, set_switcher_open] = useState(false);
  const [invite_open, set_invite_open] = useState(false);
  const switcher_ref = useRef<HTMLDivElement>(null);

  /*------- METHODS -------*/
  const handle_organization_clicked = (organization: Organization) => {
    set_switcher_open(false);
    set_last_registered_id(organization.id);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!user) return;

    load_organizations();
  }, [user]);

  const [selected_entity] = useMemo(() => {
    if (!user || is_loading) return [null, []];

    const personal: Entity = user_to_entity(user);
    const entities: Entity[] = organizations.map((org) =>
      organization_to_entity(org)
    );

    if (pathname.includes("organizations") && organizations.length > 0) {
      const organization_id = pathname.split("/")[2];
      const organization: Entity | undefined = entities.find(
        (entity) => entity.id === organization_id
      );

      if (!organization) {
        router.push("/dashboard/workspaces");
        set_last_registered_id(null);
        return [personal, [personal, ...entities]];
      }

      return [organization, [personal, ...entities]];
    } else {
      return [personal, [personal, ...entities]];
    }
  }, [user, organizations]);

  useEffect(() => {
    function handle_click_outside(event: MouseEvent) {
      if (
        switcher_ref.current &&
        !switcher_ref.current.contains(event.target as Node)
      ) {
        set_switcher_open(false);
      }
    }

    if (switcher_open) {
      document.addEventListener("mousedown", handle_click_outside);
    } else {
      document.removeEventListener("mousedown", handle_click_outside);
    }

    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [switcher_open]);

  /*------- RENDERER -------*/
  if (loading || is_loading) return <Skeleton className="w-full h-8" />;

  if (!selected_entity) return <></>;

  return (
    <div className={cn("relative w-full", className)} ref={switcher_ref}>
      <Button
        id="entity-manager"
        variant="ghost"
        className="w-full flex gap-x-2"
        onClick={() => set_switcher_open(!switcher_open)}
      >
        {/* NAME */}
        <div className="flex-1 flex items-center gap-x-2 min-w-0">
          <EntityAvatar entity={selected_entity} size={5} />

          <span className="flex-1 text-left font-semibold overflow-hidden text-ellipsis">
            {selected_entity.name}
          </span>
        </div>

        {/* ARROW */}
        <ChevronDown
          className={cn(
            "size-3 transition-transform",
            switcher_open && "rotate-180"
          )}
        />
      </Button>

      {switcher_open && (
        <div className="mt-2 w-full lg:min-w-80 flex flex-col absolute left-0 z-50 bg-background-primary border border-border rounded-lg shadow-lg">
          {/* CURRENT ORGANIZATION */}
          <div className="flex flex-col gap-y-2 p-4 border-b border-border">
            <div className="flex items-center gap-x-2">
              <EntityAvatar entity={selected_entity} size={8} />
              <span className="font-semibold">{selected_entity.name}</span>
            </div>

            {/* Edit buttons */}
            {selected_entity.type === "organization" &&
              user?.uid === selected_entity.owner_uid && (
                <div className="flex gap-x-2">
                  {/* SETTINGS BUTTON */}
                  <Link
                    href={`/organizations/${selected_entity.id}/settings`}
                    className="btn btn-outline btn-size-sm text-xs font-medium gap-x-1"
                  >
                    <Settings className="size-4" />
                    Settings
                  </Link>

                  {/* INVITE BUTTON */}
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-xs font-medium gap-x-1"
                    onClick={() => {
                      set_invite_open(true);
                      set_switcher_open(false);
                    }}
                  >
                    <UserPlus className="size-4" />
                    Invite members
                  </Button>
                </div>
              )}
          </div>

          {/* ENTITIES LIST */}
          <div className="p-4 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                My organizations
              </span>

              <ul className="flex flex-col gap-y-1">
                {/* ORGANIZATION LIST */}
                {organizations.map((organization: Organization) => (
                  <Link
                    key={organization.id}
                    href={`/organizations/${organization.id}/workspaces`}
                    className={`btn btn-ghost btn-size-default md:btn-size-sm justify-start w-full gap-x-2 transition-colors ${
                      selected_entity.id === organization.id
                        ? "bg-hover text-hover-foreground font-semibold"
                        : ""
                    }`}
                    onClick={() => handle_organization_clicked(organization)}
                  >
                    <EntityAvatar
                      entity={organization_to_entity(organization)}
                      size={5}
                      fallback_bg={false}
                    />
                    <span className="flex-1 text-left">
                      {organization.name}
                    </span>
                    {selected_entity.id === organization.id && (
                      <Check className="size-4" />
                    )}
                  </Link>
                ))}

                {/* NEW ORGANIZATION */}
                <Link
                  href="/organizations/new"
                  className="btn btn-ghost btn-size-default md:btn-size-sm justify-start w-full gap-x-2 text-muted-foreground"
                >
                  <Plus className="size-4" />
                  <span>New Organization</span>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      )}

      {selected_entity.type === "organization" && (
        <AddMembersDialog
          organization_id={selected_entity.id}
          is_open={invite_open}
          on_close={() => set_invite_open(false)}
        />
      )}
    </div>
  );
}
