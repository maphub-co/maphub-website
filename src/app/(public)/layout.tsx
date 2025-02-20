// COMPONENTS
import PublicHeader from "@/components/layout/PublicHeader";

/*======= LAYOUT =======*/
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <div className="w-full h-full max-h-full overflow-x-hidden overflow-y-auto scroll-smooth">
        {children}
      </div>
    </>
  );
}
