"use client";

// LIBRARIES
import Link from "next/link";
import { ArrowRight, Check, CircleCheckBig } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// COMPONENTS
import { Card, CardFooter, CardHeader } from "@/components/ui/Card";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="container max-w-7xl mx-auto p-4 my-8 md:my-20 flex flex-col gap-y-16 scroll-mt-20"
    >
      {/* TITLE */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Plans & Pricing
        </h2>

        <p className="text-base text-center max-w-2xl mx-auto mt-4">
          Get cloud storage and unlimited access to Maphub tools for you and
          your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {/* FREE */}
        <Card className="w-full max-w-xs mx-auto transform hover:scale-102 hover:shadow-lg transition-all flex flex-col">
          <CardHeader className="px-4 py-6 border-b flex flex-col items-center gap-y-4">
            <h3 className="text-2xl font-medium">Explorer</h3>

            <div className="flex items-center justify-center gap-x-1">
              <span className="text-2xl font-bold">$0</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          {/* CTA */}
          <div className="p-6">
            <Link
              href="/onboarding"
              className="btn btn-outline btn-size-lg border-primary text-primary hover:text-primary-hover hover:bg-primary/10 text-base w-full rounded-sm"
            >
              Get started
            </Link>
          </div>

          {/* Benefits */}
          <div className="p-6 flex-grow">
            <h4 className="font-semibold mb-3">Includes</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">3Gb of cloud storage</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">QGIS plugin integration</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Limited access to tools</span>
              </li>
            </ul>

            <div className="mb-14"></div>
          </div>
        </Card>

        {/* PLUS */}
        <Card className="w-full max-w-xs mx-auto transform hover:scale-102 hover:shadow-lg transition-all flex flex-col">
          {/* Header */}
          <CardHeader className="px-4 py-6 border-b flex flex-col items-center gap-y-4">
            <h3 className="text-2xl font-medium">Plus</h3>

            <div className="flex items-center justify-center gap-x-1">
              <span className="text-2xl font-bold">$15</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <div className="p-6">
            <Link
              href="/onboarding"
              className="btn btn-primary btn-size-lg text-base w-full gap-x-2 rounded-sm"
              onClick={() =>
                track("call_to_action_clicked", {
                  section: "pricing",
                  name: "select_navigator_plan",
                })
              }
            >
              Select plan
            </Link>
          </div>

          {/* Benefits */}
          <div className="p-6 flex-grow">
            <h4 className="font-semibold mb-3">
              Everything in Explorer, plus:
            </h4>

            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">15Gb of cloud storage</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Unlimited access to tools</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Teams (unlimited seats)</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Member access management</span>
              </li>
            </ul>

            <div className="p-3 mt-6 bg-accent text-accent-foreground rounded-sm">
              <h4 className="font-semibold mb-2">Tools included</h4>
              <ul className="space-y-1">
                <li className="text-sm">• Scan my GIS file</li>
                <li className="text-sm">• 1 click PostGIS</li>
                <li className="text-sm">• Geo cloud converter</li>
                <li className="text-sm">• GeoSpot</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* PRO */}
        <Card className="w-full max-w-xs mx-auto transform hover:scale-102 hover:shadow-lg transition-all flex flex-col">
          {/* Header */}
          <CardHeader className="px-4 py-6 border-b flex flex-col items-center gap-y-4">
            <h3 className="text-2xl font-medium">Professional</h3>

            <div className="flex items-center justify-center gap-x-1">
              <span className="text-2xl font-bold">$45</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          {/* CTA */}
          <div className="p-6">
            <Link
              href="/onboarding"
              className="btn btn-primary btn-size-lg text-base w-full gap-x-2 rounded-sm"
              onClick={() =>
                track("call_to_action_clicked", {
                  section: "pricing",
                  name: "select_navigator_plan",
                })
              }
            >
              Select plan
            </Link>
          </div>

          {/* Benefits */}
          <div className="p-6 flex-grow">
            <h4 className="font-semibold mb-3">Everything in Plus, plus:</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">50Gb of cloud storage</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Role-based access control</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Centralized billing</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Priority customer support</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* ENTERPRISE */}
        <Card className="w-full max-w-xs mx-auto transform hover:scale-102 hover:shadow-lg transition-all flex flex-col">
          {/* Header */}
          <CardHeader className="px-4 py-6 border-b flex flex-col items-center gap-y-4">
            <h3 className="text-2xl font-medium">Business</h3>

            <div className="flex items-center justify-center gap-x-1">
              <span className="text-2xl font-bold">Custom</span>
            </div>
          </CardHeader>

          {/* CTA */}
          <div className="p-6">
            <Link
              href="mailto:alexandre.larroumets@meteory.eu?subject=Enterprise Plan Inquiry&body=Hi,%0D%0A%0D%0AI'm interested in learning more about your Enterprise plan.%0D%0A%0D%0ABest regards,"
              className="btn btn-outline btn-size-lg border-primary text-primary hover:text-primary-hover hover:bg-primary/10 text-base w-full rounded-sm"
              onClick={() =>
                track("call_to_action_clicked", {
                  section: "pricing",
                  name: "contact_sales",
                })
              }
            >
              Contact Sales
            </Link>
          </div>

          {/* Benefits */}
          <div className="p-6 flex-grow">
            <h4 className="font-semibold mb-3">Everything in Pro, plus:</h4>

            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Custom cloud storage</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Custom pricing</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Flexible payment options</span>
              </li>

              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Dedicated customer support</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
