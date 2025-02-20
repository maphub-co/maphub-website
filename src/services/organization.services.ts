// INTERFACES
import { Organization, SubscriptionInfos, Tiers } from "@/interfaces/organization";

// API
import { api } from "@/services/api/maphub.api";

/*======= GET =======*/
export async function get_organization_async(organization_id: string) {
  try {
    const response = await api.get(`/organizations/${organization_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

/**
 * Search for organizations by name
 * @param query - The search query
 * @returns Array of organizations matching the query
 */
export async function search_organizations_async(
  query: string
): Promise<Organization[]> {
  try {
    const encoded_query = encodeURIComponent(query);
    const response = await api.get(
      `/organizations/search?query=${encoded_query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching organizations:", error);
    throw error;
  }
}

export async function get_subscription_infos_async(
  organization_id: string
): Promise<SubscriptionInfos> {
  try {
    const response = await api.get(
      `/organizations/${organization_id}/subscription`
    );

    return response.data;
  } catch (error) {
    console.error("Error setting organization tier:", error);
    throw error;
  }
}

export async function get_organization_quotas_async(organization_id: string) {
  try {
    const response = await api.get(`/organizations/${organization_id}/quotas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization quota:", error);
    throw error;
  }
}

export async function get_user_organizations_async() {
  try {
    const response = await api.get("/organizations");
    return response.data;
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    throw error;
  }
}

export async function get_organizations_workspaces_async(
  organization_id: string
) {
  try {
    const response = await api.get(
      `/organizations/${organization_id}/workspaces`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    throw error;
  }
}

export async function get_organization_members_async(organization_id: string) {
  try {
    const response = await api.get(`/organizations/${organization_id}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw error;
  }
}

/*======= OFFLINE SUBSCRIPTION (no Stripe) =======*/
export async function post_offline_subscription_change_async(
  organization_id: string,
  body: {
    tier?: Tiers;
    seats?: number;
    max_total_storage_gb?: number;
    action?: "upgrade" | "downgrade" | "change";
  }
) {
  try {
    const response = await api.post(
      `/organizations/${organization_id}/subscription/offline`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error updating offline subscription:", error);
    throw error;
  }
}

export async function get_organization_name_exists_async(
  organization_name: string
) {
  try {
    const encoded_name = encodeURIComponent(organization_name);
    const response = await api.get(
      `/organizations/exists?name=${encoded_name}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking organization name:", error);
    throw error;
  }
}

/*======= POST =======*/
export async function create_organization_async(
  organization_name: string,
  seats?: number
) {
  const payload = {
    name: organization_name,
    seats: seats ?? undefined,
  };

  try {
    const response = await api.post("/organizations", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}

/**
 * Create a subscription for an organization
 * @param organization_id - The ID of the organization
 * @param seats - The number of seats to create
 * @param is_trial - Whether the subscription is a trial
 * @returns An object with the URL to redirect to Stripe checkout
 */
export async function create_organization_subscription_async(
  organization_id: string,
  seats: number,
  is_trial: boolean
) {
  try {
    const response = await api.post(
      `/organizations/${organization_id}/subscription`,
      {
        seats,
        enable_trial: is_trial,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error setting organization tier:", error);
    throw error;
  }
}

/**
 * Send a join request to an organization
 * @param organization_id - The ID of the organization to join
 * @returns Promise that resolves when request is sent
 */
export async function send_organization_join_request_async(
  organization_id: string
): Promise<void> {
  try {
    await api.post(`/organizations/${organization_id}/join_request`);
  } catch (error) {
    console.error("Error sending join request:", error);
    throw error;
  }
}

export async function add_member_to_organization_async(
  organization_id: string,
  user_email: string
) {
  try {
    const response = await api.post(
      `/organizations/${organization_id}/members`,
      { email: user_email, tier: "Plus" }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding member to organization:", error);
    throw error;
  }
}

/*======= PUT =======*/
export async function update_organization_async(
  organization_id: string,
  data: Partial<Pick<Organization, "name" | "description">>
): Promise<Organization> {
  try {
    const response = await api.put(`/organizations/${organization_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
}

export async function update_subscription_async(organization_id: string) {
  try {
    const response = await api.put(
      `/organizations/${organization_id}/subscription`
    );

    return response.data;
  } catch (error) {
    console.error("Error setting organization tier:", error);
    throw error;
  }
}

export async function update_organization_logo_async(
  organization_id: string,
  logo: File
): Promise<Organization> {
  try {
    const formData = new FormData();
    formData.append("file", logo);
    const response = await api.put(
      `/organizations/${organization_id}/logo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
}

/*======= DELETE =======*/
export async function delete_organization_member_async(
  organization_id: string,
  member_id: string
) {
  try {
    await api.delete(`/organizations/${organization_id}/members/${member_id}`);
  } catch (error) {
    console.error("Error removing member from organization:", error);
    throw error;
  }
}

export async function delete_organization_async(organization_id: string) {
  try {
    await api.delete(`/organizations/${organization_id}`);
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
}
