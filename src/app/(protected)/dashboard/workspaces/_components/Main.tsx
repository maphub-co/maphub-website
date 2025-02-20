"use client";

// LIBRARIES
import { useShallow } from "zustand/react/shallow";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";
import CreateOrJoin from "./CreateOrJoin";
import WorkspacesList from "./WorkspacesList";

/*======= COMPONENT =======*/
export default function WorkspacesSection() {
  /*------- ATTRIBUTES -------*/
  const [loading_organizations, organizations] = useOrganizationsStore(
    useShallow((state) => [state.is_loading, state.organizations])
  );

  /*------- RENDERER -------*/
  if (loading_organizations) {
    return <PageLoader />;
  }

  if (organizations.length > 0) {
    return <WorkspacesList />;
  }

  return <CreateOrJoin />;
}
