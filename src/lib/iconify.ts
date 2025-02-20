// LIBRARIES
import type { IconifyIcon } from "@iconify/types";
import {
  Mountain,
  Waves,
  Building,
  Plane,
  MapPin,
  Globe,
  Layers,
  Satellite,
  Thermometer,
  Users,
  Factory,
  Zap,
  Database,
  BarChart3,
  Tag as TagIcon,
  TreePine,
  Building2,
  Car as RoadIcon,
  Train,
  Ship,
  Compass,
  Camera,
  Cloudy,
  Activity,
  Home,
  School,
  Hospital,
  ShoppingBag,
  Tractor,
  Radio,
  Route,
  Navigation,
} from "lucide-react";

// Countries
import us_icon from "@iconify-icons/twemoji/flag-united-states";
import uk_icon from "@iconify-icons/twemoji/flag-united-kingdom";
import fr_icon from "@iconify-icons/twemoji/flag-france";
import de_icon from "@iconify-icons/twemoji/flag-germany";
import es_icon from "@iconify-icons/twemoji/flag-spain";
import it_icon from "@iconify-icons/twemoji/flag-italy";
import jp_icon from "@iconify-icons/twemoji/flag-japan";
import cn_icon from "@iconify-icons/twemoji/flag-china";
import br_icon from "@iconify-icons/twemoji/flag-brazil";
import ca_icon from "@iconify-icons/twemoji/flag-canada";
import au_icon from "@iconify-icons/twemoji/flag-australia";
import in_icon from "@iconify-icons/twemoji/flag-india";
import ru_icon from "@iconify-icons/twemoji/flag-russia";
import mx_icon from "@iconify-icons/twemoji/flag-mexico";

// Nature
import tree_icon from "@iconify-icons/emojione/deciduous-tree";
import mountain_icon from "@iconify-icons/emojione/mountain";
import water_icon from "@iconify-icons/noto/water-wave";
import forest_icon from "@iconify-icons/noto/national-park";
import fire_icon from "@iconify-icons/twemoji/fire";
import cloud_icon from "@iconify-icons/emojione/cloud";
import sun_icon from "@iconify-icons/twemoji/sun";
import snow_icon from "@iconify-icons/twemoji/snowflake";

// UTILS
import { normalize_tag } from "@/utils/tags.utils";

/*======= TYPES =======*/
export type LucideIcon = typeof Mountain;
export type IconType = LucideIcon | IconifyIcon;

/*======= INTERFACES =======*/
export interface TagMapping {
  keywords: string[];
  icon: IconType;
  is_colorful?: boolean;
}

export interface GeospatialCategory {
  icon: LucideIcon;
  keywords: string[];
  priority: number; // Higher number = higher priority
}

/*======= CONSTANTS =======*/

export const DEFAULT_ICON = TagIcon;

// Country flag mappings (colorful iconify icons)
export const COUNTRY_MAPPINGS: TagMapping[] = [
  {
    keywords: ["usa", "us", "america", "united states", "american"],
    icon: us_icon,
    is_colorful: true,
  },
  {
    keywords: [
      "uk",
      "united kingdom",
      "england",
      "britain",
      "great britain",
      "british",
      "english",
    ],
    icon: uk_icon,
    is_colorful: true,
  },
  {
    keywords: ["france", "fr", "french"],
    icon: fr_icon,
    is_colorful: true,
  },
  {
    keywords: ["germany", "de", "deutschland", "german"],
    icon: de_icon,
    is_colorful: true,
  },
  {
    keywords: ["spain", "es", "españa", "spanish"],
    icon: es_icon,
    is_colorful: true,
  },
  {
    keywords: ["italy", "it", "italia", "italian"],
    icon: it_icon,
    is_colorful: true,
  },
  {
    keywords: ["japan", "jp", "nippon", "japanese"],
    icon: jp_icon,
    is_colorful: true,
  },
  {
    keywords: ["china", "cn", "prc", "chinese"],
    icon: cn_icon,
    is_colorful: true,
  },
  {
    keywords: ["brazil", "br", "brasil", "brazilian"],
    icon: br_icon,
    is_colorful: true,
  },
  {
    keywords: ["canada", "ca", "canadian"],
    icon: ca_icon,
    is_colorful: true,
  },
  {
    keywords: ["australia", "au", "australian", "aussie"],
    icon: au_icon,
    is_colorful: true,
  },
  {
    keywords: ["india", "in", "indian"],
    icon: in_icon,
    is_colorful: true,
  },
  {
    keywords: ["russia", "ru", "russian"],
    icon: ru_icon,
    is_colorful: true,
  },
  {
    keywords: ["mexico", "mx", "mexican"],
    icon: mx_icon,
    is_colorful: true,
  },
];

