"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  User,
  Twitter,
  Linkedin,
  Github,
  Loader2,
  Camera,
  Mail,
  Save,
} from "lucide-react";
import { Icon } from "@iconify/react";
import Discord from "@iconify-icons/mdi/discord";

// CONFIG
import { toast } from "@/lib/toast";

// INTERFACES
import { UserUpdate } from "@/services/user.services";

// SERVICES
import { user_service } from "@/services/user.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

/*======= COMPONENTS =======*/
function ProfilePictureSection({ className }: { className?: string }) {
  /*------- ATTRIBUTS -------*/
  const { user, update_user } = useUserStore();
  const [is_saving, set_is_saving] = useState(false);

  /*------- METHODS -------*/
  const upload_profile_picture = async (profile_picture: File) => {
    if (!profile_picture) {
      return;
    }

    try {
      set_is_saving(true);
      const updated_user = await user_service.upload_avatar(profile_picture);

      if (updated_user) {
        await update_user(updated_user);
      }

      // Force refresh the current user data to update all components
      await user_service.get_current_user();
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
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

    upload_profile_picture(file);
  };

  /*------- RENDERER -------*/
  return (
    <div className={cn("full flex flex-col gap-y-4", className)}>
      <Label className="font-semibold leading-normal">Profile Picture</Label>

      <div className="size-48 flex items-center gap-4 relative rounded-full overflow-hidden group">
        {/* PREVIEW */}
        <Avatar className="w-full h-full">
          <AvatarImage src={user?.avatar_url} alt={user?.display_name} />
          <AvatarFallback className="object-cover h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
            <User className="size-20" />
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
    </div>
  );
}

export default function ProfileInfosSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { user, update_user } = useUserStore();
  const [is_saving, set_is_saving] = useState(false);
  const [form_data, set_form_data] = useState<UserUpdate>({
    display_name: "",
    bio: "",
    location: "",
    website: "",
    social_links: {},
  });

  /*------- METHODS -------*/
  const handle_input_change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_form_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handle_social_link_change = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    set_form_data((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  };

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_is_saving(true);

    try {
      const updated_user = await user_service.update_user(form_data);
      await update_user(updated_user); // Update the store with the new user data

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      set_is_saving(false);
    }
  };

  const initialize_form = () => {
    if (!user) return;

    set_form_data({
      display_name: user.display_name,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      social_links: user.social_links || {},
    });
  };

  const is_dirty = () => {
    if (!user) return false;
    // Compare primitive fields
    if (
      form_data.display_name !== user.display_name ||
      form_data.bio !== (user.bio || "") ||
      form_data.location !== (user.location || "") ||
      form_data.website !== (user.website || "")
    ) {
      return true;
    }
    // Compare social_links (shallow)
    const keys = new Set([
      ...Object.keys(form_data.social_links || {}),
      ...Object.keys(user.social_links || {}),
    ]);
    for (const key of Array.from(keys)) {
      if (
        (form_data.social_links?.[key] || "") !==
        (user.social_links?.[key] || "")
      ) {
        return true;
      }
    }
    return false;
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!user) return;

    initialize_form();
  }, [user]);

  /*------- RENDER -------*/
  return (
    <section
      className={cn(
        "w-full grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8",
        className
      )}
    >
      {/* TITLE */}
      <div className="md:col-span-2 flex items-center justify-between gap-x-2 border-b pb-2">
        <h1 className="text-xl md:text-2xl font-medium">Public Profile</h1>

        <Link
          href={`/profile/${user?.uid}`}
          className="btn btn-outline btn-size-default"
        >
          <Eye className="size-4 mr-2" />
          See as viewer
        </Link>
      </div>

      {/* CONTENT */}
      {/* TEXT INPUTS */}
      <form onSubmit={handle_submit} className="flex-1 max-w-2xl">
        <div className="space-y-4">
          {/* Name */}
          <Label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">Name</span>
            <Input
              id="display_name"
              name="display_name"
              value={form_data.display_name}
              onChange={handle_input_change}
              required
              className="w-full"
            />
          </Label>

          {/* Bio */}
          <Label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">Bio</span>
            <Textarea
              id="bio"
              name="bio"
              value={form_data.bio}
              onChange={handle_input_change}
              placeholder=""
              className="w-full"
            />
          </Label>

          {/* Location */}
          <Label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">Location</span>
            <div className="relative">
              <Input
                id="location"
                name="location"
                value={form_data.location}
                onChange={handle_input_change}
                className="w-full"
                placeholder=""
              />
            </div>
          </Label>

          {/* Website */}
          <Label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">Website</span>
            <div className="relative">
              <Input
                id="website"
                name="website"
                value={form_data.website}
                onChange={handle_input_change}
                className="w-full"
                placeholder=""
                type="url"
              />
            </div>
          </Label>

          {/* Social Accounts */}
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">Social Accounts</span>

            <div className="flex flex-col gap-y-2">
              {/* EMAIL */}
              <Label className="flex items-center gap-x-2 relative">
                <Mail className="size-6 p-0.5 text-muted-foreground" />
                <Input
                  name="email"
                  value={form_data.social_links?.email || ""}
                  onChange={handle_social_link_change}
                  className="w-full"
                  placeholder=""
                />
              </Label>

              {/* TWITTER */}
              <Label className="flex items-center gap-x-2 relative">
                <Twitter className="size-6 p-0.5 text-muted-foreground" />
                <Input
                  name="twitter"
                  value={form_data.social_links?.twitter || ""}
                  onChange={handle_social_link_change}
                  className="w-full"
                  placeholder=""
                />
              </Label>

              {/* LINKEDIN */}
              <Label className="flex items-center gap-x-2 relative">
                <Linkedin className="size-6 p-0.5 text-muted-foreground" />
                <Input
                  name="linkedin"
                  value={form_data.social_links?.linkedin || ""}
                  onChange={handle_social_link_change}
                  className="w-full"
                  placeholder=""
                />
              </Label>

              {/* GITHUB */}
              <Label className="flex items-center gap-x-2 relative">
                <Github className="size-6 p-0.5 text-muted-foreground" />
                <Input
                  name="github"
                  value={form_data.social_links?.github || ""}
                  onChange={handle_social_link_change}
                  className="w-full"
                  placeholder=""
                />
              </Label>

              {/* DISCORD */}
              <Label className="flex items-center gap-x-2 relative">
                <Icon
                  icon={Discord}
                  className="size-6 p-0.5 text-muted-foreground"
                />
                <Input
                  name="discord"
                  value={form_data.social_links?.discord || ""}
                  onChange={handle_social_link_change}
                  className="w-full"
                  placeholder=""
                />
              </Label>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {is_dirty() && (
            <div className="flex justify-end gap-2 pt-2">
              {/* Cancel */}
              <Button
                type="button"
                variant="ghost"
                onClick={initialize_form}
                className=""
              >
                Cancel
              </Button>

              {/* Submit */}
              <Button
                type="submit"
                disabled={is_saving || !form_data.display_name}
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
        </div>
      </form>

      {/* PROFILE PICTURE */}
      <ProfilePictureSection className="row-start-2 md:row-start-auto" />
    </section>
  );
}
