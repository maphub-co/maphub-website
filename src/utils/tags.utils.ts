import {
  COUNTRY_MAPPINGS,
  GEOSPATIAL_CATEGORIES,
  ALL_MAPPINGS,
} from "@/lib/iconify";

/*======= CONSTANTS =======*/
const GEOSPATIAL_KEYWORDS = [
  "map",
  "gis",
  "spatial",
  "geographic",
  "geospatial",
  "location",
  "coordinate",
  "latitude",
  "longitude",
  "projection",
  "datum",
  "crs",
  "shapefile",
  "geojson",
  "wgs84",
  "utm",
  "epsg",
  "raster",
  "vector",
  "satellite",
  "aerial",
  "remote",
  "sensing",
  "landsat",
  "sentinel",
  "modis",
  "dem",
  "elevation",
  "topography",
  "terrain",
  "slope",
  "aspect",
  "watershed",
  "basin",
  "hydrology",
  "cadastral",
  "parcel",
  "boundary",
  "administrative",
  "census",
  "demographic",
  "land use",
  "land cover",
  "vegetation",
  "ndvi",
  "classification",
  "change detection",
];

/*======= FUNCTIONS =======*/
/*------- PUBLIC -------*/

// String normalization for fuzzy matching
export const normalize_tag = (tag: string): string => {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/ies$/, "y") // cities -> city
    .replace(/s$/, "") // Remove plural 's'
    .replace(/ing$/, "") // Remove -ing
    .replace(/ed$/, "") // Remove -ed
    .replace(/er$/, "") // Remove -er
    .replace(/ly$/, ""); // Remove -ly
};

/**
 * Clean and normalize a list of tags
 */
export function clean_tag_list(tags: string[]): string[] {
  return tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => suggest_normalized_tag(tag))
    .filter((tag, index, array) => array.indexOf(tag) === index) // Remove duplicates
    .sort();
}

/**
 * Check if a tag corresponds to a country
 */
export function is_country_tag(tag_name: string): boolean {
  if (!tag_name) {
    return false;
  }

  const normalized_tag = normalize_tag(tag_name);

  return COUNTRY_MAPPINGS.some((mapping) =>
    mapping.keywords.some(
      (keyword) => normalize_tag(keyword) === normalized_tag
    )
  );
}

/**
 * Validate if a tag is appropriate for geospatial content
 */
export function is_geospatial_tag(tag: string): boolean {
  const normalized = normalize_tag(tag);
  const categories = Object.keys(GEOSPATIAL_CATEGORIES);

  // Check if it matches any geospatial category
  for (const category of categories) {
    if (
      category.toLowerCase().includes(normalized) ||
      normalized.includes(category.toLowerCase())
    ) {
      return true;
    }
  }

  return GEOSPATIAL_KEYWORDS.some(
    (keyword) =>
      normalized.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalized)
  );
}

/**
 * Get suggestions for a given tag input
 * This helps maintain consistency across the platform
 */
export function get_tag_suggestions(input: string): string[] {
  const normalized = normalize_tag(input);
  const suggestions: string[] = [];

  // Add the normalized version if different
  const suggested = suggest_normalized_tag(input);
  if (suggested !== input) {
    suggestions.push(suggested);
  }

  // Add geospatial category suggestions
  const categories = Object.keys(GEOSPATIAL_CATEGORIES);
  for (const category of categories) {
    if (
      category.toLowerCase().includes(normalized) ||
      normalized.includes(category.toLowerCase())
    ) {
      suggestions.push(category);
    }
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

/*------- PRIVATE -------*/
/**
 * Suggest normalized tag based on input (for consistency)
 */
function suggest_normalized_tag(tag_name: string): string {
  const normalized = normalize_tag(tag_name);

  // Find if there's a better canonical form
  for (const mapping of ALL_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      if (normalize_tag(keyword) === normalized) {
        return keyword; // Return the canonical form
      }
    }
  }

  // Check categories
  for (const [category_name, category] of Object.entries(
    GEOSPATIAL_CATEGORIES
  )) {
    for (const keyword of category.keywords) {
      if (normalize_tag(keyword) === normalized) {
        return keyword; // Return the canonical form
      }
    }
  }

  return tag_name; // Return original if no better form found
}
