"use client";

// LIBRARIES
import { useState } from "react";

// CONFIG
import { toast } from "@/lib/toast";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactClientPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Here you would typically call an API to subscribe the user
    // For now, we'll just simulate a successful subscription
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Contact Methods */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <a
                  href="mailto:maphub@meteory.eu"
                  className="text-primary hover:underline"
                >
                  maphub@meteory.eu
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  viewBox="0 0 512 512"
                  className="h-6 w-6 text-primary"
                  fill="currentColor"
                >
                  <g>
                    <path d="M433.43,93.222c-32.633-14.973-67.627-26.005-104.216-32.324c-0.666-0.122-1.332,0.183-1.675,0.792   c-4.501,8.005-9.486,18.447-12.977,26.655c-39.353-5.892-78.505-5.892-117.051,0c-3.492-8.39-8.658-18.65-13.179-26.655   c-0.343-0.589-1.009-0.894-1.675-0.792c-36.568,6.298-71.562,17.33-104.216,32.324c-0.283,0.122-0.525,0.325-0.686,0.589   c-66.376,99.165-84.56,195.893-75.64,291.421c0.04,0.467,0.303,0.914,0.666,1.198c43.793,32.161,86.215,51.685,127.848,64.627   c0.666,0.203,1.372-0.04,1.796-0.589c9.848-13.449,18.627-27.63,26.154-42.543c0.444-0.873,0.02-1.909-0.888-2.255   c-13.925-5.282-27.184-11.723-39.939-19.036c-1.009-0.589-1.09-2.032-0.161-2.723c2.684-2.011,5.369-4.104,7.932-6.217   c0.464-0.386,1.11-0.467,1.655-0.224c83.792,38.257,174.507,38.257,257.31,0c0.545-0.264,1.191-0.182,1.675,0.203   c2.564,2.113,5.248,4.226,7.952,6.237c0.928,0.691,0.867,2.134-0.141,2.723c-12.755,7.456-26.014,13.754-39.959,19.016   c-0.908,0.345-1.312,1.402-0.867,2.275c7.689,14.892,16.468,29.073,26.134,42.523c0.404,0.569,1.13,0.813,1.796,0.609   c41.835-12.941,84.257-32.466,128.05-64.627c0.384-0.284,0.626-0.711,0.666-1.178c10.676-110.441-17.881-206.376-75.7-291.421   C433.954,93.547,433.712,93.344,433.43,93.222z M171.094,327.065c-25.227,0-46.014-23.16-46.014-51.604   s20.383-51.604,46.014-51.604c25.831,0,46.417,23.364,46.013,51.604C217.107,303.905,196.723,327.065,171.094,327.065z    M341.221,327.065c-25.226,0-46.013-23.16-46.013-51.604s20.383-51.604,46.013-51.604c25.832,0,46.417,23.364,46.014,51.604   C387.235,303.905,367.054,327.065,341.221,327.065z"></path>
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Discord</h3>
                <a
                  href="https://discord.gg/ufqVjqpVGw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Join our community
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest features, tutorials, and news about
            MapHub.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