// High-priority exact matches (colorful nature icons)
export const NATURE_MAPPINGS: TagMapping[] = [
  {
    keywords: ["tree", "forest", "woodland", "jungle"],
    icon: tree_icon,
    is_colorful: true,
  },
  {
    keywords: ["mountain", "peak", "summit", "hill"],
    icon: mountain_icon,
    is_colorful: true,
  },
  {
    keywords: ["water", "ocean", "sea", "lake", "river"],
    icon: water_icon,
    is_colorful: true,
  },
  {
    keywords: ["national park", "park", "reserve", "conservation"],
    icon: forest_icon,
    is_colorful: true,
  },
  {
    keywords: ["fire", "wildfire", "burn", "flame"],
    icon: fire_icon,
    is_colorful: true,
  },
  {
    keywords: ["cloud", "weather", "meteorology"],
    icon: cloud_icon,
    is_colorful: true,
  },
  {
    keywords: ["sun", "solar", "sunshine"],
    icon: sun_icon,
    is_colorful: true,
  },
  {
    keywords: ["snow", "ice", "glacier", "winter"],
    icon: snow_icon,
    is_colorful: true,
  },
];

// Geospatial category mappings (using Lucide icons)
export const GEOSPATIAL_CATEGORIES: { [key: string]: GeospatialCategory } = {
  // Physical Geography & Natural Features
  terrain: {
    icon: Mountain,
    keywords: [
      "terrain",
      "topography",
      "elevation",
      "dem",
      "relief",
      "slope",
      "aspect",
      "contour",
      "altitude",
    ],
    priority: 9,
  },
  hydrology: {
    icon: Waves,
    keywords: [
      "hydrology",
      "watershed",
      "basin",
      "stream",
      "tributary",
      "wetland",
      "aquifer",
      "groundwater",
      "drainage",
    ],
    priority: 9,
  },
  vegetation: {
    icon: TreePine,
    keywords: [
      "vegetation",
      "flora",
      "canopy",
      "biomass",
      "ndvi",
      "land cover",
      "habitat",
      "ecosystem",
      "biodiversity",
    ],
    priority: 8,
  },

  // Administrative & Political
  administrative: {
    icon: Globe,
    keywords: [
      "administrative",
      "boundary",
      "border",
      "jurisdiction",
      "county",
      "state",
      "province",
      "district",
      "ward",
      "precinct",
    ],
    priority: 8,
  },
  urban: {
    icon: Building2,
    keywords: [
      "urban",
      "city",
      "town",
      "metropolitan",
      "municipal",
      "downtown",
      "suburb",
      "residential",
      "commercial",
    ],
    priority: 8,
  },

  // Infrastructure & Transportation
  transport: {
    icon: Route,
    keywords: [
      "transport",
      "transportation",
      "traffic",
      "mobility",
      "transit",
      "corridor",
      "network",
      "accessibility",
    ],
    priority: 7,
  },
  roads: {
    icon: RoadIcon,
    keywords: [
      "road",
      "highway",
      "street",
      "avenue",
      "boulevard",
      "freeway",
      "motorway",
      "path",
      "trail",
      "route",
    ],
    priority: 8,
  },
  rail: {
    icon: Train,
    keywords: [
      "rail",
      "railway",
      "railroad",
      "train",
      "metro",
      "subway",
      "tram",
      "track",
      "station",
    ],
    priority: 7,
  },
  aviation: {
    icon: Plane,
    keywords: [
      "aviation",
      "airport",
      "aircraft",
      "flight",
      "runway",
      "airfield",
      "aerospace",
    ],
    priority: 7,
  },
  marine: {
    icon: Ship,
    keywords: [
      "marine",
      "maritime",
      "naval",
      "port",
      "harbor",
      "shipping",
      "vessel",
      "boat",
      "navigation",
    ],
    priority: 7,
  },

  // Geospatial Data Types
  raster: {
    icon: Layers,
    keywords: [
      "raster",
      "grid",
      "pixel",
      "image",
      "satellite",
      "aerial",
      "landsat",
      "sentinel",
      "modis",
    ],
    priority: 9,
  },
  vector: {
    icon: MapPin,
    keywords: [
      "vector",
      "point",
      "line",
      "polygon",
      "feature",
      "shapefile",
      "geojson",
      "geometry",
    ],
    priority: 9,
  },
  remote_sensing: {
    icon: Satellite,
    keywords: [
      "remote sensing",
      "earth observation",
      "imagery",
      "spectral",
      "multispectral",
      "hyperspectral",
      "radar",
      "lidar",
    ],
    priority: 8,
  },

  // Climate & Environment
  climate: {
    icon: Thermometer,
    keywords: [
      "climate",
      "temperature",
      "precipitation",
      "humidity",
      "pressure",
      "meteorological",
      "atmospheric",
    ],
    priority: 7,
  },
  weather: {
    icon: Cloudy,
    keywords: [
      "weather",
      "forecast",
      "storm",
      "cyclone",
      "hurricane",
      "tornado",
      "wind",
      "rain",
    ],
    priority: 7,
  },
  environmental: {
    icon: Activity,
    keywords: [
      "environmental",
      "pollution",
      "contamination",
      "air quality",
      "water quality",
      "emissions",
      "monitoring",
    ],
    priority: 7,
  },

  // Socioeconomic & Demographics
  population: {
    icon: Users,
    keywords: [
      "population",
      "demographic",
      "census",
      "density",
      "migration",
      "settlement",
      "household",
      "community",
    ],
    priority: 7,
  },
  economic: {
    icon: BarChart3,
    keywords: [
      "economic",
      "economy",
      "gdp",
      "income",
      "employment",
      "business",
      "commerce",
      "trade",
      "market",
    ],
    priority: 6,
  },
  agriculture: {
    icon: Tractor,
    keywords: [
      "agriculture",
      "farming",
      "crop",
      "livestock",
      "rural",
      "agricultural",
      "field",
      "pasture",
      "irrigation",
    ],
    priority: 7,
  },

  // Utilities & Services
  utilities: {
    icon: Zap,
    keywords: [
      "utilities",
      "electricity",
      "power",
      "energy",
      "grid",
      "transmission",
      "distribution",
      "renewable",
    ],
    priority: 6,
  },
  telecommunications: {
    icon: Radio,
    keywords: [
      "telecommunications",
      "telecom",
      "cellular",
      "broadband",
      "internet",
      "wireless",
      "coverage",
      "signal",
    ],
    priority: 6,
  },

  // Built Environment
  building: {
    icon: Building,
    keywords: [
      "building",
      "structure",
      "construction",
      "architecture",
      "facility",
      "complex",
      "development",
    ],
    priority: 7,
  },
  residential: {
    icon: Home,
    keywords: [
      "residential",
      "housing",
      "home",
      "neighborhood",
      "subdivision",
      "apartment",
      "dwelling",
    ],
    priority: 6,
  },
  education: {
    icon: School,
    keywords: [
      "education",
      "school",
      "university",
      "college",
      "campus",
      "academic",
      "educational",
    ],
    priority: 6,
  },
  healthcare: {
    icon: Hospital,
    keywords: [
      "healthcare",
      "health",
      "hospital",
      "medical",
      "clinic",
      "emergency",
      "public health",
    ],
    priority: 6,
  },
  retail: {
    icon: ShoppingBag,
    keywords: [
      "retail",
      "shopping",
      "commercial",
      "store",
      "market",
      "mall",
      "business",
    ],
    priority: 6,
  },
  industrial: {
    icon: Factory,
    keywords: [
      "industrial",
      "industry",
      "manufacturing",
      "factory",
      "production",
      "warehouse",
      "logistics",
    ],
    priority: 6,
  },

  // Navigation & Positioning
  navigation: {
    icon: Navigation,
    keywords: [
      "navigation",
      "gps",
      "positioning",
      "coordinate",
      "geocoding",
      "wayfinding",
    ],
    priority: 7,
  },
  cartography: {
    icon: Compass,
    keywords: [
      "cartography",
      "cartographic",
      "mapping",
      "projection",
      "coordinate system",
      "datum",
      "scale",
    ],
    priority: 7,
  },

  // Data & Analysis
  database: {
    icon: Database,
    keywords: [
      "database",
      "data",
      "dataset",
      "collection",
      "repository",
      "archive",
      "catalog",
    ],
    priority: 6,
  },
  analysis: {
    icon: BarChart3,
    keywords: [
      "analysis",
      "analytics",
      "statistical",
      "modeling",
      "simulation",
      "geostatistics",
      "spatial analysis",
    ],
    priority: 6,
  },
  visualization: {
    icon: Camera,
    keywords: [
      "visualization",
      "mapping",
      "cartography",
      "display",
      "representation",
      "symbology",
    ],
    priority: 6,
  },
};

