"use client";

import { Card } from "@/components/ui/Card";
import { Check, Crown, Mail } from "lucide-react";
import { cn } from "@/utils/tailwindcss.utils";
import {
  get_stripe_plus_url,
  get_stripe_pro_url,
} from "@/services/stripe.services";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";

export default function NextPlanDetails({ className }: { className?: string }) {
  const { loading, user } = useUserStore();

  // Don't show anything while loading
  if (loading) {
    return <></>;
  }

  // Plus users see Pro upgrade
  if (user?.tier.toLowerCase() === "plus") {
    return (
      <Card className={cn("w-full p-8 rounded-lg", className)}>
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-y-4 mb-8">
          <img src="/icon.svg" alt="Pro" className="w-12 h-12" />
          <h2 className="text-2xl font-bold text-center">
            Get MapHub.co Pro for $100/month
          </h2>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <h3 className="font-semibold mb-6">
            Everything in MapHub.co Plus plan, plus :
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>100 GB of map storage</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Up to 50GB per file</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Unlimited private maps</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Share viewer links to private maps</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Dedicated tiler performance</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Custom base maps & versioning</span>
            </li>
          </ul>
        </div>

        {/* CALL-TO-ACTION */}
        <Link
          href={get_stripe_pro_url(user)}
          target="_blank"
          className="btn btn-primary btn-size-lg text-lg w-full text-center flex items-center justify-center gap-x-2"
        >
          <Crown className="size-5" />
          Upgrade to Pro !
        </Link>
      </Card>
    );
  }

  // Pro users see Enterprise upgrade
  if (user?.tier.toLowerCase() === "pro") {
    return (
      <Card className={cn("w-full p-8 rounded-lg", className)}>
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-y-4 mb-8">
          <img src="/icon.svg" alt="Enterprise" className="w-12 h-12" />
          <h2 className="text-2xl font-bold text-center">
            Need more? Go Enterprise
          </h2>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <h3 className="font-semibold mb-6">
            Everything in MapHub.co Pro plan, plus :
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Custom storage solutions</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Custom branding & expert icon</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>SSO / SAML integration</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>On-premises hosting option</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>SLA + 24h support</span>
            </li>
            <li className="flex items-center gap-x-4">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Dedicated infrastructure</span>
            </li>
          </ul>
        </div>

        {/* CALL-TO-ACTION */}
        <Link
          href="mailto:maphub@meteory.eu?subject=Enterprise%20Plan%20Inquiry"
          className="btn btn-primary btn-size-lg text-lg w-full text-center flex items-center justify-center gap-x-2"
        >
          <Mail className="w-5 h-5" />
          Contact Sales
        </Link>
      </Card>
    );
  }

  // Free users (default) see Plus upgrade
  return (
    <Card className={cn("w-full p-8 rounded-lg", className)}>
      {/* Header with Icon */}
      <div className="flex flex-col items-center gap-y-4 mb-8">
        <img src="/icon.svg" alt="Plus" className="w-12 h-12" />
        <h2 className="text-2xl font-bold text-center">
          Get MapHub.co Plus for $20/month
        </h2>
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h3 className="font-semibold mb-6">
          Everything in MapHub.co Free plan, plus :
        </h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>10 GB of map storage</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Up to 10GB per file</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>10 private maps</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Team collaboration</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>API access</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Priority support</span>
          </li>
        </ul>
      </div>

      {/* CALL-TO-ACTION */}
      <Link
        href={get_stripe_plus_url(user)}
        className="btn btn-primary btn-size-lg text-lg w-full text-center flex items-center justify-center gap-x-2"
      >
        <Crown className="w-5 h-5" />
        Upgrade to Plus !
      </Link>
    </Card>
  );
}
