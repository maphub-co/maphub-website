import Link from "next/link";

export default function OrganizationNotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <span className="text-2xl font-semibold">(╭ರ_•́)</span>
        <h2 className="text-2xl font-semibold">Organization not found</h2>
        <p className="text-muted-foreground max-w-md">
          The organization you are looking for does not exist.
        </p>
      </div>

      <Link href="/dashboard" className="btn btn-primary btn-size-lg">
        Go back to your dashboard
      </Link>
    </div>
  );
}
