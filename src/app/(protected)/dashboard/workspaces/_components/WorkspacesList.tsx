"use client";

// LIBRARIES
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";
import { organization_to_entity } from "@/utils/entity.utils";

// COMPONENTS
import { Skeleton } from "@/components/ui/Skeleton";
import EntityAvatar from "@/components/entity/EntityAvatar";
import { Organization } from "@/interfaces/organization";

/*======= COMPONENT =======*/
export default function WorkspacesList() {
  /*------- ATTRIBUTES -------*/
  const [is_loading, organizations] = useOrganizationsStore(
    useShallow((state) => [state.is_loading, state.organizations])
  );

  /*------- RENDERER -------*/
  if (is_loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center p-4 gap-y-8">
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold pb-4 md:pb-6 border-b">
        Your workspaces:
      </h1>

      {/* ORGANIZATIONS LIST */}
      <ul className="flex flex-col">
        {organizations.map((organization: Organization) => (
          <li key={organization.id}>
            <Link
              href={`/organizations/${organization.id}/workspaces`}
              className={cn(
                "p-4 flex items-center gap-x-4 border-b",
                "hover:bg-hover hover:text-hover-foreground transition-colors"
              )}
            >
              <EntityAvatar
                entity={organization_to_entity(organization)}
                size={8}
                fallback_bg={false}
              />
              <div className="flex-1 flex flex-col gap-y-1">
                <span className="font-medium">{organization.name}</span>
                {organization.description && (
                  <span className="text-sm text-muted-foreground">
                    {organization.description}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
