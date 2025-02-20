// INTERFACES
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { useState } from "react";
import { Loader2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { add_member_to_organization_async } from "@/services/organization.services";

// COMPONENTS
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

/*======= INTERFACES =======*/
interface InviteMembersModalProps {
  entity: Entity | null;
  is_open: boolean;
  on_close: () => void;
}

/*======= COMPONENT =======*/
export default function AddMembersDialog({
  entity,
  is_open,
  on_close,
}: InviteMembersModalProps) {
  /*------- ATTRIBUTES -------*/
  const [email, set_email] = useState("");
  const [is_adding, set_adding] = useState(false);
  const [error_adding, set_error_adding] = useState<string | null>(null);

  /*------- METHODS -------*/
  const initialisation = () => {
    set_email("");
    set_error_adding(null);
  };

  const validate_email = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handle_submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!entity || !email.trim()) return;

    if (!validate_email(email)) {
      set_error_adding("Please enter a valid email address");
      return;
    }

    set_adding(true);

    try {
      await add_member_to_organization_async(entity.id, email.trim());
      initialisation();
      on_close();
    } catch (error: any) {
      let ui_error = "Failed to add user to organization";

      if (!!error.message && error.message.includes("404")) {
        ui_error = "No user found with this email";
      } else if (!!error.message && error.message.includes("402")) {
        ui_error = "Only Plus or Pro users can be added to an organization.";
      } else if (
        !!error?.data?.detail &&
        error.data.detail === "Plus seat limit reached"
      ) {
        ui_error = "Plus seat limit reached";
      }

      toast({
        title: "Error",
        description: ui_error,
        variant: "destructive",
      });
    } finally {
      set_adding(false);
    }
  };

  /*------- RENDERER -------*/
  if (!entity) return null;

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className="p-0 flex flex-col gap-y-0 overflow-y-hidden">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="w-full pr-4 text-ellipsis overflow-hidden">
            {entity.name} - Invite Members
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="p-4 text-muted-foreground">
          Type or paste in emails below, separated by commas. Your workspace
          will be billed by members.
        </DialogDescription>

        <form onSubmit={handle_submit} className="flex flex-col gap-y-2">
          <div className="p-4 flex flex-col">
            <Label className="flex flex-col gap-y-2">
              <span className="font-medium">Add New Members</span>

              <div className="flex gap-x-2">
                <Input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    set_email(e.target.value);
                    set_error_adding(null);
                  }}
                  placeholder="Enter email address"
                  className="flex-1"
                  disabled={is_adding}
                />
              </div>
            </Label>

            {error_adding && (
              <p className="text-xs text-destructive">{error_adding}</p>
            )}
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-4 py-2 border-t">
            <Button variant="outline" onClick={on_close}>
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={!email.trim() || is_adding}
            >
              {is_adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
