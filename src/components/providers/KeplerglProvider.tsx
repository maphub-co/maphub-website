"use client";

// LIBRARIES
import { Provider } from "react-redux";

// STORES
import kepler_store from "@/stores/keplergl.store";

/*======= COMPONENT =======*/
export default function KeplerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={kepler_store}>{children}</Provider>;
}
