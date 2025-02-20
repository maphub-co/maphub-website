// COMPONENTS
import KeplerglProvider from "@/components/providers/KeplerglProvider";

/*======= INTERFACE =======*/
interface MapLayoutProps {
  children: React.ReactNode;
}

/*======= COMPONENT =======*/
export default function MapLayout({ children }: MapLayoutProps) {
  return <KeplerglProvider>{children}</KeplerglProvider>;
}
