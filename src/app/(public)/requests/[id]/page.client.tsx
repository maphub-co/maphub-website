"use client";

// INTERFACES
import {
  RequestComment,
  RequestInfos,
  RequestStatus,
} from "@/interfaces/request";

// LIBRARIES
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Send,
  Loader2,
  MailPlus,
  ChevronLeft,
  Info,
  CornerUpLeft,
  X,
  Trash,
  MoreHorizontal,
} from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { get_relative_time_string } from "@/utils/time.utils";

// SERVICES
import { requests_services } from "@/services/requests.services";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { UpvoteButton } from "../_components/UpvoteButton";

// UTILS
const format_date = (date_string: string) => {
  try {
    return format(new Date(date_string), "MMM dd yyyy");
  } catch (error) {
    return date_string;
  }
};

/*======= INTERFACES =======*/
interface RequestClientProps {
  request_id: string;
}

/*======= COMPONENT =======*/
export default function RequestClient({ request_id }: RequestClientProps) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const {
    loading: auth_loading,
    user: auth_user,
    is_authenticated,
  } = useAuthStore();

  const [request, set_request] = useState<RequestInfos | null>(null);
  const [comments, set_comments] = useState<RequestComment[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  const [new_comment, set_new_comment] = useState("");
  const [is_submitting_comment, set_is_submitting_comment] = useState(false);

  const [map_url, set_map_url] = useState("");
  const [is_submitting_fulfillment, set_is_submitting_fulfillment] =
    useState(false);
  const [is_submitting_validation, set_is_submitting_validation] =
    useState(false);
  const [is_submitting_rejection, set_is_submitting_rejection] =
    useState(false);

  const [fulfill_dialog_open, set_fulfill_dialog_open] = useState(false);
  const [reject_reason, set_reject_reason] = useState("");

  const [is_submitting_reply, set_is_submitting_reply] = useState(false);

  /*------- METHODS -------*/
  const fetch_request_details = async () => {
    set_is_loading(true);
    set_error(null);

    try {
      // Fetch the request details
      const request_data = await requests_services.get_request_async(
        request_id
      );
      set_request(request_data);

      // Fetch comments
      const comments_response = await requests_services.get_comments_async(
        request_id
      );
      set_comments(comments_response.comments);
    } catch (err: any) {
      console.error("Error fetching request details:", err);
      set_error(err.message || "Failed to load request details");

      // If the request doesn't exist, redirect to the hub
      if (err.message.includes("404")) {
        toast({
          title: "Request not found",
          description:
            "The requested dataset request was not found or has been deleted.",
          variant: "destructive",
        });
        router.push("/hub?tab=requests");
      }
    } finally {
      set_is_loading(false);
    }
  };

  const delete_comment = async (comment_id: string) => {
    try {
      const response = await requests_services.delete_comment_async(
        request_id,
        comment_id
      );
      set_comments(response.comments);
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Failed to delete comment",
        description: "An error occurred while deleting the comment",
        variant: "destructive",
      });
    }
  };

  /*------- EFFECTS -------*/
  useEffect(() => {
    if (!request_id || auth_loading) return;

    fetch_request_details();
  }, [request_id, auth_loading]);

  /*------- RENDERER -------*/
  if (auth_loading || is_loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-destructive">{error}</p>
            <Button className="mt-4" asChild>
              <Link href="/requests">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p>
              The requested dataset request could not be found or has been
              deleted.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/requests">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if current user is the request creator
  const is_creator = auth_user && auth_user.uid === request.author.id;

  const delete_request = async () => {
    try {
      await requests_services.delete_request_async(request_id);
      toast({
        title: "Request deleted",
        description: "The request has been deleted successfully",
      });
      router.push("/requests");
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Failed to delete request",
        description:
          error.message || "An error occurred while deleting the request",
        variant: "destructive",
      });
    }
  };

  // Submit a new comment
  const handle_comment_submit = async () => {
    if (!is_authenticated) {
      window.alert("You need to be logged in to add a comment.");
      return false;
    }

    if (!new_comment.trim() || is_submitting_comment) return;

    set_is_submitting_comment(true);
    try {
      const comment = await requests_services.add_comment_async(
        request_id,
        new_comment,
        false // Not a rejection reason
      );

      // Add the new comment to the list
      set_comments((prev_comments) => [...prev_comments, comment]);

      // Clear the input
      set_new_comment("");

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add comment",
        description:
          error.message || "An error occurred while adding your comment",
        variant: "destructive",
      });
    } finally {
      set_is_submitting_comment(false);
    }
  };

  const handle_submission_clicked = () => {
    if (!is_authenticated) {
      window.alert("You need to be logged in to submit a dataset.");
      return false;
    }

    set_fulfill_dialog_open(true);
  };

  // Submit submission
  const handle_submission_request = async () => {
    if (!map_url.trim() || is_submitting_fulfillment) return;

    // Simple regex to extract UUID from MapHub map URL
    const map_id_match = map_url.match(/\/map\/([0-9a-f-]+)/i);
    if (!map_id_match || !map_id_match[1]) {
      toast({
        title: "Invalid map URL",
        description:
          "Please enter a valid MapHub map URL (e.g., https://www.maphub.co/map/...)",
        variant: "destructive",
      });
      return;
    }

    const map_id = map_id_match[1];
    set_is_submitting_fulfillment(true);

    try {
      await requests_services.submission_request_async(request_id, map_id);

      toast({
        title: "Map submitted",
        description: "Your map has been submitted to this request.",
      });

      // Close the dialog and refresh the data
      set_fulfill_dialog_open(false);
      set_map_url("");
      fetch_request_details();
    } catch (error: any) {
      toast({
        title: "Failed to fulfill request",
        description:
          error.message || "An error occurred while fulfilling the request",
        variant: "destructive",
      });
    } finally {
      set_is_submitting_fulfillment(false);
    }
  };

  // Validate submission
  const handle_validate_submission = async () => {
    if (!request?.request.submitted_map_id || is_submitting_validation) return;

    set_is_submitting_validation(true);
    try {
      await requests_services.validate_submission_async(request_id);

      toast({
        title: "Fulfillment validated",
        description: "You have validated the fulfillment for this request.",
      });

      // Refresh the data
      fetch_request_details();
    } catch (error: any) {
      console.error("Validation error:", error);
      toast({
        title: "Failed to validate fulfillment",
        description:
          error.message || "An error occurred while validating the fulfillment",
        variant: "destructive",
      });
    } finally {
      set_is_submitting_validation(false);
    }
  };

  // Reject submission
  const handle_reject_submission = async () => {
    if (
      !request?.request.submitted_map_id ||
      !reject_reason.trim() ||
      is_submitting_rejection
    )
      return;

    set_is_submitting_rejection(true);
    try {
      // First reject the submission
      await requests_services.reject_submission_async(
        request_id,
        request.request.submitted_map_id
      );

      // Then add the rejection reason as a comment
      await requests_services.add_comment_async(
        request_id,
        reject_reason,
        true // This is a rejection reason
      );

      toast({
        title: "Fulfillment rejected",
        description: "You have rejected the fulfillment for this request.",
      });

      // Clear the input and refresh the data
      set_reject_reason("");
      fetch_request_details();
    } catch (error: any) {
      toast({
        title: "Failed to reject fulfillment",
        description:
          error.message || "An error occurred while rejecting the fulfillment",
        variant: "destructive",
      });
    } finally {
      set_is_submitting_rejection(false);
    }
  };

  // Status badge
  const get_status_badge = () => {
    switch (request.request.status) {
      case RequestStatus.OPEN:
        return (
          <Badge variant="default" className="mb-0">
            Open
          </Badge>
        );
      case RequestStatus.SUBMITTED:
        return request.request.is_validated ? (
          <Badge className="bg-emerald-600 mb-0">Validated</Badge>
        ) : (
          <Badge className="bg-amber-500 mb-0">Submitted</Badge>
        );
      case RequestStatus.CLOSED:
        return (
          <Badge variant="destructive" className="mb-0">
            Closed
          </Badge>
        );
      default:
        return <Badge className="mb-0">Unknown</Badge>;
    }
  };

  // Handle replying to a comment
  const handle_comment_reply = async (
    parent_id: string,
    content: string
  ): Promise<boolean> => {
    if (!content.trim() || is_submitting_reply) return false;

    set_is_submitting_reply(true);
    try {
      const comment = await requests_services.add_comment_async(
        request_id,
        content,
        false,
        parent_id // Pass the parent comment ID
      );

      // Update the comments with the new reply
      set_comments((prev_comments) => [...prev_comments, comment]);

      toast({
        title: "Reply added",
        description: "Your reply has been added successfully.",
      });

      return true; // Return success status to clear form in child component
    } catch (error: any) {
      toast({
        title: "Failed to add reply",
        description:
          error.message || "An error occurred while adding your reply",
        variant: "destructive",
      });
      return false;
    } finally {
      set_is_submitting_reply(false);
    }
  };

  const handle_delete_request = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this request? This action cannot be undone."
      )
    ) {
      delete_request();
    }
  };

  /*------- RENDERER -------*/
  return (
    <div className="container max-w-4xl mx-auto p-8 flex flex-col gap-8">
      {/* BACK BUTTON */}
      <Link
        href="/requests"
        className="btn btn-link btn-size-default m-4 text-muted-foreground absolute top-16 left-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      {/* REQUEST DETAILS */}
      <Card>
        {/* HEADER */}
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center mb-0">
            {/* Status */}
            {get_status_badge()}

            {/* Last update */}
            <span className="text-xs text-muted-foreground mx-1">
              • {get_relative_time_string(request.request.updated_at)} ago.
            </span>
          </div>

          <div className="flex flex-row items-center mb-0">
            <p className="text-xs text-muted-foreground flex items-center mx-2">
              {request.author ? (
                <>
                  <span>Created by</span>
                  <Link
                    href={`/profile/${request.author.id}`}
                    className="ml-1 text-primary hover:underline"
                  >
                    {is_creator ? "You" : request.author.name}
                  </Link>
                  <span className="mx-1">on</span>
                </>
              ) : (
                <span>Created on</span>
              )}
              <span>{format_date(request.request.created_at)}</span>
            </p>

            {is_creator && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" side="right">
                  <DropdownMenuItem onClick={handle_delete_request}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-6 pt-2 flex flex-col gap-4">
          {/* TITLE */}
          <CardTitle className="text-2xl">{request.request.title}</CardTitle>

          {/* DESCRIPTION */}
          <CardDescription className="text-foreground whitespace-pre-wrap">
            {request.request.description}
          </CardDescription>

          {/* TAGS */}
          {request.request.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {request.request.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-accent text-accent-foreground border-none"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* SUBMISSION STATUS */}
          {request.request.submitted_map_id && (
            <Card className="p-0 border rounded-md bg-muted mt-6">
              <CardHeader className="flex flex-row items-center p-4">
                <MailPlus className="h-5 w-5 mr-2 mb-0" />
                <CardTitle className="text-base font-medium mb-0">
                  Submission status
                </CardTitle>
              </CardHeader>

              <div className="p-4 pt-0 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  This request has received a submission,
                  {request.request.is_validated
                    ? " and it has been validated by the requester."
                    : " and it is waiting for validation from the requester."}
                </p>

                <Link
                  href={`/map/${request.request.submitted_map_id}`}
                  className="btn btn-primary btn-size-lg"
                >
                  {request.request.is_validated
                    ? "See validated dataset"
                    : "Check submitted dataset"}
                </Link>
              </div>

              {is_creator &&
                !request.request.is_validated &&
                request.request.status === RequestStatus.SUBMITTED && (
                  <CardFooter className="p-4 justify-end gap-2">
                    <Button
                      variant="default"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handle_validate_submission}
                      disabled={is_submitting_validation}
                    >
                      {is_submitting_validation ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Validate
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          disabled={is_submitting_rejection}
                        >
                          {is_submitting_rejection ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        {/* HEADER */}
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Submission</AlertDialogTitle>

                          {/* DESCRIPTION */}
                          <AlertDialogDescription>
                            Please provide a reason for rejecting this
                            submission. This will be visible to everyone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Textarea
                          className="mt-2"
                          placeholder="Explain why this map doesn't fulfill your request..."
                          value={reject_reason}
                          onChange={(e) => set_reject_reason(e.target.value)}
                        />

                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={!reject_reason.trim()}
                            onClick={handle_reject_submission}
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                )}
            </Card>
          )}
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="px-4 py-2 border-t flex flex-wrap justify-between gap-y-2">
          <UpvoteButton request_infos={request} />

          {/* Action buttons */}
          {request.request.status === RequestStatus.OPEN && (
            <>
              <Button variant="primary" onClick={handle_submission_clicked}>
                <Send className="h-4 w-4 mr-2" />
                <span>Submit a Dataset</span>
              </Button>

              <Dialog
                open={fulfill_dialog_open}
                onOpenChange={set_fulfill_dialog_open}
              >
                <DialogContent className="p-0 gap-0">
                  {/* HEADER */}
                  <DialogHeader className="p-4 border-b">
                    <DialogTitle>Submit a Dataset</DialogTitle>
                  </DialogHeader>

                  <div className="p-4 flex flex-col gap-4">
                    {/* DESCRIPTION */}
                    <DialogDescription>
                      Provide a link to your MapHub map that fulfills this
                      request.
                    </DialogDescription>

                    {/* MAP URL */}
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Map URL</span>
                      <Input
                        type="url"
                        placeholder="https://www.maphub.co/map/..."
                        value={map_url}
                        onChange={(event) => set_map_url(event.target.value)}
                        className="mt-1"
                      />
                    </label>

                    {/* NOTE */}
                    <p className="flex items-center text-xs text-muted-foreground mt-2">
                      <Info className="h-4 w-4 mr-1" />
                      Note: The map must be public in order to fulfill this
                      request.
                    </p>
                  </div>

                  <DialogFooter className="px-4 py-2 border-t">
                    <Button
                      variant="outline"
                      onClick={() => set_fulfill_dialog_open(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!map_url.trim() || is_submitting_fulfillment}
                      onClick={handle_submission_request}
                    >
                      {is_submitting_fulfillment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardFooter>
      </Card>

      {/* COMMENTS */}
      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        {/* LIST */}
        {comments.length > 0 && (
          <div className="space-y-4 mb-6">
            <CommentThread
              comments={comments}
              on_reply_submit={handle_comment_reply}
              on_delete_comment={delete_comment}
            />
          </div>
        )}

        {/* INPUT */}
        <div className="flex flex-col gap-2">
          <Textarea
            className="resize-none bg-muted text-foreground"
            placeholder="Add a comment..."
            value={new_comment}
            onChange={(e) => set_new_comment(e.target.value)}
          />

          <Button
            className="min-w-16 self-end flex items-center gap-x-2"
            disabled={!new_comment.trim() || is_submitting_comment}
            onClick={handle_comment_submit}
          >
            {is_submitting_comment ? (
              <Loader2 className="h-4 w-4 mx-auto animate-spin" />
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Comment Thread Component - This renders the nested comments
const CommentThread = ({
  comments,
  on_reply_submit,
  on_delete_comment,
  level = 0,
}: {
  comments: RequestComment[];
  on_reply_submit: (parent_id: string, content: string) => Promise<boolean>;
  on_delete_comment: (comment_id: string) => Promise<void>;
  level?: number;
}) => {
  /*------- ATTRIBUTES -------*/
  const { is_authenticated, user } = useAuthStore();
  const root_comments = level === 0 ? organize_comments(comments) : comments;

  /*------- METHODS -------*/
  const handle_delete = (comment_id: string, has_replies: boolean) => {
    const message = has_replies
      ? "Are you sure you want to delete this comment and all its replies? This action cannot be undone."
      : "Are you sure you want to delete this comment? This action cannot be undone.";

    if (window.confirm(message)) {
      on_delete_comment(comment_id);
    }
  };

  function organize_comments(comments: RequestComment[]) {
    const comment_map = new Map<string, RequestComment>();
    const root_comments: RequestComment[] = [];

    // First, create a map of all comments by ID
    comments.forEach((comment) => {
      comment_map.set(comment.id, { ...comment, replies: [] });
    });

    // Then, organize them into a tree
    comments.forEach((comment) => {
      if (comment.parent_id && comment_map.has(comment.parent_id)) {
        // This is a reply to another comment
        const parent_comment = comment_map.get(comment.parent_id);
        if (parent_comment && parent_comment.replies) {
          parent_comment.replies.push(comment_map.get(comment.id)!);
        }
      } else {
        // This is a top-level comment
        root_comments.push(comment_map.get(comment.id)!);
      }
    });

    return root_comments;
  }

  /*------- RENDERER -------*/
  return (
    <div className="space-y-4">
      {root_comments.map((comment) => (
        <div key={comment.id} className={`ml-${level * 6}`}>
          <Card
            className={comment.is_rejection_reason ? "border-destructive" : ""}
          >
            {/* HEADER */}
            <CardHeader className="px-3 py-2 border-b flex flex-row items-center justify-between">
              <p className="text-sm flex items-center">
                <span className="mr-1">
                  {comment.author.name || "Anonymous"}
                </span>
                <span className="text-muted-foreground">
                  • {format_date(comment.created_at)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {comment.is_rejection_reason ? (
                  <Badge variant="destructive" className="ml-2">
                    Rejection Reason
                  </Badge>
                ) : (
                  is_authenticated &&
                  comment.author.id === user?.uid && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start" side="right">
                        <DropdownMenuItem
                          onClick={() => {
                            const hasReplies = Boolean(comment.replies?.length);
                            handle_delete(comment.id, hasReplies);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          {comment.replies && comment.replies?.length > 0
                            ? "Delete thread"
                            : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                )}
              </div>
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="px-4 py-2">
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </CardContent>

            {/* FOOTER */}
            <CardFooter className="p-2 flex justify-end">
              <ReplyForm parent_id={comment.id} on_submit={on_reply_submit} />
            </CardFooter>
          </Card>

          {/* Render replies if any */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 ml-4 pl-4 border-l-2 border-muted">
              <CommentThread
                comments={comment.replies}
                on_reply_submit={on_reply_submit}
                on_delete_comment={on_delete_comment}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Create a new component for comment replies with local state
const ReplyForm = ({
  parent_id,
  on_submit,
}: {
  parent_id: string;
  on_submit: (parent_id: string, content: string) => Promise<boolean>;
}) => {
  /*------- ATTRIBUTES -------*/
  const { is_authenticated } = useAuthStore();
  const [is_replying, set_is_replying] = useState(false);
  const [reply_content, set_reply_content] = useState("");
  const [is_submitting, set_is_submitting] = useState(false);

  /*------- METHODS -------*/
  const handle_click = () => {
    if (!is_authenticated) {
      window.alert("You need to be logged in to reply to a comment.");
      return false;
    }

    set_is_replying(true);
  };

  const handle_submit = async () => {
    if (!reply_content.trim() || is_submitting) return;

    set_is_submitting(true);
    const success = await on_submit(parent_id, reply_content);
    set_is_submitting(false);

    if (success) {
      set_reply_content("");
      set_is_replying(false);
    }
  };

  if (!is_replying) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={handle_click}
            >
              <CornerUpLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            Reply to this comment
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="w-full flex gap-2 mt-2">
      <Textarea
        className="flex-1 text-sm bg-muted resize-none"
        placeholder="Write your reply..."
        value={reply_content}
        onChange={(e) => set_reply_content(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        {/* CANCEL */}
        <Button
          variant="ghost"
          size="icon"
          className="self-end"
          onClick={() => set_is_replying(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* SEND */}
        <Button
          variant="primary"
          size="icon"
          className="self-end"
          onClick={handle_submit}
          disabled={!reply_content.trim() || is_submitting}
        >
          {is_submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
