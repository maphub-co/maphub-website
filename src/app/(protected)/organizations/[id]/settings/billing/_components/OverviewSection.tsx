"use client";

// TYPES
import {
  OrganizationQuotas,
  SubscriptionInfos,
  SubscriptionStatus,
  Tiers,
} from "@/interfaces/organization";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// SERVICES
import {
  create_organization_subscription_async,
  get_organization_quotas_async,
  get_subscription_infos_async,
  update_subscription_async,
  post_offline_subscription_change_async,
} from "@/services/organization.services";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export default function OverviewSection({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const [organizations, load_organizations] = useOrganizationsStore((state) => [
    state.organizations,
    state.load_organizations,
  ]);
  const organization = organizations.find((org) => org.id === id);
  const [subscription, set_subscription] = useState<SubscriptionInfos | null>(
    null
  );
  const [quotas, set_quotas] = useState<OrganizationQuotas | null>(null);
  const [plan, set_plan] = useState<string | null>(null);
  const [stripe_url, set_stripe_url] = useState<string | null>(null);
  const [error, set_error] = useState<string | null>(null);
  const [is_loading, set_loading] = useState(false);
  const [is_saving_offline, set_is_saving_offline] = useState(false);

  // Offline form state
  const [offline_seats, set_offline_seats] = useState<number | "">("");
  const [offline_storage_gb, set_offline_storage_gb] = useState<number | "">("");

  /*------- METHODS -------*/
  const fetch_subscription_price = async () => {
    try {
      const response = await get_subscription_infos_async(id as string);
      const current_plan =
        response.total_price >= 400
          ? "The Atlas"
          : response.total_price >= 45
          ? "Cartographer"
          : response.total_price >= 15
          ? "Navigator"
          : "Explorer";

      set_plan(current_plan);
      set_subscription(response);
    } catch (error: any) {
      console.error("Error fetching subscription price:", error);
    }
  };

  const fetch_organization_quotas = async () => {
    try {
      const response = await get_organization_quotas_async(id as string);
      set_quotas(response);
    } catch (error: any) {
      console.error("Error fetching organization quotas:", error);
    }
  };

  const fetch_stripe_url = async () => {
    if (!id) return;

    set_loading(true);
    try {
      const response = await update_subscription_async(id as string);

      set_stripe_url(response.url);
    } catch (error: any) {
      console.error("Error fetching organization subscription URL:", error);

      if (error.data.detail) {
        set_error(error.data.detail);
      }
    } finally {
      set_loading(false);
    }
  };

  const is_offline_mode = (() => {
    if (!stripe_url) return false;
    try {
      const parsed = new URL(stripe_url, window.location.origin);
      return !parsed.host.endsWith("stripe.com");
    } catch {
      return false;
    }
  })();

  const submit_offline_changes = async () => {
    if (!id) return;
    if (!organization) return;
    try {
      set_is_saving_offline(true);
      set_error(null);

      const body: any = {};
      if (offline_seats !== "") body.seats = Number(offline_seats);
      if (offline_storage_gb !== "")
        body.max_total_storage_gb = Number(offline_storage_gb);

      await post_offline_subscription_change_async(id as string, body);

      // Refresh local state: quotas and organizations store
      await fetch_organization_quotas();
      await load_organizations();

    } catch (err: any) {
      const detail = err?.data?.detail || err?.message || "Unknown error";
      set_error(detail);
    } finally {
      set_is_saving_offline(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!id) return;

    fetch_subscription_price();
    fetch_organization_quotas();
    fetch_stripe_url();
  }, [id]);

  /*------- RENDERER -------*/
  if (!quotas || !organization) return null;

  const is_subscription_active =
    organization.subscription_status === SubscriptionStatus.ACTIVE ||
    organization.subscription_status === SubscriptionStatus.TRIALING;

  return (
    <section
      className={cn(
        "w-full flex flex-col gap-y-8",
        !is_subscription_active && "text-muted-foreground",
        className
      )}
    >
      {/* TITLE */}
      <div className="flex items-center justify-between gap-x-2 border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">Overview</h2>
      </div>

      {/* SUBSCRIPTION ERROR */}
      {!is_subscription_active && (
        <>
          {/* PAST DUE */}
          {organization.subscription_status === SubscriptionStatus.PAST_DUE ||
            (organization.subscription_status ===
              SubscriptionStatus.CANCELED && (
              <Alert variant="destructive">
                {/* TITLE */}
                <AlertTitle className="flex items-center gap-x-2">
                  <AlertTriangle className="size-5" />
                  End of your free trial
                </AlertTitle>

                {/* DESCRIPTION */}
                <AlertDescription className="mt-2">
                  Your free trial period has ended. To continue using MapHub,
                  please add a payment method to settle your outstanding
                  balance.
                </AlertDescription>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={stripe_url || "#"}
                    target="_blank"
                    className={cn(
                      "btn btn-outline border-destructive text-destructive hover:text-destructive-hover btn-size-default",
                      !stripe_url &&
                        "pointer-events-none text-muted-foreground border-muted-foreground"
                    )}
                  >
                    {is_loading ? (
                      <Loader2 className="size-4 animate-spin text-muted" />
                    ) : (
                      "Manage billing"
                    )}
                  </Link>

                  <Link
                    href={`/organizations/${id}/settings/general#delete-organization-section`}
                    className="btn btn-destructive btn-size-default"
                  >
                    Delete organization
                  </Link>
                </div>
              </Alert>
            ))}

          {/* INACTIVE */}
          {organization.subscription_status === SubscriptionStatus.INACTIVE && (
            <InactiveAlert />
          )}
        </>
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0 md:gap-x-4">
        {/* CURRENT PLAN */}
        <Card
          className={cn(
            "h-full p-4 flex flex-col gap-y-4",
            !is_subscription_active &&
              "text-muted-foreground pointer-events-none"
          )}
        >
          {/* HEADER */}
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current plan
            </CardTitle>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="p-0">
            <span className="text-xl font-medium capitalize leading-none">
              {plan || "Explorer"}
            </span>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="p-0 flex flex-col gap-y-2">
            {is_loading ? (
              <div className="w-full p-2 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : (
              <>
                {!is_offline_mode ? (
                  <Link
                    href={stripe_url || "#"}
                    className={cn(
                      "btn btn-outline btn-size-default w-full text-normal",
                      !stripe_url && "pointer-events-none text-muted-foreground"
                    )}
                    target="_blank"
                  >
                    Manage plan
                  </Link>
                ) : (
                  <div className="w-full">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex flex-col gap-1">
                        <Label>Seats</Label>
                        <Input
                          type="number"
                          min={1}
                          value={
                            offline_seats === "" ? organization?.max_seats ?? "" : offline_seats
                          }
                          onChange={(e) =>
                            set_offline_seats(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label>Max storage (GB)</Label>
                        <Input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={
                            offline_storage_gb === ""
                              ? Math.round(((organization?.max_total_storage || 0) / (1024 ** 3)) * 10) / 10
                              : offline_storage_gb
                          }
                          onChange={(e) =>
                            set_offline_storage_gb(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      <Button
                        className="w-full"
                        disabled={is_saving_offline}
                        onClick={submit_offline_changes}
                      >
                        {is_saving_offline ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" /> Saving...
                          </span>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                      {error && (
                        <p className="text-sm text-destructive mt-1">{error}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardFooter>
        </Card>

        {/* SEATS */}
        {/* <Card
          className={cn(
            "h-full p-4 flex flex-col gap-y-4",
            !is_subscription_active &&
              "text-muted-foreground pointer-events-none"
          )}
        >
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Seats
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex items-end gap-x-1">
            <span className="text-xl font-medium leading-none">
              {quotas.seats.used}
            </span>
            <span className="text-sm font-medium text-muted-foreground leading-none">
              /{quotas.seats.limit}
            </span>
          </CardContent>

          <CardFooter className="p-0">
            <Link
              href={`/organizations/${id}/settings/members`}
              className="btn btn-outline btn-size-default w-full text-normal"
            >
              Manage members
            </Link>
          </CardFooter>
        </Card> */}

        {/* PRICE */}
        <Card
          className={cn(
            "h-full p-4 flex flex-col gap-y-4",
            !is_subscription_active &&
              "text-muted-foreground pointer-events-none"
          )}
        >
          {/* HEADER */}
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Price
            </CardTitle>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="p-0 flex items-end gap-x-1">
            {!!subscription ? (
              <>
                <span className="text-xl font-medium leading-none">
                  {plan === "Explorer"
                    ? "Free"
                    : `$${subscription.total_price}`}
                </span>
                <span className="text-sm font-medium text-muted-foreground leading-none">
                  /{subscription.interval}
                </span>
              </>
            ) : (
              <span className="text-xs italic">
                Click on the link below to see the details.
              </span>
            )}
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="p-0">
            {is_loading ? (
              <div className="w-full p-2 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : (
              <Link
                href={stripe_url || "#"}
                className={cn(
                  "btn btn-link btn-size-default w-full px-0 justify-start gap-x-1 text-normal",
                  !stripe_url && "pointer-events-none text-muted-foreground"
                )}
                target="_blank"
              >
                Manage billing
                <ExternalLink className="size-4" />
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* SUPPORT */}
      <p className="text-muted-foreground">
        For any questions, support or custom billing, please contact us directly
        at{" "}
        <Link
          href="mailto:maphub@meteory.eu"
          className="btn btn-link btn-sm text-muted-foreground font-semibold"
        >
          maphub@meteory.eu
        </Link>
        .
      </p>
    </section>
  );
}

function InactiveAlert() {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const [seats, set_seats] = useState(1);
  const [is_loading, set_loading] = useState(false);

  /*------- METHODS -------*/
  const handle_create_subscription = async () => {
    set_loading(true);
    try {
      const response = await create_organization_subscription_async(
        id as string,
        seats,
        true
      );

      const url = response.url;

      // Redirect to Stripe checkout
      if (url && url.trim() !== "") {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
      }
    } catch (error: any) {
      console.error("Error fetching organization subscription URL:", error);
    } finally {
      set_loading(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <Alert variant="destructive">
      {/* TITLE */}
      <AlertTitle className="flex items-center gap-x-2">
        <AlertTriangle className="size-5" />
        Subscription inactive
      </AlertTitle>

      {/* DESCRIPTION */}
      <div className="flex flex-col gap-y-2">
        <AlertDescription>
          Your subscription is inactive. Please select the number of seats you
          need, and add a payment method to start using your organization.
        </AlertDescription>

        {/* Counter to change number of seats */}
        <div className="text-foreground flex items-center gap-x-2">
          <Button
            variant={"outline"}
            onClick={() => set_seats((prev) => (prev === 1 ? 1 : prev - 1))}
            disabled={seats === 1 || is_loading}
          >
            -
          </Button>

          <div className="min-w-24 p-4 text-xl font-medium leading-none flex justify-center items-end gap-x-2">
            <span>{seats}</span>
            <span className="text-base leading-none">
              {seats <= 1 ? "seat" : "seats"}
            </span>
          </div>

          <Button
            variant={"outline"}
            onClick={() => set_seats((prev) => prev + 1)}
            disabled={is_loading}
          >
            +
          </Button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant={"outline"}
          className="min-w-16 border-destructive text-destructive hover:text-destructive-hover"
          onClick={handle_create_subscription}
          disabled={is_loading}
        >
          {is_loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            "Add payment method"
          )}
        </Button>

        <Link
          href={`/organizations/${id}/settings/general#delete-organization-section`}
          className={cn(
            "btn btn-destructive btn-size-default",
            is_loading && "pointer-events-none bg-destructive/10"
          )}
        >
          Delete organization
        </Link>
      </div>
    </Alert>
  );
}
