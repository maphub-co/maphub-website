import { redirect } from "next/navigation";

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  redirect(`/organizations/${id}/settings/general`);
}
