"use client";

// LIBRARIES
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  Compass,
  ExternalLink,
  MapIcon,
  Menu,
  Server,
  X,
} from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

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
import { Card, CardContent } from "@/components/ui/Card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/Collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigation_menu_trigger_style,
} from "@/components/ui/NavigationMenu";

// CONSTANTS
import { TOOLS } from "./constants";

// ASSETS
import MapHubLogo from "@/assets/logo.svg";

/*======= COMPONENT =======*/
export default function PublicHeader() {
  /*------- ATTRIBUTS -------*/
  const pathname = usePathname();
  const { is_authenticated } = useAuthStore();
  const [is_mobile_platform_open, set_mobile_platform_open] = useState(false);
  const [is_mobile_tools_open, set_mobile_tools_open] = useState(false);

  const is_hidden =
    (pathname.startsWith("/map/") && pathname.endsWith("/edit")) ||
    (pathname.startsWith("/map/") && pathname.includes("?viewer=true"));

  /*------- RENDERER -------*/
  if (is_hidden) return <></>;

  return (
    <>
      {/* DESKTOP LAYOUT */}
      <header className="hidden md:block h-header sticky top-0 z-50">
        {/* Content */}
        <NavigationMenu className="max-w-full h-full flex px-6 items-center justify-between border-b bg-background">
          <NavigationMenuList className="h-full flex items-center">
            {/* LOGO */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="flex items-center space-x-2 mr-6">
                  <Image src={MapHubLogo} alt="MapHub" width={32} height={32} />
                  <div className="flex items-center">
                    <span className="text-base font-bold">MapHub.co</span>
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* PLATFORM */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen min-h-[240px] p-6 grid grid-cols-4 gap-4">
                  <NavigationMenuLink asChild>
                    <Card className="p-4 flex flex-col relative">
                      <Link
                        href="/dashboard/workspaces"
                        className="absolute inset-0"
                      />

                      <Server className="size-8" />

                      <span className="text-base font-medium mt-4">
                        Geospatial Cloud
                      </span>

                      <p className="text-muted-foreground mt-2">
                        Store your geospatial data in the cloud and share it
                        with your team.
                      </p>
                    </Card>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Card className="p-4 flex flex-col relative">
                      <Link href="/hub" className="absolute inset-0" />
                      <Compass className="size-8" />

                      <span className="text-base font-medium mt-4">
                        Explore Maps
                      </span>

                      <p className="text-muted-foreground mt-2">
                        Explore the maps and datasets shared by the community.
                      </p>
                    </Card>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* DOCUMENTATION */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/docs" className="btn btn-ghost btn-size-default">
                  Documentation
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* PRICING */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#pricing"
                  className="btn btn-ghost btn-size-default"
                >
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* TOOLS */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen min-h-[240px] p-6 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {TOOLS.map((tool) => (
                    <NavigationMenuLink key={tool.id} asChild>
                      <Card className="p-4 flex flex-col relative">
                        <Link
                          href={`${tool.href}?utm_source=maphub.co`}
                          target="_blank"
                          className="absolute inset-0"
                        />
                        <Image
                          className="size-16 object-cover"
                          src={tool.image}
                          alt={tool.name}
                          width={32}
                          height={32}
                        />

                        <span className="text-base font-medium mt-4">
                          {tool.name}
                        </span>

                        <p className="text-muted-foreground mt-2">
                          {tool.description}
                        </p>
                      </Card>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>

          {/* RIGHT - AUTH CONTROLS, THEME TOGGLE */}
          <div className="hidden md:flex items-center space-x-4">
            {is_authenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  className="btn btn-ghost btn-size-default"
                  href="/login"
                  onClick={() => {
                    track("login_button_clicked", {
                      section: "header",
                    });
                  }}
                >
                  Log in
                </Link>

                <Link
                  className="btn btn-primary btn-size-default"
                  href="/signup"
                  onClick={() => {
                    track("signup_button_clicked", {
                      section: "header",
                    });
                  }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </NavigationMenu>
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
                <Collapsible
                  open={is_mobile_platform_open}
                  onOpenChange={set_mobile_platform_open}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        set_mobile_platform_open(!is_mobile_platform_open)
                      }
                    >
                      Platform
                      <ChevronDown
                        className={cn(
                          "size-3 ml-auto transition-transform",
                          is_mobile_platform_open && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="flex flex-col pl-4">
                    <SheetClose asChild>
                      <Link
                        href={"/dashboard/workspaces"}
                        className="btn btn-ghost btn-size-default justify-start"
                      >
                        Geospatial Cloud
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href={"/hub"}
                        className="btn btn-ghost btn-size-default justify-start"
                      >
                        Explore Maps
                      </Link>
                    </SheetClose>
                  </CollapsibleContent>
                </Collapsible>

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
                    className="btn btn-ghost btn-size-default justify-start"
                    href="/#pricing"
                  >
                    Pricing
                  </Link>
                </SheetClose>

                <Collapsible
                  open={is_mobile_tools_open}
                  onOpenChange={set_mobile_tools_open}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        set_mobile_tools_open(!is_mobile_tools_open)
                      }
                    >
                      Tools
                      <ChevronDown
                        className={cn(
                          "size-3 ml-auto transition-transform",
                          is_mobile_tools_open && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="flex flex-col pl-4">
                    {TOOLS.map((tool) => (
                      <SheetClose key={tool.id} asChild>
                        <Link
                          href={`${tool.href}?utm_source=maphub.co`}
                          target="_blank"
                          className="btn btn-ghost btn-size-default justify-start"
                        >
                          <span className="flex-1 text-left">{tool.name}</span>
                          <ExternalLink className="size-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

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
