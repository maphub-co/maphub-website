"use client";

// INTERFACES
import { Organization } from "@/interfaces/organization";

// LIBRARIES
import { useEffect, useState } from "react";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { Settings, Loader2, Building2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";
import { organization_to_entity } from "@/utils/entity.utils";

// COMPONENTS
import EntityAvatar from "@/components/entity/EntityAvatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export default function OrganizationsSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { user } = useUserStore();
  const [load_organizations, is_loading, organizations, leave_organization] =
    useOrganizationsStore(
      useShallow((state) => [
        state.load_organizations,
        state.is_loading,
        state.organizations,
        state.leave_organization,
      ])
    );
  const [is_dialog_open, set_dialog_open] = useState(false);
  const [leaving_id, set_leaving_id] = useState<string | null>(null);

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!user) return;

    load_organizations();
  }, [user]);

  /*------- METHODS -------*/
  const handle_leave = async (org: Organization) => {
    if (!user) return;

    if (org.owner_uid === user.uid) {
      toast({
        title: "Impossible to leave this organization",
        description:
          "You have to pass the ownership of this organization to another member before leaving.",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to leave this organization ?"))
      return;

    set_leaving_id(org.id);
    try {
      await leave_organization(org.id, user.uid);
      toast({
        title: "Success",
        description: "You have left the organization successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave organization. Please try again later.",
      });
    } finally {
      set_leaving_id(null);
    }
  };

  /*------- RENDERER -------*/
  return (
    <section className={cn("w-full flex flex-col gap-y-8", className)}>
      {/* TITLE */}
      <div className="flex justify-between items-center gap-x-2 border-b pb-2">
        <h1 className="text-xl md:text-2xl font-medium">Organizations</h1>

        <Link
          href="/organizations/new"
          className="btn btn-primary btn-size-default"
        >
          Create new Organization
        </Link>
      </div>

      {/* ORGANIZATION LIST */}
      <div className="flex flex-col">
        {is_loading ? (
          <div className="w-full flex flex-col items-center justify-center gap-y-2 mt-2">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="w-full h-40 p-4 flex flex-col items-center justify-center gap-y-4">
            <Building2 className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click "Create new Organization" to get started.
            </p>
          </div>
        ) : (
          organizations.map((org) => {
            const is_owner = user && org.owner_uid === user.uid;
            return (
              <div
                key={org.id}
                className="p-4 flex items-center gap-x-4 border-b"
              >
                <div className="w-32 flex items-center gap-x-2">
                  <EntityAvatar entity={organization_to_entity(org)} size={6} />
                  <span className="font-semibold truncate flex-1">
                    {org.name}
                  </span>
                </div>

                {is_owner && <Badge variant="secondary">Owner</Badge>}

                <div className="flex items-center gap-x-2 ml-auto">
                  {is_owner && (
                    <Link href={`/organizations/${org.id}/settings`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 flex items-center gap-x-1"
                      >
                        <Settings className="size-4" /> Settings
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handle_leave(org)}
                    disabled={leaving_id === org.id}
                  >
                    {leaving_id === org.id ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Leaving...
                      </>
                    ) : (
                      "Leave"
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
