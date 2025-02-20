import { User } from "@/interfaces/user";

export const get_stripe_plus_url = (user: User | null) => {
  if (!user?.email || !user?.uid) return "#";
  const params = new URLSearchParams({
    prefilled_email: user.email,
    client_reference_id: user.uid,
  });
  const base_url = process.env.NEXT_PUBLIC_STRIPE_PLUS_BUY_URL;
  return `${base_url}?${params.toString()}`;
};

export const get_stripe_pro_url = (user: User | null) => {
  if (!user?.email || !user?.uid) return "#";
  const params = new URLSearchParams({
    prefilled_email: user.email,
    client_reference_id: user.uid,
  });
  const base_url = process.env.NEXT_PUBLIC_STRIPE_PRO_BUY_URL;
  return `${base_url}?${params.toString()}`;
};

// Legacy function - defaults to Plus for backward compatibility
export const get_stripe_url = (user: User | null) => {
  return get_stripe_plus_url(user);
};

export const get_billing_url = (user: User | null) => {
  if (!user?.email || !user?.uid) return "#";
  const params = new URLSearchParams({
    prefilled_email: user.email,
    client_reference_id: user.uid,
  });
  const base_url = process.env.NEXT_PUBLIC_STRIPE_BILLING_URL;
  return `${base_url}?${params.toString()}`;
};
