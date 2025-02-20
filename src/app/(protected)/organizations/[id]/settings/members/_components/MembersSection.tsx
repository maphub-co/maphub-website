"use client";

// INTERFACES
import { User } from "@/interfaces/user";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  MoreVertical,
  Trash2,
  UserPlus,
  UserRound,
} from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import {
  get_organization_members_async,
  delete_organization_member_async,
} from "@/services/organization.services";

// UTILS
import { organization_to_entity } from "@/utils/entity.utils";

// STORES
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import AddMembersDialog from "./AddMembersDialog";
import MembersLimitDialog from "@/components/organizations/MembersLimitDialog";

export default function MembersSection() {
  /*------- ATTRIBUTES -------*/
  const { id: organization_id } = useParams();
  const [organizations] = useOrganizationsStore((state) => [
    state.organizations,
  ]);
  const { user: current_user } = useUserStore();
  const [members, set_members] = useState<User[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [is_dialog_open, set_dialog_open] = useState(false);
  const [is_limit_open, set_limit_open] = useState(false);
  const [removing, set_removing] = useState<string | null>(null);

  const organization = organizations.find((org) => org.id === organization_id);

  /*------- METHODS -------*/
  const fetch_members = async () => {
    if (!organization_id) return;

    set_is_loading(true);
    try {
      const members = await get_organization_members_async(
        organization_id as string
      );
      set_members(members);
    } catch (error) {
      set_error("Failed to fetch members");
    } finally {
      set_is_loading(false);
    }
  };

  const handle_add_members = async () => {
    if (!organization) return;

    if (current_members >= organization.max_seats) {
      set_limit_open(true);
    } else {
      set_dialog_open(true);
    }
  };

  const handle_remove = async (member_id: string) => {
    if (!organization_id) return;

    if (!window.confirm("Are you sure you want to remove this member?")) return;

    if (member_id === organization?.owner_uid) {
      toast({
        title: "Impossible to delete user",
        description: "You cannot remove the owner of the organization",
        variant: "destructive",
      });
      return;
    }

    set_removing(member_id);
    try {
      await delete_organization_member_async(
        organization_id as string,
        member_id
      );

      // Refresh members
      fetch_members();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again later.",
        variant: "destructive",
      });
    } finally {
      set_removing(null);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!organization_id || !current_user) return;

    fetch_members();
  }, [organization_id, current_user]);

  /*------- RENDERER -------*/
  if (!organization) return null;

  const paid_seats = organization.max_seats;
  const current_members = members.length;

  return (
    <section className="w-full flex flex-col gap-y-8">
      {/* TITLE */}
      <div className="flex items-center justify-between gap-x-2 border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">Members</h2>
        <Button
          variant="primary"
          className="w-fit"
          onClick={handle_add_members}
        >
          <UserPlus className="size-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Paid seats</span>
          <span className="text-base md:text-xl font-medium">{paid_seats}</span>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Current Members</span>
          <span className="text-base md:text-xl font-medium">
            {current_members}
          </span>
        </div>
      </div>

      {/* MEMBERS TABLE */}
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead>
          <tr className="w-full border-y">
            <th className="w-64 p-4 text-left text-muted-foreground font-medium border-r">
              User
            </th>
            <th className="w-full"></th>
            <th className="w-10"></th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {is_loading ? (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                <div className="flex items-center gap-x-2">
                  <Loader2 className="size-4 animate-spin" />
                  Loading...
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-destructive">
                {error}
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-muted-foreground">
                No members yet
              </td>
            </tr>
          ) : (
            members.map((user) => (
              <tr key={user?.uid} className="border-b">
                {/* USER */}
                <td className="w-64 p-4 flex items-center gap-x-4">
                  {/* AVATAR */}
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user?.avatar_url}
                      alt={user?.display_name || user?.email}
                    />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  {/* USER INFO */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* display name */}
                    <span className="flex-1 font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                      {user?.display_name || user?.email}
                    </span>

                    {/* email */}
                    <span className="flex-1 text-xs text-muted-foreground text-ellipsis overflow-hidden">
                      {user?.email}
                    </span>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4 border-l">
                  {user?.uid === organization?.owner_uid ? (
                    <Badge variant="outline">Owner</Badge>
                  ) : (
                    <span>Member</span>
                  )}
                </td>

                {/* MENU */}
                <td className="p-4 text-right">
                  {current_user?.uid === organization?.owner_uid &&
                    user?.uid !== organization?.owner_uid && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handle_remove(user.uid)}
                            disabled={
                              current_user?.uid !== organization?.owner_uid ||
                              removing === user.uid
                            }
                          >
                            {removing === user.uid ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="size-4 mr-2" />
                                Remove
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD MEMBER DIALOG */}
      <AddMembersDialog
        entity={organization_to_entity(organization)}
        is_open={is_dialog_open}
        on_close={async () => {
          set_dialog_open(false);
          await fetch_members();
        }}
      />

      {/* LIMIT REACHED DIALOG */}
      <MembersLimitDialog
        is_open={is_limit_open}
        on_close={() => set_limit_open(false)}
      />
    </section>
  );
}
