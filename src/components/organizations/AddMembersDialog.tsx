// INTERFACES
import { User } from "@/interfaces/user";
import { Organization } from "@/interfaces/organization";

// LIBRARIES
import { useState, useEffect } from "react";
import { Loader2, UserRound } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useUserStore } from "@/stores/user.store";

// SERVICES
import {
  get_organization_async,
  get_organization_members_async,
  add_member_to_organization_async,
  delete_organization_member_async,
} from "@/services/organization.services";

// COMPONENTS
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import MembersLimitDialog from "./MembersLimitDialog";

/*======= INTERFACES =======*/
interface InviteMembersModalProps {
  organization_id: string;
  is_open: boolean;
  on_close: () => void;
}

/*======= COMPONENT =======*/
export default function AddMembersDialog({
  organization_id,
  is_open,
  on_close,
}: InviteMembersModalProps) {
  /*------- STATE -------*/
  const { user: current_user } = useUserStore();
  const [organization, set_organization] = useState<Organization | null>(null);
  const [members, set_members] = useState<User[]>([]);
  const [email, set_email] = useState("");
  const [limit_open, set_limit_open] = useState(false);
  const [is_adding, set_adding] = useState(false);
  const [is_removing, set_removing] = useState<string | null>(null);
  const [error_adding, set_error_adding] = useState<string | null>(null);
  const [is_loading_members, set_is_loading_members] = useState(true);
  const [error_members, set_error_members] = useState<string | null>(null);

  /*------- METHODS -------*/
  const fetch_organization = async () => {
    try {
      const organization = await get_organization_async(organization_id);
      set_organization(organization);
    } catch (error: any) {
      console.error("Error fetching organization:", error);
      toast({
        title: "Error",
        description:
          "Failed to load organization details. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetch_members = async () => {
    set_error_members(null);

    try {
      const users = await get_organization_members_async(organization_id);

      set_members(users);
    } catch (error: any) {
      set_error_members("Error: Failed to fetch organization members");
      toast({
        title: "Error",
        description: "Failed to fetch organization members",
        variant: "destructive",
      });
    } finally {
      set_is_loading_members(false);
    }
  };

  const validate_email = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handle_add_member = async () => {
    if (!organization || !email.trim()) return;

    if (!validate_email(email)) {
      set_error_adding("Please enter a valid email address");
      return;
    }

    if (members.length >= organization.max_seats) {
      set_limit_open(true);
      return;
    }

    if (members.some((user) => user.email === email)) {
      set_error_adding("This user is already a member of the organization");
      return;
    }

    set_adding(true);
    try {
      await add_member_to_organization_async(organization_id, email.trim());
      await fetch_members();
      set_email("");
      set_error_adding(null);
    } catch (error: any) {
      let ui_error = "Failed to add user to organization";

      if (!!error.message && error.message.includes("404")) {
        ui_error = "No user found with this email";
      } else if (!!error.message && error.message.includes("402")) {
        ui_error = "Only Plus or Pro users can be added to an organization.";
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

  const handle_remove_member = async (user_id: string) => {
    if (!organization_id) return;

    set_removing(user_id);

    try {
      await delete_organization_member_async(organization_id, user_id);
      set_members(members.filter((user) => user.uid !== user_id));

      toast({
        title: "Success",
        description: "The member has been successfully removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove user from organization",
        variant: "destructive",
      });
    } finally {
      set_removing(null);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!is_open || !organization_id) return;

    fetch_organization();
    fetch_members();
  }, [is_open]);

  /*------- RENDERER -------*/
  if (!organization) return null;

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent
        className="p-0 flex flex-col gap-y-0 overflow-y-hidden"
        childDialog={
          <MembersLimitDialog
            is_open={limit_open}
            on_close={() => set_limit_open(false)}
          />
        }
      >
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="w-full pr-4 text-ellipsis overflow-hidden">
            {organization.name} - Manage Members
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-y-4">
          {/* ADD SECTION */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handle_add_member();
            }}
            className="flex flex-col gap-y-2"
          >
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
                <Button
                  variant="outline"
                  type="submit"
                  disabled={!email.trim() || is_adding}
                >
                  {is_adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </Label>

            {error_adding && (
              <p className="text-xs text-destructive">{error_adding}</p>
            )}
          </form>

          {/* MEMBERS LIST */}
          <div className="flex flex-col gap-y-2">
            <span className="text-sm font-medium">Current Members</span>

            <div className="max-h-[400px] border rounded-sm divide-y overflow-y-auto">
              {is_loading_members ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : error_members ? (
                <div className="p-4 text-center text-sm text-destructive bg-destructive/10 border border-destructive rounded-sm">
                  {error_members}
                </div>
              ) : members.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No members yet
                </div>
              ) : (
                members.map((user) => (
                  <div
                    key={user.uid}
                    className="h-14 p-2 flex items-center justify-between hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-x-2">
                      <Avatar className="flex items-center justify-center size-6 rounded-full overflow-hidden">
                        <AvatarImage
                          src={user.avatar_url}
                          alt={user.display_name}
                          className="object-cover h-full w-full"
                        />
                        <AvatarFallback className="object-cover h-full w-full flex items-center justify-center bg-muted text-foreground">
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {user.display_name || user.email}
                      </span>
                    </div>

                    {user.uid === organization.owner_uid ? (
                      <Badge variant="secondary">Owner</Badge>
                    ) : (
                      current_user?.uid === organization.owner_uid && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs font-medium"
                          onClick={() => handle_remove_member(user.uid)}
                          disabled={is_removing === user.uid}
                        >
                          {is_removing === user.uid ? (
                            <Loader2 className="size-4 mx-2 animate-spin" />
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button variant="outline" onClick={on_close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
