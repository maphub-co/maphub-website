"use client";

// LIBRARIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowBigUp } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { requests_services } from "@/services/requests.services";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/Dialog";
import { RequestInfos } from "@/interfaces/request";

/*======= INTERFACES =======*/
interface UpvoteButtonProps {
  request_infos: RequestInfos;
  on_upvote_change?: (new_count: number) => void;
  className?: string;
}

/*======= COMPONENT =======*/
export function UpvoteButton({
  request_infos,
  on_upvote_change,
  className = "",
}: UpvoteButtonProps) {
  /*------- STATE -------*/
  const { is_authenticated } = useAuthStore();
  const { request, user_has_upvoted } = request_infos;
  const [is_loading, set_loading] = useState(false);
  const [upvote_count, set_upvote_count] = useState(request.upvote_count);
  const [is_modal_open, set_modal_open] = useState(false);
  const [is_upvoted, set_upvoted] = useState(user_has_upvoted);

  /*------- FUNCTIONS -------*/
  const handle_upvote_toggle = async () => {
    if (!is_authenticated) {
      set_modal_open(true);
      return;
    }

    if (is_loading) return;

    set_loading(true);
    try {
      let new_count;

      if (is_upvoted) {
        new_count = await requests_services.remove_upvote_async(request.id);
        set_upvoted(false);
      } else {
        new_count = await requests_services.upvote_request_async(request.id);
        set_upvoted(true);
      }

      set_upvote_count(new_count);
      on_upvote_change?.(new_count);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Action failed",
        description: "Error: Failed to update upvote",
        variant: "destructive",
      });
    } finally {
      set_loading(false);
    }
  };

  /*------- RENDER -------*/
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={is_upvoted ? "primary" : "outline"}
              className={`min-w-14 h-auto p-2 ${className}`}
              onClick={handle_upvote_toggle}
              disabled={is_loading}
            >
              <ArrowBigUp
                className={`h-5 w-5 mr-1 ${
                  is_upvoted ? "fill-current" : "fill-none"
                }`}
              />
              <span className="mx-auto">{upvote_count}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {user_has_upvoted ? "Remove your upvote" : "Upvote this request"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* DIALOG */}
      <AuthRequiredDialog
        open={is_modal_open}
        onClose={() => set_modal_open(false)}
      />
    </>
  );
}

function AuthRequiredDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  /*------- STATE -------*/
  const router = useRouter();

  /*------- HANDLERS -------*/
  const handle_login = () => {
    localStorage.setItem("login_return_url", window.location.pathname);
    router.push("/login");
  };

  /*------- RENDER -------*/
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-y-0">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base flex flex-row items-center gap-x-2">
            <AlertCircle className="h-5 w-5 m-0" />
            Authentication Required
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-4">
          <p>You need to be logged in to upvote a request.</p>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handle_login}>Log In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
