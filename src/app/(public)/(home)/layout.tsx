// SCHEMA
import { HomePageSchema } from "@/lib/schema";

// COMPONENTS
import SchemaScript from "@/components/SchemaScript";

/*======= LAYOUT =======*/
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SchemaScript id="maphub-home-page" schema={HomePageSchema} />
    </>
  );
}
