/**
 * Validates if a single file is a supported format
 * @param file - File to validate
 * @returns True if the file is a supported format
 */
export function validate_geospatial_file_format(file: File): boolean {
  const lowercase_name = file.name.toLowerCase();

  return (
    lowercase_name.endsWith(".tif") ||
    lowercase_name.endsWith(".tiff") ||
    lowercase_name.endsWith(".geojson") ||
    lowercase_name.endsWith(".fgb") ||
    lowercase_name.endsWith(".kml") ||
    lowercase_name.endsWith(".gpkg") ||
    lowercase_name.endsWith(".xlsx") ||
    lowercase_name.endsWith(".csv") ||
    lowercase_name.endsWith(".zip")
  );
}

/**
 * Checks if a file is a shapefile component
 * @param file - File to check
 * @returns True if the file is a shapefile component
 */
export function is_shapefile_component(file: File): boolean {
  const lowercase_name = file.name.toLowerCase();
  return (
    lowercase_name.endsWith(".shp") ||
    lowercase_name.endsWith(".shx") ||
    lowercase_name.endsWith(".dbf") ||
    lowercase_name.endsWith(".prj") ||
    lowercase_name.endsWith(".cpg") ||
    lowercase_name.endsWith(".qmd")
  );
}

/**
 * Validates if a set of files forms a complete shapefile with all required components
 * @param files - Array of files to validate
 * @returns True if the files form a valid shapefile set
 */
export function validate_shapefile_components(files: File[]): boolean {
  // Group files by base name
  const file_groups: Record<string, string[]> = {};

  files.forEach((file) => {
    const file_name = file.name.toLowerCase();
    const base_name = file_name.substring(0, file_name.lastIndexOf("."));

    if (!file_groups[base_name]) {
      file_groups[base_name] = [];
    }
    file_groups[base_name].push(
      file_name.substring(file_name.lastIndexOf(".") + 1)
    );
  });

  // Check if any group forms a complete shapefile set with required .prj file
  return Object.values(file_groups).some(
    (extensions) =>
      extensions.includes("shp") &&
      extensions.includes("shx") &&
      extensions.includes("dbf") &&
      extensions.includes("prj") // Now requiring .prj file
  );
}
