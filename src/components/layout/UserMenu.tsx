"use client";

// LIBRARIES
import { useRouter } from "next/navigation";
import {
  Building2,
  LogOut,
  Upload,
  Folder,
  Key,
  User,
  Settings,
  X,
} from "lucide-react";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/Sheet";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function UserMenu() {
  /*------- ATTRIBUTS -------*/
  const router = useRouter();
  const { logout } = useAuthStore();
  const { user, clear_user } = useUserStore();

  /*------- METHODS -------*/
  const handle_sign_out = async () => {
    try {
      await logout();
      clear_user();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /*------- RENDERER -------*/
  if (!user) return <></>;

  return (
    <Sheet>
      {/* ACCOUNT BUTTON */}
      <SheetTrigger asChild>
        <Button variant="ghost" className="group text-sm gap-3">
          {/* USER NAME */}
          <span className="hidden md:flex items-center gap-1">
            {user.display_name || user.email || ""}
          </span>

          {/* USER PICTURE */}
          <Avatar className="size-6">
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback className="bg-muted text-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      {/* MENU */}
      <SheetContent className="p-4 flex flex-col gap-y-4 rounded-l-lg">
        {/* HEADER */}
        <SheetHeader className="px-2 flex flex-row items-center justify-between">
          <SheetTitle className="text-sm flex items-center gap-2 mb-0">
            {/* USER PICTURE */}
            <div className="relative">
              <Avatar className="size-6">
                <AvatarImage src={user.avatar_url} alt={user.display_name} />
                <AvatarFallback className="bg-muted text-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* USER NAME */}
            <span className="flex items-center gap-1">
              {user.display_name || user.email || ""}
            </span>
          </SheetTitle>

          {/* CLOSE BUTTON */}
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              <X className="size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* BUTTONS */}
        <div className="flex flex-col py-2 border-t">
          {/* EDIT PROFILE */}
          <SheetClose asChild>
            <Link
              href={`/profile/${user.uid}`}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <User className="size-4" />
              My profile
            </Link>
          </SheetClose>

          {/* PROJECTS */}
          <SheetClose asChild>
            <Link
              href={"/dashboard/workspaces"}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <Folder className="size-4" />
              My datasets
            </Link>
          </SheetClose>

          {/* UPLOADS */}
          <SheetClose asChild>
            <Link
              href={"/dashboard/uploads"}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <Upload className="size-4" />
              Recent uploads
            </Link>
          </SheetClose>

          {/* ORGANIZATIONS */}
          <SheetClose asChild>
            <Link
              href={"/settings/organizations"}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <Building2 className="size-4" />
              My organizations
            </Link>
          </SheetClose>

          <hr className="w-full my-2" />

          {/* API KEYS */}
          <SheetClose asChild>
            <Link
              href={"/settings/api-keys"}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <Key className="size-4" />
              My API Keys
            </Link>
          </SheetClose>

          {/* SETTINGS */}
          <SheetClose asChild>
            <Link
              href={"/settings"}
              className="btn btn-ghost btn-size-default w-full justify-start gap-2"
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </SheetClose>

          <hr className="w-full my-2" />

          {/* SIGN OUT */}
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive"
              onClick={handle_sign_out}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
