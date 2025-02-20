// TYPES
import { FolderInfos } from "@/interfaces/folder";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import FolderItem from "@/components/browser/FolderItem";

/*======= PROPS =======*/
interface FoldersListProps {
  folders: FolderInfos[];
  view: "list" | "grid";
  refresh: () => void;
}

/*======= COMPONENT =======*/
export default function FoldersList({
  folders,
  view,
  refresh,
}: FoldersListProps) {
  return (
    folders.length > 0 && (
      <div
        className={cn(
          "grid grid-cols-1",
          view === "grid" &&
            "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
        )}
      >
        {folders
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              view={view}
              on_delete={refresh}
            />
          ))}
      </div>
    )
  );
}
