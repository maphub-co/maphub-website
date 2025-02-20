// COMPONENTS
import AppHeader from "@/components/layout/AppHeader";

/*======= LAYOUT =======*/
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="w-full h-full max-h-full overflow-x-hidden overflow-y-auto scroll-smooth">
        {children}
      </div>
    </>
  );
}
