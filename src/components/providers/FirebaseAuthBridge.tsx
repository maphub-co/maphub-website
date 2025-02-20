"use client";

// LIBRARIES
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// CONFIG
import { auth } from "@/lib/firebase";
import { identify } from "@/lib/mixpanel";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

// CONSTANTS
const ENV = process.env.NEXT_PUBLIC_ENV;

export default function FirebaseAuthBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { set_loading: set_authenticating, set_authenticated } = useAuthStore();
  const { set_loading, fetch_current_user, user, clear_user } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebase_user) => {
      set_authenticating(true);

      if (!firebase_user) {
        set_authenticated(null);
        clear_user();
        set_authenticating(false);
        return;
      }

      // Update auth state
      set_authenticated(firebase_user);

      // Update mixpanel
      if (!!firebase_user?.uid) identify(firebase_user.uid);

      // Log debug information in development
      if (ENV === "development") {
        const token = await firebase_user?.getIdToken();
        console.log("🔑 Firebase token:", token);
        console.log("👤 Firebase user info:", {
          uid: firebase_user?.uid,
          displayName: firebase_user?.displayName,
          email: firebase_user?.email,
          emailVerified: firebase_user?.emailVerified,
        });
      }

      // Fetch maphub user data from our backend
      try {
        set_loading(true);
        await fetch_current_user();

        if (
          user?.display_name === "" &&
          window.location.pathname !== "/onboarding"
        )
          router.push("/onboarding");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        set_loading(false);
      }

      set_authenticating(false);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, [fetch_current_user, clear_user, set_loading]);

  return <>{children}</>;
}
