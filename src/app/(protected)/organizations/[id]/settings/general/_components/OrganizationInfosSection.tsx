"use client";

// INTERFACES
import { Organization } from "@/interfaces/organization";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Building2, Camera, Loader2, Save } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

/*======= COMPONENTS =======*/
function OrganizationLogoSection({
  organization,
  className,
}: {
  organization: Organization;
  className?: string;
}) {
  /*------- ATTRIBUTS -------*/
  const update_organization_logo = useOrganizationsStore(
    (state) => state.update_organization_logo
  );
  const [is_saving, set_is_saving] = useState(false);

  /*------- METHODS -------*/
  const upload_logo = async (logo: File) => {
    if (!logo) {
      return;
    }

    try {
      set_is_saving(true);
      await update_organization_logo(organization.id, logo);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload logo. Please try again.",
      });
    } finally {
      set_is_saving(false);
    }
  };

  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    // Check file type
    if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, or GIF image.",
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
      });
      return;
    }

    upload_logo(file);
  };

  /*------- RENDERER -------*/
  return (
    <section className={cn("w-full flex flex-col gap-y-4", className)}>
      <Label className="font-semibold leading-normal">Profile Picture</Label>

      <div className="size-48 flex items-center gap-4 relative rounded-sm overflow-hidden group">
        {/* PREVIEW */}
        <Avatar className="w-full h-full rounded-sm">
          <AvatarImage
            src={organization.logo_url || undefined}
            alt={organization.name}
          />

          <AvatarFallback className="object-cover h-full w-full flex items-center justify-center bg-muted text-muted-foreground rounded-sm">
            <Building2 className="size-20" />
          </AvatarFallback>
        </Avatar>

        {is_saving ? (
          <div
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-2",
              "text-white absolute top-0 right-0",
              "inset-0 bg-black/20",
              "backdrop-blur-xs"
            )}
          >
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : (
          <div
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-2",
              "absolute top-0 right-0",
              "inset-0 bg-black/20",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-200",
              "backdrop-blur-xs"
            )}
          >
            <Label className="btn btn-outline btn-size-default bg-transparent border-white text-white hover:bg-white hover:text-black text-sm">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handle_change}
                hidden
              />
              <Camera className="mr-2 h-4 w-4" />
              Change Image
            </Label>
          </div>
        )}
      </div>
    </section>
  );
}

export default function OrganizationInfosSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const [organizations, update_organization] = useOrganizationsStore(
    (state) => [state.organizations, state.update_organization]
  );
  const [form_data, set_form_data] = useState({
    name: "",
    description: "",
    logo_url: "",
  });
  const [is_saving, set_is_saving] = useState(false);

  const organization = organizations.find((org) => org.id === id);

  /*------- HOOKS -------*/
  useEffect(() => {
    if (organization) {
      set_form_data({
        name: organization.name,
        description: organization.description || "",
        logo_url: organization.logo_url || "",
      });
    }
  }, [organization]);

  /*------- METHODS -------*/
  const handle_input_change = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    set_form_data((prev) => ({ ...prev, [name]: value }));
  };

  const handle_submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!organization) return;

    set_is_saving(true);
    try {
      await update_organization(organization.id, form_data);
      toast({
        title: "Organization updated",
        description: "Changes saved successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization.",
      });
    } finally {
      set_is_saving(false);
    }
  };

  /*------- RENDERER -------*/
  if (!organization) return null;

  const is_dirty =
    form_data.name !== organization.name ||
    form_data.description !== (organization.description || "");

  return (
    <section
      className={cn(
        "w-full grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8",
        className
      )}
    >
      {/* TITLE */}
      <div className="md:col-span-2 flex items-center gap-x-2 border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">
          Organization informations
        </h2>
      </div>

      {/* FORM */}
      <form
        onSubmit={handle_submit}
        className="flex-1 max-w-2xl flex flex-col gap-y-4"
      >
        {/* Organization name */}
        <Label className="flex flex-col gap-y-1">
          <span className="text-sm font-medium">Organization name</span>
          <Input
            id="name"
            name="name"
            value={form_data.name}
            onChange={handle_input_change}
            required
            className="w-full bg-muted border focus:bg-background-primary placeholder:text-muted-foreground"
          />
        </Label>

        {/* Description */}
        <Label className="flex flex-col gap-y-1">
          <span className="text-sm font-medium">Description</span>
          <Textarea
            id="description"
            name="description"
            value={form_data.description}
            onChange={handle_input_change}
            className="w-full bg-muted border focus:bg-background-primary min-h-[80px] placeholder:text-muted-foreground"
          />
        </Label>

        {/* ACTION BUTTONS */}
        {is_dirty && (
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                set_form_data({
                  name: organization.name,
                  description: organization.description || "",
                  logo_url: organization.logo_url || "",
                })
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={is_saving || !form_data.name}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {is_saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>

      {/* ORGANIZATION LOGO */}
      <OrganizationLogoSection
        organization={organization}
        className="row-start-2 md:row-start-auto"
      />
    </section>
  );
}
