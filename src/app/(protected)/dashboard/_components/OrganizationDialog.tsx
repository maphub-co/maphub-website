"use client";

// LIBRARIES
import Link from "next/link";
import { UserPlus, Building2, ArrowRight, Check } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

/*======= COMPONENT =======*/
export default function OrganizationDialog({
  className,
}: {
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className={cn("w-full justify-start gap-x-2", className)}
        >
          <UserPlus className="size-4 flex-shrink-0" />
          Invite members
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xs p-0 gap-y-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center text-xl">
            Create an Organization
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center gap-y-8">
          <DialogDescription className="text-center text-muted-foreground">
            To collaborate with team members and invite others to work with you,
            you first need to create an organization.
          </DialogDescription>

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Building2 className="size-10" />
          </div>

          <ul className="flex flex-col gap-y-2">
            <li className="flex items-center gap-x-2">
              <Check className="size-4 text-emerald-500 flex-shrink-0" />
              <span>Collaborate with your team</span>
            </li>

            <li className="flex items-center gap-x-2">
              <Check className="size-4 text-emerald-500 flex-shrink-0" />
              <span>QGIS integration</span>
            </li>

            <li className="flex items-center gap-x-2">
              <Check className="size-4 text-emerald-500 flex-shrink-0" />
              <span>Advance version control</span>
            </li>

            <li className="flex items-center gap-x-2">
              <Check className="size-4 text-emerald-500 flex-shrink-0" />
              <span>Visualise and share with clients</span>
            </li>

            <li className="flex items-center gap-x-2">
              <Check className="size-4 text-emerald-500 flex-shrink-0" />
              <span>50 GB of storage per seat</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="p-4 flex-col gap-y-2 sm:flex-row sm:justify-center">
          <Link
            href="/onboarding"
            className="btn btn-primary btn-size-lg text-base w-full"
          >
            Create Organization
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
