"use client";

// INTERFACES
import { SubscriptionStatus } from "@/interfaces/organization";

// LIBRARIES
import { useParams } from "next/navigation";
import Link from "next/link";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import SubscriptionCalendar from "@/components/icons/SubscriptionCalendar";

/*======= COMPONENT =======*/
export default function SubscriptionChecker() {
  /*------- ATTRIBUTES -------*/
  const { organizations } = useOrganizationsStore();
  const { id } = useParams();
  const organization = organizations.find(
    (organization) => organization.id === id
  );

  /*------- RENDERER -------*/
  if (!organization) return <></>;

  if (
    organization.subscription_status === SubscriptionStatus.ACTIVE ||
    organization.subscription_status === SubscriptionStatus.TRIALING
  )
    return <></>;

  return <SubscriptionErrorDialog />;
}

function SubscriptionErrorDialog() {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const { set_last_registered_id } = useOrganizationsStore();

  /*------- RENDERER -------*/
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-xs p-0 flex flex-col items-center justify-center gap-0"
        closeButton={null}
      >
        <DialogHeader className="w-full p-4 border-b">
          <DialogTitle className="text-center text-lg">
            Subscription Inactive
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center gap-y-6">
          <SubscriptionCalendar size={16} />

          <p className="text-sm text-muted-foreground text-center">
            Your subscription is inactive. Go to your organization settings to
            manage your subscription.
          </p>
        </div>

        <DialogFooter className="w-full p-4 flex !flex-col gap-y-2">
          <Link
            href={`/organizations/${id}/settings/billing`}
            className="btn btn-primary btn-size-default w-full"
          >
            Manage subscription
          </Link>

          <Link
            href={"/dashboard"}
            className="btn btn-outline btn-size-default w-full"
            onClick={() => set_last_registered_id(null)}
          >
            Return to personal
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
