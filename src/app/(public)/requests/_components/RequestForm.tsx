"use client";

// LIBRARIES
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, Loader2, Plus } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { requests_services } from "@/services/requests.services";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagsInput } from "@/components/ui/TagsInput";

// CONSTANTS
const form_schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Please provide a detailed description"),
  tags: z.array(z.string()).default([]),
});

/*======= TYPES =======*/
type FormData = z.infer<typeof form_schema>;

/*======= INTERFACES =======*/
interface RequestFormProps {
  on_request_created?: () => void;
}

/*======= COMPONENT =======*/
export default function RequestForm({ on_request_created }: RequestFormProps) {
  /*------- STATE -------*/
  const { is_authenticated } = useAuthStore();
  const [is_auth_required, set_is_auth_required] = useState(false);
  const [is_open, set_open] = useState(false);
  const [is_submitting, set_submitting] = useState(false);

  /*------- HOOKS -------*/
  const form = useForm<FormData>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  /*------- METHODS -------*/
  const handle_click = () => {
    if (!is_authenticated) {
      set_is_auth_required(true);
      return;
    }

    set_open(true);
  };

  const handle_submit = async (data: FormData) => {
    set_submitting(true);

    try {
      await requests_services.create_request_async(
        data.title,
        data.description,
        data.tags
      );

      set_open(false);
      form.reset();

      // Call the callback if provided
      if (on_request_created) {
        on_request_created();
      }
    } catch (error: any) {
      console.error("Error creating dataset request:", error);
      toast({
        title: "Failed to create dataset request",
        description:
          error.message || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      set_submitting(false);
    }
  };

  /*------- RENDER -------*/
  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="flex items-center"
        onClick={handle_click}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create new request
      </Button>

      <Dialog open={is_open} onOpenChange={set_open}>
        <DialogContent className="md:max-w-2xl p-0 gap-0">
          {/* HEADER */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Create a new dataset request</DialogTitle>
          </DialogHeader>

          {/* CONTENT */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handle_submit)}>
              <div className="p-6 space-y-4">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Forest coverage of Germany in 2021"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the dataset you need in detail..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagsInput
                          placeholder="Add tags and press Enter"
                          tags={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* FOOTER */}
              <DialogFooter className="px-4 py-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => set_open(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={is_submitting}>
                  {is_submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AuthRequiredDialog
        open={is_auth_required}
        onClose={() => set_is_auth_required(false)}
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
          <p>You need to be logged in to create a new request.</p>
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
