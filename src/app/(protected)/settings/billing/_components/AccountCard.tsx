"use client";

// LIBRARIES
import { useState } from "react";
import Link from "next/link";
import { Crown, GraduationCap } from "lucide-react";

// SERVICES
import {
  get_billing_url,
  get_stripe_plus_url,
  get_stripe_pro_url,
} from "@/services/stripe.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import AcademiaRequestModal from "./AcademiaRequestModal";

export default function AccountCard({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const { loading: is_loading, user: current_user } = useUserStore();
  const [show_academia_modal, set_show_academia_modal] = useState(false);

  /*------- RENDERER -------*/
  return (
    <>
      <Card className={cn("flex flex-col", className)}>
        {/* HEADER */}
        <CardHeader className="p-4 border-b flex flex-row items-center gap-x-2">
          <CardTitle className="mb-0">Account</CardTitle>

          {/* TIER BADGE */}
          {current_user?.tier.toLowerCase() === "plus" ? (
            <Badge
              variant="outline"
              className="px-1.5 bg-accent text-accent-foreground border-accent-foreground rounded-xs"
            >
              Plus
            </Badge>
          ) : current_user?.tier.toLowerCase() === "pro" ? (
            <Badge
              variant="outline"
              className="px-1.5 bg-purple-50 border-purple-200 text-purple-700 rounded-xs"
            >
              Pro
            </Badge>
          ) : null}
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="h-full p-4 flex flex-col justify-between gap-y-4">
          {is_loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                You are currently on the {current_user?.tier} plan.
              </p>

              {current_user?.tier.toLowerCase() === "free" ? (
                <div className="space-y-2">
                  {/* <Button
                    variant="outline"
                    size="default"
                    onClick={() => set_show_academia_modal(true)}
                    className="w-full flex items-center justify-center gap-x-2 text-primary border-primary border-2"
                  >
                    <GraduationCap className="size-5" />
                    Student ? Request Plus plan for academia !
                  </Button> */}

                  <Link
                    href={get_stripe_plus_url(current_user)}
                    className="btn btn-primary btn-size-default w-full text-center flex items-center justify-center gap-x-2"
                  >
                    <Crown className="size-4" />
                    Upgrade to Plus !
                  </Link>
                </div>
              ) : current_user?.tier.toLowerCase() === "plus" ? (
                <Link
                  href={get_stripe_pro_url(current_user)}
                  target="_blank"
                  className="btn btn-primary btn-size-default w-full text-center flex items-center justify-center gap-x-2"
                >
                  <Crown className="size-4" />
                  Upgrade to Pro !
                </Link>
              ) : current_user?.tier.toLowerCase() === "pro" ? (
                <Link
                  href={get_billing_url(current_user)}
                  target="_blank"
                  className="btn btn-outline btn-size-default w-full text-center"
                >
                  Manage your plan
                </Link>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {/* Academia Request Modal */}
      <AcademiaRequestModal
        is_open={show_academia_modal}
        on_close={() => set_show_academia_modal(false)}
      />
    </>
  );
}
