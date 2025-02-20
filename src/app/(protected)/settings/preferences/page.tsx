import { Metadata } from "next";
import PreferencesSettingsClient from "./page.client";

export const metadata: Metadata = {
  title: "Settings | Preferences",
  description: "Manage your preferences",
};

export default function PreferencesSettingsPage() {
  return <PreferencesSettingsClient />;
}
