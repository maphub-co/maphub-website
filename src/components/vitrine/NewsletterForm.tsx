"use client";

// LIBRARIES
import { useState } from "react";
import { Loader2 } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";
import { toast } from "@/lib/toast";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function NewsletterForm() {
  /*------- ATTRIBUTS -------*/
  const [email, set_email] = useState<string>("");
  const [is_submitting, set_submitting] = useState<boolean>(false);

  /*------- METHODS -------*/
  const handle_submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      set_submitting(true);
      const response = await fetch("/api/beehiiv/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong on our side.");

      toast({
        title: "Success !",
        description: "You're subscribed ! Check your email.",
      });
      set_email("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Subscription failed. Please try again.",
      });
    } finally {
      set_submitting(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <section className="container max-w-7xl mx-auto w-full p-4 md:p-8 mb-16 md:mb-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-y-4 md:gap-y-6">
        {/* HEADER */}
        <div className="flex flex-col items-center md:items-start md:gap-y-1">
          <h2 className="text-xl md:text-2xl font-bold">
            Subscribe to our newsletter !
          </h2>

          <p className="text-muted-foreground text-center md:text-left">
            Receive our last product updates and community news directly in your
            inbox.
          </p>
        </div>

        {/* FORM */}
        <form
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={handle_submit}
        >
          <Input
            className="grow"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            required
            disabled={is_submitting}
          />

          <Button
            variant="primary"
            className="cursor-pointer"
            type="submit"
            disabled={is_submitting}
            onClick={() =>
              track("call_to_action_clicked", {
                section: "newsletter_form",
                name: "subscribe",
              })
            }
          >
            {is_submitting ? (
              <Loader2 className="w-4 h-4 mx-8 animate-spin" />
            ) : (
              "Subscribe now"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
