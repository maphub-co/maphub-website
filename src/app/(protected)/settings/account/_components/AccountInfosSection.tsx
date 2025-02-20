"use client";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export default function AccountInfosSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { user } = useUserStore();

  /*------- RENDERER -------*/
  return (
    <section
      id="account-infos-section"
      className={cn("w-full flex flex-col gap-y-8", className)}
    >
      {/* TITLE */}
      <div className="flex items-center gap-x-2 border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">
          Account informations
        </h2>
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-y-4 max-w-xl">
        <Label className="text-sm font-medium">Email</Label>
        <Input
          type="email"
          value={user?.email || ""}
          disabled={true}
          className="bg-muted border focus:bg-background-primary placeholder:text-muted-foreground"
        />

        <Button variant="outline" className="w-fit" disabled={true}>
          Edit Email
        </Button>
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-y-4 max-w-xl">
        <Label className="text-sm font-medium">Password</Label>
        <Input
          type="password"
          value="********"
          className="bg-muted border focus:bg-background-primary placeholder:text-muted-foreground"
          disabled={true}
        />

        <Button variant="outline" className="w-fit" disabled={true}>
          Change Password
        </Button>
      </div>
    </section>
  );
}
