// INTERFACES
import { Licenses } from "@/interfaces/map";

// LIBRARIES
import { Scale } from "lucide-react";

// COMPONENTS
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

/*======= TYPES =======*/
interface LicenseEditorProps {
  license: Licenses | null;
  on_change: (license: Licenses | null) => void;
  is_loading: boolean;
}

/*======= CONSTANTS =======*/
import { licenses_infos } from "@/lib/licenses";

/*======= COMPONENT =======*/
export function LicenseEditor({
  license,
  on_change,
  is_loading,
}: LicenseEditorProps) {
  /*------- METHODS -------*/
  const handle_change = (value: string) => {
    on_change(value === "none" ? null : (value as Licenses));
  };

  /*------- RENDERER -------*/
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium flex items-center gap-x-2">
        <Scale className="size-4" />
        License
      </label>

      <Select
        value={license ? license : "none"}
        onValueChange={handle_change}
        disabled={is_loading}
      >
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Select a license..." />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Licenses).map((option) => (
            <SelectItem key={option} value={option}>
              {licenses_infos[option].name}
            </SelectItem>
          ))}
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
