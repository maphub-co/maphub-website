import { MapInfos } from "./map";

export interface FolderInfos {
  id: string;
  name: string;
  created_time: string;
  updated_time: string;
  parent_folder_id: string;
  workspace_id: string;
}

export interface FolderPathItem {
  id: string;
  name: string;
}

export interface FolderContent {
  folder: FolderInfos;
  child_folders: FolderInfos[];
  map_infos: MapInfos[];
}
