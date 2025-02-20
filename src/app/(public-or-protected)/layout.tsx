"use client";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import PublicHeader from "@/components/layout/PublicHeader";
import AppHeader from "@/components/layout/AppHeader";

/*======= LAYOUT =======*/
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*------- ATTRIBUTES -------*/
  const { is_authenticated } = useAuthStore();

  /*------- RENDERER -------*/
  return (
    <>
      {/* HEADER */}
      {is_authenticated ? <AppHeader /> : <PublicHeader />}

      {/* CONTENT */}
      <div className="w-full h-full max-h-full overflow-x-hidden overflow-y-auto scroll-smooth">
        {children}
      </div>
    </>
  );
}
