"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { user_service } from "@/services/user.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";

enum DeletionStatus {
  WARNING,
  DELETING,
  COMPLETED,
}

function DeleteAccountDialog() {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clear_user } = useUserStore();

  const [current_step, set_current_step] = useState<DeletionStatus>(
    DeletionStatus.WARNING
  );
  const [is_loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const [is_open, set_open] = useState(false);

  /*------- METHODS -------*/
  const handle_delete_account = async () => {
    set_current_step(DeletionStatus.DELETING);
    set_loading(true);
    set_error(null);

    try {
      await user_service.delete_user();

      set_current_step(DeletionStatus.COMPLETED);
      clear_user();
      await logout();

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });

      router.push("/");
    } catch (error: any) {
      set_error(
        error.response?.data?.detail ||
          "Failed to delete account. Please try again."
      );
      set_current_step(DeletionStatus.WARNING);

      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Failed to delete your account. Please contact support.",
      });
    } finally {
      set_loading(false);
    }
  };

  const handle_open_change = (open: boolean) => {
    set_open(open);
    if (!open) {
      // Reset state when dialog closes
      set_current_step(DeletionStatus.WARNING);
      set_error(null);
      set_loading(false);
    }
  };

  /*------- RENDERER -------*/
  if (current_step === DeletionStatus.DELETING) {
    return (
      <AlertDialog open={is_open} onOpenChange={handle_open_change}>
        <AlertDialogContent className="max-w-2xl">
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
            <h3 className="text-xl font-semibold">Deleting Your Account</h3>
            <p className="text-muted-foreground text-center">
              Please wait while we permanently delete your account and all
              associated data.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (current_step === DeletionStatus.COMPLETED) {
    return (
      <AlertDialog open={is_open} onOpenChange={handle_open_change}>
        <AlertDialogContent className="max-w-2xl">
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">
              Account Deleted Successfully
            </h3>
            <p className="text-muted-foreground text-center">
              Your MapHub account and all associated data have been permanently
              deleted.
            </p>

            <AlertDialogAction asChild>
              <Button onClick={() => router.push("/")} className="mt-4">
                Go to Homepage
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={is_open} onOpenChange={handle_open_change}>
      {/* TRIGGER */}
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit mt-2">
          <Trash2 className="size-4 mr-2" />
          Delete your account
        </Button>
      </AlertDialogTrigger>

      {/* MODAL */}
      <AlertDialogContent className="max-w-2xl max-h-[80vh] gap-y-8 overflow-y-auto">
        {/* HEADER */}
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle className="text-destructive">
              Delete Account
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            This action will permanently delete your MapHub account and all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* DELETION LIST ITEM */}
        <div className="px-4 space-y-4">
          <h3 className="font-semibold">What will be deleted:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">👤</div>
              <div>
                <p className="font-medium">Your Profile</p>
                <p className="text-sm text-muted-foreground">
                  Account information, avatar, settings
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">🗂️</div>
              <div>
                <p className="font-medium">All Workspaces</p>
                <p className="text-sm text-muted-foreground">
                  Projects, folders, and maps you own
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">📁</div>
              <div>
                <p className="font-medium">All Files</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded data, exports, and attachments
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">🔑</div>
              <div>
                <p className="font-medium">API Keys</p>
                <p className="text-sm text-muted-foreground">
                  All generated API keys and tokens
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">💬</div>
              <div>
                <p className="font-medium">Requests & Upvotes</p>
                <p className="text-sm text-muted-foreground">
                  All your map requests and community activity
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 text-muted-foreground mt-0.5">🔐</div>
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Login credentials and session data
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WARNING ZONE */}
        <div className="space-y-6">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h3 className="font-semibold text-destructive mb-2">
              ⚠️ Warning: This action is irreversible
            </h3>
            <p className="text-sm text-destructive/80">
              Once you delete your account, there is no way to recover your
              data. Please make sure you have exported any important information
              before proceeding.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handle_delete_account}
            disabled={is_loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {is_loading ? "Deleting..." : "Delete Account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function DeleteAccountSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { user } = useUserStore();
  const { load_organizations, organizations } = useOrganizationsStore();
  const owned_organizations = organizations.filter(
    (org) => org.owner_uid === user?.uid
  );

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!user) return;

    load_organizations();
  }, [user]);

  /*------- RENDERER -------*/
  return (
    <section
      id="delete-account-section"
      className={cn("w-full flex flex-col gap-y-8", className)}
    >
      {/* TITLE */}
      <div className="flex items-center gap-x-2 border-b pb-2">
        <h2 className="text-destructive text-xl md:text-2xl font-medium">
          Delete account
        </h2>
      </div>

      {owned_organizations.length > 0 ? (
        <div className="flex flex-col gap-y-2 max-w-xl">
          <p className="flex flex-col gap-y-2 text-sm">
            <span>
              Your are currently owner of the following organizations :
            </span>
            <span className="flex gap-x-2">
              {owned_organizations.map((org) => (
                <Link
                  href={`/settings/organizations/${org.id}`}
                  key={org.id}
                  className="btn btn-link"
                >
                  {org.name}
                </Link>
              ))}
            </span>
          </p>
          <p className="text-sm">
            You must transfer ownership, or delete these organizations before
            deleting your account.
          </p>
        </div>
      ) : (
        <p className="text-sm">
          This action is irreversible. Please make sure you have exported any
          important information before proceeding.
        </p>
      )}

      <DeleteAccountDialog />
    </section>
  );
}
