"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import {
  Loader2,
  Trash2,
  EyeOff,
  Eye,
  Copy,
  Key,
  MoreVertical,
} from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

/*======= COMPONENT =======*/
export default function ApiKeysSection({ className }: { className?: string }) {
  /*------- ATTRIBUTS -------*/
  const { loading: loading_auth } = useAuthStore();
  const {
    loading: loading_user,
    api_keys,
    fetch_api_keys,
    delete_api_key,
  } = useUserStore();
  const [visible_keys, set_visible_keys] = useState<{
    [keyId: string]: boolean;
  }>({});
  const [is_dialog_open, set_dialog_open] = useState(false);
  const [deleting_id, set_deleting_id] = useState<string | null>(null);

  /*------- METHODS -------*/
  const handle_toggle_key_visibility = (keyId: string) => {
    set_visible_keys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const handle_copy_key_to_clipboard = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        toast({
          title: "Copied!",
          description: "API Key copied to clipboard successfully.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to Copy",
          description: "Could not copy API key to clipboard.",
        });
      });
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (loading_auth) return;

    fetch_api_keys();
  }, [loading_auth]);

  /*------- RENDER -------*/
  return (
    <section className={cn("w-full flex flex-col", className)}>
      {/* TITLE */}
      <div className="flex justify-between items-center gap-x-2 border-b pb-2">
        <h1 className="text-xl md:text-2xl font-medium">API Keys</h1>

        <Button
          className="w-fit self-end"
          onClick={() => set_dialog_open(true)}
          disabled={loading_user}
        >
          Create new API key
        </Button>
      </div>

      <CreateApiKeyDialog
        is_open={is_dialog_open}
        on_close={() => set_dialog_open(false)}
      />

      {/* EXISTING KEYS */}
      <div className="flex flex-col">
        {api_keys.length === 0 ? (
          <div className="w-full h-40 p-4 flex flex-col items-center justify-center gap-y-4">
            <Key className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click "Create new API key" to get started.
            </p>
          </div>
        ) : (
          api_keys.map((key) => (
            <div
              key={key.id}
              className="p-4 flex justify-between items-center gap-x-4 border-b"
            >
              <span className="w-8 md:w-24 font-semibold text-ellipsis">
                {key.name}
              </span>

              {/* KEY */}
              <div className="flex-1 relative">
                <Input
                  value={
                    visible_keys[key.id] ? key.key : "************************"
                  }
                  className="w-full pr-16 text-truncate"
                  readOnly
                  disabled
                />

                <div className="h-full absolute top-0 right-0 top-0">
                  {/* TOGGLE VISIBILITY */}
                  <button
                    className="h-full p-2 cursor-pointer"
                    onClick={() => handle_toggle_key_visibility(key.id)}
                  >
                    {visible_keys[key.id] ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>

                  {/* COPY TO CLIPBOARD */}
                  <button
                    className="h-full p-2 cursor-pointer"
                    onClick={() => handle_copy_key_to_clipboard(key.key)}
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>

              {/* MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="aspect-square h-fit p-1 relative z-5"
                    disabled={deleting_id === key.id}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this API key? This action cannot be undone."
                        )
                      ) {
                        return;
                      }
                      set_deleting_id(key.id);
                      try {
                        await delete_api_key(key.id);
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to delete API key.",
                        });
                      } finally {
                        set_deleting_id(null);
                      }
                    }}
                    disabled={deleting_id === key.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleting_id === key.id ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/*======= DIALOG =======*/
function CreateApiKeyDialog({
  is_open,
  on_close,
}: {
  is_open: boolean;
  on_close: () => void;
}) {
  /*------- ATTRIBUTES -------*/
  const { loading } = useAuthStore();
  const { create_api_key } = useUserStore();
  const [api_key_name, set_api_key_name] = useState("");
  const [error, set_error] = useState<string | null>(null);

  /*------- METHODS -------*/
  const handle_submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!api_key_name.trim()) {
      set_error("Please enter an API key name");
      return;
    }

    set_error(null);

    try {
      await create_api_key(api_key_name.trim());
      set_api_key_name("");
      on_close();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create API key. Please try again later.",
      });
    }
  };

  /*------- RENDERER -------*/
  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new API key</DialogTitle>
        </DialogHeader>

        <form onSubmit={handle_submit} className="flex flex-col gap-y-4">
          <Label className="flex flex-col gap-y-2">
            <span className="font-medium">API Key name</span>
            <Input
              value={api_key_name}
              onChange={(e) => {
                set_api_key_name(e.target.value);
                set_error(null);
              }}
              placeholder="Enter API key name"
              autoFocus
              disabled={loading}
            />
          </Label>
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button variant="outline" onClick={on_close} disabled={loading}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !api_key_name.trim()}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "Creating..." : "Create API key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
