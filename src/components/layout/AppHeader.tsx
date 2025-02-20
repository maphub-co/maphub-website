"use client";

// LIBRARIES
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapIcon, Menu, X } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import UserMenu from "./UserMenu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigation_menu_trigger_style,
} from "@/components/ui/NavigationMenu";

// ASSETS
import MapHubLogo from "@/assets/logo.svg";

/*======= COMPONENT =======*/
export default function PublicHeader() {
  /*------- ATTRIBUTS -------*/
  const pathname = usePathname();
  const { is_authenticated } = useAuthStore();
  const { last_registered_id } = useOrganizationsStore();

  const is_hidden =
    (pathname.startsWith("/map/") && pathname.endsWith("/edit")) ||
    (pathname.startsWith("/map/") && pathname.includes("?viewer=true")) ||
    pathname.startsWith("/onboarding");

  /*------- RENDERER -------*/
  if (is_hidden) return <></>;

  return (
    <>
      {/* DESKTOP LAYOUT */}
      <header className="hidden md:flex h-header px-4 items-center justify-between sticky top-0 z-50 border-b bg-background">
        {/* LEFT - LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={MapHubLogo} alt="MapHub" width={32} height={32} />
          </Link>

          {/* Navigation Links */}
          <NavigationMenu className="ml-4">
            <NavigationMenuList>
              {is_authenticated && (
                <NavigationMenuItem>
                  <Link
                    href={
                      last_registered_id
                        ? `/organizations/${last_registered_id}/workspaces`
                        : "/dashboard/workspaces"
                    }
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigation_menu_trigger_style()}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigation_menu_trigger_style()}
                  >
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/hub" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigation_menu_trigger_style()}
                  >
                    Explore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT - AUTH CONTROLS, THEME TOGGLE */}
        <div className="hidden md:flex items-center space-x-4">
          {is_authenticated && <UserMenu />}
        </div>
      </header>

      {/* MOBILE LAYOUT */}
      <header className="md:hidden h-16 px-4 grid grid-cols-3 items-center border-b bg-background-primary sticky top-0 z-50">
        {/* LEFT - MOBILE MENU BUTTON */}
        <Sheet>
          <SheetTrigger className="justify-self-start" asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-4 flex flex-col gap-y-4">
            <SheetHeader className="px-2 flex flex-row items-center justify-between">
              <SheetClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </SheetHeader>

            <div className="flex flex-col justify-between h-full">
              {/* TOP */}
              <div className="flex flex-col py-2 border-t">
                {is_authenticated && (
                  <SheetClose asChild>
                    <Link
                      href={
                        last_registered_id
                          ? `/organizations/${last_registered_id}/workspaces`
                          : "/dashboard/workspaces"
                      }
                      className="btn btn-ghost btn-size-default w-full justify-start md:w-fit md:justify-center"
                    >
                      Dashboard
                    </Link>
                  </SheetClose>
                )}

                <SheetClose asChild>
                  <Link
                    href="/docs"
                    className="btn btn-ghost btn-size-default justify-start"
                  >
                    Documentation
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/hub"
                    className="btn btn-ghost btn-size-default justify-start"
                  >
                    Explore
                  </Link>
                </SheetClose>

                <hr className="w-full my-2" />
              </div>

              {/* BOTTOM */}
            </div>
          </SheetContent>
        </Sheet>

        {/* CENTER - LOGO */}
        <div className="flex items-center justify-center">
          <Link href={"/"} className="flex items-center space-x-2">
            <MapIcon className="size-6" />
          </Link>
        </div>

        {/* RIGHT - AUTH CONTROLS */}
        <div className="flex items-center justify-end">
          {is_authenticated ? (
            <UserMenu />
          ) : (
            <Link
              className="btn btn-primary btn-size-default w-fit"
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
