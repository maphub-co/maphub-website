import Link from "next/link";

export default function SubscriptionSection() {
  return (
    <div className="w-full flex flex-col gap-y-8">
      {/* HEADER */}
      <div className="flex items-center border-b pb-2">
        <h1 className="text-xl md:text-2xl font-medium">
          Billing & Subscription
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-y-2">
        <p>
          The billing system of MapHub.co is currently based on organizations.
          If you want to upgrade your plan, you must first create a new
          organization.
        </p>
        <p>
          Once created, you'll be able to manage your plan from the organization
          settings.
        </p>
      </div>

      <Link
        href="/settings/organizations"
        className="btn btn-primary btn-size-default w-fit"
      >
        Go to organizations
      </Link>
    </div>
  );
}
