import axios from "axios";

/*======= INTERFACES =======*/
interface CustomField {
  name: string;
  value: string;
}

interface SubscriptionResponse {
  data: {
    id: string;
    email: string;
    status: string;
    created: number;
    subscription_tier: string;
    subscription_premium_tier_names: string[];
    utm_source: string;
    utm_medium: string;
    utm_channel: string;
    utm_campaign: string;
    referring_site: string;
    referral_code: string;
  };
}

interface AddSubscriptionTagResponse extends SubscriptionResponse {
  tags?: string[];
}

/*======= API =======*/
const api = axios.create({
  baseURL: "https://api.beehiiv.com/v2",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_BEEHIIV_API_KEY}`,
  },
});

/*======= FUNCTIONS =======*/
/*------- Private -------*/
async function create_subscription_async(
  email: string,
  utm_medium: string,
  automation_ids?: string[],
  custom_fields?: CustomField[]
) {
  const publication_id = process.env.NEXT_BEEHIIV_PUBLICATION_ID;

  try {
    // Create subscription
    const response = await api.post<SubscriptionResponse>(
      `/publications/${publication_id}/subscriptions`,
      {
        email,
        send_welcome_email: true,
        utm_source: "website",
        utm_medium: utm_medium,
        utm_campaign: "subscription",
        reactivate_existing: true,
        referring_site: "https://www.maphub.co",
        automation_ids: automation_ids,
        custom_fields: custom_fields,
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to subscribe to newsletter"
    );
  }
}

async function add_subscription_tag_async(
  subscription_id: string,
  tags: string[]
) {
  const publication_id = process.env.NEXT_BEEHIIV_PUBLICATION_ID;

  if (tags.length === 0) {
    throw new Error("Tags are required");
  }

  try {
    // Add newsletter tag
    const response = await api.post<AddSubscriptionTagResponse>(
      `/publications/${publication_id}/subscriptions/${subscription_id}/tags`,
      {
        tags: tags,
      }
    );

    return {
      message: "success",
      subscription: response.data.data,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add subscription tags"
    );
  }
}

/*------- Public -------*/
const enabled = !!(
  process.env.NEXT_BEEHIIV_API_KEY &&
  process.env.NEXT_BEEHIIV_PUBLICATION_ID &&
  (process.env.NEXT_BEEHIIV_ENABLED === "true" || (process.env.NEXT_BEEHIIV_ENABLED as any) === true)
);

export async function subscribe_to_beehiiv_newsletter_async(email: string) {
  if (!enabled) return; // no-op when disabled
  const automation_ids = ["aut_967cf3e1-9bda-4628-bca0-d85b97cc4b67"];

  try {
    const subscription = await create_subscription_async(
      email,
      "newsletter",
      automation_ids
    );
    await add_subscription_tag_async(subscription.id, ["newsletter"]);
    return {
      message: "Success ! Check your email.",
      subscription: subscription,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
