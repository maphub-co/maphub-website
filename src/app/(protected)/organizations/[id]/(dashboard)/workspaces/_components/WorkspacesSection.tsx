"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// SERVICES
import { get_organizations_workspaces_async } from "@/services/organization.services";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";

/*======= COMPONENT =======*/
export default function OrganizationsWorkspacesSection() {
  /*------- ATTRIBUTS -------*/
  const router = useRouter();
  const { id } = useParams();

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!id) return;

    const get_organization_workspace = async () => {
      try {
        const workspaces = await get_organizations_workspaces_async(
          id as string
        );
        const workspace = workspaces[0];
        router.push(`/organizations/${id}/workspaces/${workspace.id}`);
      } catch (error) {
        console.error(error);
      }
    };

    get_organization_workspace();
  }, [id]);

  /*------- RENDER -------*/
  return <PageLoader />;
}
