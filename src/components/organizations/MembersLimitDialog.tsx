// LIBRARIES
import { useParams } from "next/navigation";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/*======= PROPS =======*/
interface LimitReachedDialogProps {
  is_open: boolean;
  on_close: () => void;
}

/*======= COMPONENT =======*/
export default function LimitReachedDialog({
  is_open,
  on_close,
}: LimitReachedDialogProps) {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();

  /*------- RENDERER -------*/
  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className="p-0 flex flex-col gap-y-0 overflow-y-hidden">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b flex-row items-center gap-x-2">
          <AlertTriangle className="size-4 m-0" />
          <DialogTitle>Limit of members reached</DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <DialogDescription className="p-4 text-foreground">
          You have reached the maximum number of seats for your plan. Please
          upgrade to add more members.
        </DialogDescription>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button variant="outline" onClick={on_close}>
            Close
          </Button>

          <Link
            href={`/organizations/${id}/settings/billing`}
            className="btn btn-primary btn-size-default"
          >
            Manage your plan
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