export const ALL_MAPPINGS = [...COUNTRY_MAPPINGS, ...NATURE_MAPPINGS];

/*======= FUNCTIONS =======*/

/**
 * Find the best matching geospatial category for a normalized tag
 */
const find_category_match = (
  normalized_tag: string
): GeospatialCategory | null => {
  let best_match: GeospatialCategory | null = null;
  let highest_priority = 0;

  for (const category of Object.values(GEOSPATIAL_CATEGORIES)) {
    for (const keyword of category.keywords) {
      const normalized_keyword = normalize_tag(keyword);

      // Check for exact match or partial match
      if (
        normalized_tag === normalized_keyword ||
        normalized_tag.includes(normalized_keyword) ||
        normalized_keyword.includes(normalized_tag)
      ) {
        if (category.priority > highest_priority) {
          best_match = category;
          highest_priority = category.priority;
        }
      }
    }
  }

  return best_match;
};

/**
 * Get the appropriate icon for a tag using three-tier matching
 *
 * @param tag_name - The tag to find an icon for
 * @returns Object with icon and whether it's colorful
 */
export function get_tag_icon(tag_name: string): {
  icon: IconType;
  is_colorful: boolean;
} {
  if (!tag_name) {
    return { icon: DEFAULT_ICON, is_colorful: false };
  }

  const normalized_tag = normalize_tag(tag_name);

  // Tier 1: Exact match (high priority colorful icons and countries)
  const exact_match = ALL_MAPPINGS.find((mapping) =>
    mapping.keywords.some(
      (keyword) => normalize_tag(keyword) === normalized_tag
    )
  );

  if (exact_match) {
    return {
      icon: exact_match.icon,
      is_colorful: exact_match.is_colorful || false,
    };
  }

  // Tier 2: Category match (geospatial categories with Lucide icons)
  const category_match = find_category_match(normalized_tag);
  if (category_match) {
    return { icon: category_match.icon, is_colorful: false };
  }

  // Tier 3: Default fallback
  return { icon: DEFAULT_ICON, is_colorful: false };
}

export default {
  COUNTRY_MAPPINGS,
  NATURE_MAPPINGS,
  GEOSPATIAL_CATEGORIES,
  get_tag_icon,
};
