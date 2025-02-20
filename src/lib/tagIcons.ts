import * as CountryFlags from 'country-flag-icons/react/3x2';
import { 
  faMap, faGlobe, faChartLine, faLayerGroup, faMountain, 
  faWater, faTree, faCity, faRoad, faBuilding, faSatellite,
  faLocationDot, faCompass, faEarthAmericas, faMapLocation,
  faDatabase, faFileImage, faVectorSquare, faTag,
  faTemperature0, faWind, faCloudRain, faSnowflake,
  faIndustry, faHospital, faSchool, faShoppingCart,
  faWarehouse, faPlane, faCar, faTrain, faShip, faTractor,
  faVolcano, faEarthOceania, faEarthAfrica, 
  faEarthAsia, faEarthEurope, faFire, faPizzaSlice,
  faBoltLightning
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Interface for country icon mapping - uses component type
type CountryIcon = typeof CountryFlags[keyof typeof CountryFlags];

// Interface for our mapping
interface TagMapping {
  keywords: string[];
  icon: IconDefinition | string; // string for country codes
  isCountry?: boolean;
}

// Countries mapping - dynamically build from country-flag-icons
const countryMappings: { [key: string]: TagMapping } = {};

// Helper for extracting country name from country code
const getCountryName = (code: string): string => {
  const countryNames: { [code: string]: string } = {
    US: 'United States,USA,America,American',
    GB: 'United Kingdom,UK,Britain,British,England,Scotland,Wales',
    FR: 'France,French',
    DE: 'Germany,German',
    ES: 'Spain,Spanish',
    IT: 'Italy,Italian',
    JP: 'Japan,Japanese',
    CN: 'China,Chinese',
    IN: 'India,Indian',
    BR: 'Brazil,Brazilian',
    CA: 'Canada,Canadian',
    AU: 'Australia,Australian',
    RU: 'Russia,Russian',
    MX: 'Mexico,Mexican',
    // Add more mappings as needed
  };
  
  return countryNames[code] || code;
};

// Build country mappings
Object.keys(CountryFlags).forEach(countryCode => {
  if (countryCode.length === 2) {
    const countryNames = getCountryName(countryCode).split(',');
    
    countryMappings[countryCode.toLowerCase()] = {
      keywords: countryNames,
      icon: countryCode, // Just store the country code instead of the component
      isCountry: true
    };
  }
});

// GIS/Mapping specific terms
const gisMappings: { [key: string]: TagMapping } = {
  // Map types
  raster: {
    keywords: ['raster', 'grid', 'pixel', 'bitmap', 'dem', 'digital elevation model'],
    icon: faFileImage
  },
  vector: {
    keywords: ['vector', 'point', 'line', 'polygon', 'shapefile', 'feature'],
    icon: faVectorSquare
  },
  
  // Geographical features
  mountain: {
    keywords: ['mountain', 'hill', 'peak', 'highland', 'elevation', 'terrain', 'topography'],
    icon: faMountain
  },
  water: {
    keywords: ['water', 'lake', 'ocean', 'sea', 'river', 'stream', 'hydrology', 'blue'],
    icon: faWater
  },
  forest: {
    keywords: ['forest', 'tree', 'wood', 'vegetation', 'green', 'jungle', 'forestation'],
    icon: faTree
  },
  city: {
    keywords: ['city', 'urban', 'town', 'settlement', 'building', 'metropolitan'],
    icon: faCity
  },
  road: {
    keywords: ['road', 'highway', 'street', 'transportation', 'route', 'path', 'trail'],
    icon: faRoad
  },
  
  // Continents and regions
  europe: {
    keywords: ['europe', 'european', 'eu'],
    icon: faEarthEurope
  },
  asia: {
    keywords: ['asia', 'asian'],
    icon: faEarthAsia
  },
  africa: {
    keywords: ['africa', 'african'],
    icon: faEarthAfrica
  },
  oceania: {
    keywords: ['oceania', 'australia', 'pacific', 'australasia'],
    icon: faEarthOceania
  },
  america: {
    keywords: ['america', 'americas', 'north america', 'south america', 'western hemisphere'],
    icon: faEarthAmericas
  },
  
  // Map elements
  satellite: {
    keywords: ['satellite', 'aerial', 'imagery', 'remote sensing', 'earth observation'],
    icon: faSatellite
  },
  globe: {
    keywords: ['globe', 'world', 'planet', 'earth'],
    icon: faGlobe
  },
  location: {
    keywords: ['location', 'place', 'pin', 'point', 'spot', 'position', 'site'],
    icon: faLocationDot
  },
  
  // Climate/Weather
  temperature: {
    keywords: ['temperature', 'heat', 'climate', 'thermal', 'hot', 'cold'],
    icon: faTemperature0
  },
  wind: {
    keywords: ['wind', 'breeze', 'gust', 'airflow', 'hurricane', 'tornado'],
    icon: faWind
  },
  rain: {
    keywords: ['rain', 'precipitation', 'rainfall', 'shower', 'downpour', 'drizzle'],
    icon: faCloudRain
  },
  snow: {
    keywords: ['snow', 'ice', 'winter', 'frost', 'freezing', 'glacier'],
    icon: faSnowflake
  },
  
  // General infrastructure
  industry: {
    keywords: ['industry', 'industrial', 'factory', 'manufacturing', 'production'],
    icon: faIndustry
  },
  healthcare: {
    keywords: ['healthcare', 'hospital', 'medical', 'clinic', 'health'],
    icon: faHospital
  },
  education: {
    keywords: ['education', 'school', 'university', 'college', 'academic', 'learning'],
    icon: faSchool
  },
  retail: {
    keywords: ['retail', 'shop', 'store', 'shopping', 'market', 'commerce'],
    icon: faShoppingCart
  },
  warehouse: {
    keywords: ['warehouse', 'storage', 'logistics', 'stockroom', 'distribution'],
    icon: faWarehouse
  },
  
  // Transportation
  aviation: {
    keywords: ['aviation', 'airplane', 'airport', 'aircraft', 'plane', 'flight'],
    icon: faPlane
  },
  automotive: {
    keywords: ['automotive', 'car', 'vehicle', 'auto', 'traffic', 'driving'],
    icon: faCar
  },
  rail: {
    keywords: ['rail', 'railway', 'train', 'track', 'transit', 'subway', 'metro'],
    icon: faTrain
  },
  marine: {
    keywords: ['marine', 'ship', 'boat', 'vessel', 'maritime', 'naval', 'navy'],
    icon: faShip
  },
  agriculture: {
    keywords: ['agriculture', 'farming', 'farm', 'field', 'crop', 'livestock', 'ranch'],
    icon: faTractor
  },
  
  // Miscellaneous
  volcano: {
    keywords: ['volcano', 'eruption', 'lava', 'magma', 'crater', 'geothermal'],
    icon: faVolcano
  },
  fire: {
    keywords: ['fire', 'flame', 'wildfire', 'burning', 'heat', 'blaze'],
    icon: faFire
  },
  food: {
    keywords: ['food', 'restaurant', 'cuisine', 'meal', 'nutrition', 'eating'],
    icon: faPizzaSlice
  },
  
  // Defaults
  map: {
    keywords: ['map', 'cartography', 'chart', 'atlas', 'navigation', 'reference'],
    icon: faMap
  },
  database: {
    keywords: ['database', 'data', 'collection', 'repository', 'stats', 'statistics'],
    icon: faDatabase
  },
  analytics: {
    keywords: ['analytics', 'analysis', 'data science', 'visualization', 'stat', 'visualize'],
    icon: faChartLine
  },
  
  // New specific mappings
  hedges: {
    keywords: ['hedge', 'hedges', 'bush', 'shrub', 'barrier'],
    icon: faTree
  },
  lightning: {
    keywords: ['lightning', 'thunder', 'bolt', 'strike', 'electric'],
    icon: faBoltLightning
  },
};

// Combine all mappings
const allMappings = {
  ...countryMappings,
  ...gisMappings
};

// Default icon to use when no match is found
const defaultIcon = faTag;

/**
 * Gets the most appropriate icon for a given tag
 * Uses fuzzy matching to find the best icon
 */
export function getIconForTag(tagName: string): IconDefinition | string {
  if (!tagName) return defaultIcon;
  
  const normalizedTag = tagName.toLowerCase().trim();
  
  // Check for exact matches first
  if (gisMappings[normalizedTag]) {
    return gisMappings[normalizedTag].icon;
  }
  
  // Check for country matches separately
  if (countryMappings[normalizedTag]) {
    return countryMappings[normalizedTag].icon;
  }
  
  // For non-exact matches, first check GIS tags
  for (const key in gisMappings) {
    const mapping = gisMappings[key];
    const keywords = mapping.keywords;
    
    // Check if any keyword exactly matches our tag
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (normalizedTag === normalizedKeyword) {
        return mapping.icon;
      }
    }
  }
  
  // Next do a second pass for partial GIS tag matches
  for (const key in gisMappings) {
    const mapping = gisMappings[key];
    const keywords = mapping.keywords;
    
    // Now check for contains matches
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      // Prefer tag CONTAINS keyword (e.g., "big tree" contains "tree")
      if (normalizedTag.includes(normalizedKeyword)) {
        return mapping.icon;
      }
    }
  }
  
  // ONLY after checking all GIS mappings with no match,
  // check for partial country matches
  for (const key in countryMappings) {
    const mapping = countryMappings[key];
    const keywords = mapping.keywords;
    
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (normalizedTag === normalizedKeyword) {
        return mapping.icon;
      }
    }
  }
  
  // No match found
  return defaultIcon;
}

/**
 * Checks if a tag corresponds to a country
 */
export function isCountryTag(tagName: string): boolean {
  if (!tagName) return false;
  
  const normalizedTag = tagName.toLowerCase().trim();
  
  // Direct match for country code or exact country name
  if (countryMappings[normalizedTag]) {
    return true;
  }
  
  // Check for exact match in country keywords
  for (const key in countryMappings) {
    const mapping = countryMappings[key];
    for (const keyword of mapping.keywords) {
      if (normalizedTag === keyword.toLowerCase().trim()) {
        return true;
      }
    }
  }
  
  return false;
}

export default {
  getIconForTag,
  isCountryTag,
  defaultIcon
}; 