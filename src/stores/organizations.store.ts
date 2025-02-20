"use client";

// LIBRARIES
import { create } from "zustand";
import { persist } from "zustand/middleware";

// INTERFACES
import { Organization } from "@/interfaces/organization";

// SERVICES
import {
  get_user_organizations_async,
  create_organization_async,
  update_organization_async,
  update_organization_logo_async,
  delete_organization_member_async,
  delete_organization_async,
} from "@/services/organization.services";

/*======= TYPE =======*/
interface OrganizationsState {
  // State
  last_registered_id: string | null;
  set_last_registered_id: (last_registered_id: string | null) => void;
  organizations: Organization[];
  is_loading: boolean;

  // Actions
  load_organizations: () => Promise<void>;
  create_organization: (organization_name: string) => Promise<Organization>;
  update_organization: (
    organization_id: string,
    data: Partial<Pick<Organization, "name" | "description">>
  ) => Promise<void>;
  update_organization_logo: (
    organization_id: string,
    logo: File
  ) => Promise<void>;
  leave_organization: (
    organization_id: string,
    member_id: string
  ) => Promise<void>;
  delete_organization: (organization_id: string) => Promise<void>;
}

/*======= STORE =======*/
export const useOrganizationsStore = create<OrganizationsState>()(
  persist(
    (set, get) => ({
      // State
      last_registered_id: null, // used in DashboardLink in the header, and in the dashboard layout for redirects
      set_last_registered_id: (last_registered_id: string | null) =>
        set({ last_registered_id }), // used in EntityManager and settings/ContextSwitcher,
      organizations: [],
      is_loading: false,

      /*------- GET -------*/
      load_organizations: async () => {
        set({ is_loading: true });
        try {
          const organizations = await get_user_organizations_async();

          set({ organizations });
        } catch (error) {
          throw error;
        } finally {
          set({ is_loading: false });
        }
      },

      /*------- POST -------*/
      create_organization: async (
        organization_name: string
      ): Promise<Organization> => {
        set({ is_loading: true });
        try {
          const new_organization = await create_organization_async(
            organization_name
          );
          const organizations = [...get().organizations, new_organization];

          set({ organizations });

          return new_organization;
        } catch (error) {
          throw error;
        } finally {
          set({ is_loading: false });
        }
      },

      /*------- PUT -------*/
      update_organization: async (
        organization_id: string,
        data: Partial<Pick<Organization, "name" | "description">>
      ) => {
        set({ is_loading: true });
        try {
          const updated_organization = await update_organization_async(
            organization_id,
            data
          );
          const organizations = get().organizations.map((org) =>
            org.id === organization_id
              ? { ...org, ...updated_organization }
              : org
          );
          set({ organizations });
        } catch (error) {
          throw error;
        } finally {
          set({ is_loading: false });
        }
      },

      update_organization_logo: async (organization_id: string, logo: File) => {
        try {
          const organization = await update_organization_logo_async(
            organization_id,
            logo
          );

          const organizations = get().organizations.map((org) =>
            org.id === organization_id ? organization : org
          );
          set({ organizations });
        } catch (error) {
          throw error;
        }
      },

      /*------- DELETE -------*/
      leave_organization: async (
        organization_id: string,
        member_id: string
      ) => {
        try {
          await delete_organization_member_async(organization_id, member_id);
          const organizations = get().organizations.filter(
            (org) => org.id !== organization_id
          );

          set({ organizations });
        } catch (error) {
          throw error;
        }
      },

      delete_organization: async (organization_id: string) => {
        try {
          set({ last_registered_id: null });
          await delete_organization_async(organization_id);
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "organizations-store",
      partialize: (state) => ({
        last_registered_id: state.last_registered_id,
      }),
    }
  )
);
