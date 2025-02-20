// TYPES
import { MapInfos } from "@/interfaces/map";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import FileItem from "@/components/browser/FileItem";

/*======= PROPS =======*/
interface FilesListProps {
  files: MapInfos[];
  view: "list" | "grid";
  refresh: () => void;
}

/*======= COMPONENT =======*/
export default function FilesList({ files, view, refresh }: FilesListProps) {
  return (
    files.length > 0 && (
      <div
        className={cn(
          "grid grid-cols-1",
          view === "grid" &&
            "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
        )}
      >
        {files
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((file) => (
            <FileItem
              key={file.id}
              view={view}
              params={file}
              on_delete={refresh}
            />
          ))}
      </div>
    )
  );
}
