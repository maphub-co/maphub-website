"use client";

// LIBRARIES
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { auth } from "@/lib/firebase";

const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || "firebase").toLowerCase();
const isKeycloak = provider === "keycloak";

/*======= TYPE =======*/
// Minimal Firebase-like shim for Keycloak sessions
export type TokenUserShim = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  emailVerified: boolean;
  phoneNumber: string | null;
  providerId: string; // "keycloak"
  tenantId: string | null;

  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }>;

  metadata: {
    creationTime: string | null;
    lastSignInTime: string | null;
  };

  getIdToken: (forceRefresh?: boolean) => Promise<string>;
  reload?: () => Promise<void>;
  toJSON?: () => unknown;
};

export type UserLike = FirebaseUser | TokenUserShim | null;

interface AuthState {
  // State
  user: UserLike;
  loading: boolean;
  set_loading: (loading: boolean) => void;
  is_authenticated: boolean;
  set_authenticated: (user: UserLike) => void;

  // Actions
  login: (email: string, password: string) => Promise<FirebaseUser>;
  login_with_google: () => Promise<FirebaseUser>;
  signup: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
}

/*======= STORE =======*/
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /*------- STATE -------*/
      user: null,

      // Updated in sync with firebase onAuthStateChanged on the AuthProvider
      loading: true, // Must be "true" by default
      set_loading: (loading) => set({ loading }),

      // Updated in sync with firebase onAuthStateChanged on the AuthProvider
      is_authenticated: false,
      set_authenticated: (user) => set({ user, is_authenticated: !!user }),

      /*------- ACTIONS -------*/
      login: async (email: string, password: string) => {
        if (isKeycloak) throw new Error("login() not available in Keycloak mode");
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
      },

      login_with_google: async () => {
        if (isKeycloak) throw new Error("login_with_google() not available in Keycloak mode");
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
      },

      signup: async (email: string, password: string) => {
        if (isKeycloak) throw new Error("signup() not available in Keycloak mode");
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
      },

      logout: async () => {
        if (isKeycloak) {
          // Clear NextAuth session without immediate redirect; we'll control navigation
          await nextAuthSignOut({ redirect: false });

          // Immediately reflect logged-out state in the UI
          set({ is_authenticated: false, user: null });

          // Trigger IdP (Keycloak) logout to clear SSO session as well
          if (typeof window !== "undefined") {
            window.location.href = "/api/kc-logout";
          }
          return;
        }
        await firebaseSignOut(auth);
        set({ is_authenticated: false, user: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        is_authenticated: state.is_authenticated,
      }),
      skipHydration: true,
    }
  )
);

// Factory to create a Firebase-like Keycloak user
export function createKeycloakUserShim(params: {
  accessToken?: string;
  sub?: string | null;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  emailVerified?: boolean | null;
}): TokenUserShim | null {
  const { accessToken, sub, email, name, picture, emailVerified } = params;
  if (!accessToken || !sub) return null;
  const now = new Date().toISOString();
  return {
    uid: sub,
    email: email ?? null,
    displayName: name ?? null,
    photoURL: picture ?? null,
    emailVerified: !!emailVerified,
    phoneNumber: null,
    providerId: "keycloak",
    tenantId: null,
    providerData: [
      {
        providerId: "keycloak",
        uid: sub,
        displayName: name ?? null,
        email: email ?? null,
        phoneNumber: null,
        photoURL: picture ?? null,
      },
    ],
    metadata: {
      creationTime: null,
      lastSignInTime: now,
    },
    getIdToken: async () => accessToken,
    reload: async () => {},
    toJSON: () => ({ providerId: "keycloak", sub }),
  };
}
