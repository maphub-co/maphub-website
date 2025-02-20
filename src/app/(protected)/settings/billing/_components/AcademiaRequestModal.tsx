"use client";

// LIBRARIES
import { useState } from "react";
import { Check, Mail, GraduationCap } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { academia_service } from "@/services/academia.services";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

/*======= INTERFACES =======*/
interface AcademiaRequestModalProps {
  is_open: boolean;
  on_close: () => void;
}

/*======= COMPONENT =======*/
export default function AcademiaRequestModal({
  is_open,
  on_close,
}: AcademiaRequestModalProps) {
  /*------- ATTRIBUTES -------*/
  const { user: current_user } = useUserStore();

  const [role, set_role] = useState<string>("");
  const [custom_role, set_custom_role] = useState<string>("");
  const [message, set_message] = useState<string>("");
  const [is_submitting, set_is_submitting] = useState<boolean>(false);
  const [is_submitted, set_is_submitted] = useState<boolean>(false);

  /*------- METHODS -------*/
  const is_form_valid = () => {
    const role_valid =
      role === "other" ? custom_role.trim().length > 0 : role.length > 0;
    const message_valid = message.trim().length >= 100;
    return role_valid && message_valid;
  };

  const handle_submit = async () => {
    if (!is_form_valid() || !current_user) return;

    set_is_submitting(true);

    try {
      const final_role = role === "other" ? custom_role : role;

      await academia_service.request_plus_plan({
        email: current_user.email,
        user_name: current_user.display_name || current_user.email,
        user_id: current_user.uid,
        role: final_role,
        message: message.trim(),
      });

      set_is_submitted(true);
      toast({
        title: "Request submitted successfully!",
        description: "We'll review your request and get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting academia request:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          "There was an error submitting your request. Please try again.",
      });
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_close = () => {
    if (!is_submitting) {
      set_role("");
      set_custom_role("");
      set_message("");
      set_is_submitted(false);
      on_close();
    }
  };

  /*------- RENDERER -------*/
  if (is_submitted) {
    return (
      <Dialog open={is_open} onOpenChange={(open) => !open && handle_close()}>
        <DialogContent className="sm:max-w-md p-0 gap-y-0">
          {/* HEADER */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center font-semibold text-green-600">
              <Check className="size-5 mr-2" />
              Request Submitted!
            </DialogTitle>
          </DialogHeader>

          {/* CONTENT */}
          <div className="p-6 text-center">
            <GraduationCap className="size-16 mx-auto mb-4 text-green-500" />
            <p className="text-sm mb-4">
              Thank you for your request! We'll review your application and get
              back to you within 2-3 business days.
            </p>
            <p className="text-xs text-muted-foreground">
              Please check your email for a confirmation message.
            </p>
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-4 py-2 border-t">
            <Button onClick={handle_close} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && handle_close()}>
      <DialogContent className="sm:max-w-lg p-0 gap-y-0">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center font-semibold">
            Request Plus plan for academia
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-6 flex flex-col gap-y-8">
          <p className="p-3 text-sm bg-muted text-muted-foreground rounded-md">
            We provide free Plus accounts to students, teachers, and researchers
            with university email addresses.
          </p>

          {/* EMAIL */}
          <Label className="flex flex-col gap-y-2">
            <span>
              University Email Address :{" "}
              <span className="text-destructive">*</span>
            </span>

            <Input
              id="email"
              type="email"
              value={current_user?.email || ""}
              disabled
              className="bg-muted"
            />
          </Label>

          {/* ROLE SELECTION */}
          <Label className="flex flex-col gap-y-2">
            <span>
              Your Role : <span className="text-destructive">*</span>
            </span>

            <RadioGroup value={role} onValueChange={set_role}>
              <Label className="flex items-center gap-x-2">
                <RadioGroupItem value="student" id="student" />
                Student
              </Label>

              <Label className="flex items-center gap-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                Teacher/Professor
              </Label>

              <Label className="flex items-center gap-x-2">
                <RadioGroupItem value="researcher" id="researcher" />
                Researcher
              </Label>

              <Label className="flex items-center gap-x-2">
                <RadioGroupItem value="other" id="other" />
                Other
              </Label>
            </RadioGroup>

            {role === "other" && (
              <Input
                placeholder="Please specify your role..."
                value={custom_role}
                onChange={(e) => set_custom_role(e.target.value)}
                className="mt-2"
              />
            )}
          </Label>

          {/* MESSAGE */}
          <Label className="flex flex-col gap-y-2">
            <span>
              How will you use MapHub ?{" "}
              <span className="text-destructive">*</span>
            </span>

            <Textarea
              id="message"
              placeholder="Please describe how you plan to use MapHub for your academic work (minimum 100 characters)..."
              value={message}
              onChange={(e) => set_message(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <p className="text-xs text-muted-foreground">
              {message.length}/100 characters minimum
            </p>
          </Label>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button
            variant="outline"
            onClick={handle_close}
            disabled={is_submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handle_submit}
            disabled={!is_form_valid() || is_submitting}
          >
            {is_submitting ? (
              <>
                <Mail className="size-4 mr-2 animate-pulse" />
                Submitting...
              </>
            ) : (
              <>
                <Mail className="size-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
