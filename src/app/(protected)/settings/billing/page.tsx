// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import SubscriptionClient from "./page.client";

export const metadata: Metadata = {
  title: "Settings | Subscription",
  description: "Manage your subscription.",
};

export default async function SubscriptionPage() {
  return <SubscriptionClient />;
}
