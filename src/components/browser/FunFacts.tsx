"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import Image from "next/image";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";
import { Lightbulb } from "lucide-react";

// CONSTANTS
const FUN_FACT: FunFact[] = [
  {
    id: 1,
    text: "The oldest known world map is a Babylonian clay tablet from the 6th century BCE, depicting Babylon and surrounding regions.",
    image: "/images/fun-facts/babylonian-map.jpg",
  },
  {
    id: 2,
    text: "The Hereford Mappa Mundi, created around 1300, is the largest surviving medieval map, measuring 1.58 × 1.34 meters and showing biblical events and over 400 cities.",
    image: "/images/fun-facts/hereford-mappa-mundi.jpg",
  },
  {
    id: 3,
    text: "The Fra Mauro map (~1450) is a 2-meter-wide circular map considered one of the most advanced pre-modern world maps. It’s south-oriented and rich in annotations.",
    image: "/images/fun-facts/fra-mauro-map.jpg",
  },
  {
    id: 4,
    text: "No flat map is accurate — all projections distort shape, area, distance, or direction due to the Earth’s curvature.",
  },
  {
    id: 5,
    text: "The AuthaGraph projection (2016) preserves proportions better than most, showing continents like Africa and Greenland more accurately.",
    image: "/images/fun-facts/authagraph-projection.jpg",
  },
  {
    id: 6,
    text: "Maps have two Norths: true north (geographic) and magnetic north, which drifts about 40 km per year and has flipped many times in Earth’s history.",
  },
  {
    id: 7,
    text: "The Mountains of Kong were an entirely fictional mountain range included on African maps for over 100 years.",
    image: "/images/fun-facts/mountains-of-kong.jpg",
  },
  {
    id: 8,
    text: "Trap streets are fake streets added by cartographers to catch map plagiarists — if you see one, the map was likely copied.",
    image: "/images/fun-facts/trap-streets.jpg",
  },
  {
    id: 9,
    text: "TIROS-1, launched in 1960, was the first successful weather satellite, marking the beginning of space-based Earth observation.",
    image: "/images/fun-facts/tiros-1.jpg",
  },
  {
    id: 10,
    text: "Landsat-1, launched in 1972, started the longest-running Earth observation mission, crucial for environmental monitoring.",
    image: "/images/fun-facts/landsat-1.jpg",
  },
  {
    id: 11,
    text: "Ptolemy’s Geographia (2nd century CE) introduced latitude and longitude grids along with an early atlas format—shaping modern mapmaking.",
    image: "/images/fun-facts/geographia.jpg",
  },
  {
    id: 12,
    text: "The Tabula Peutingeriana, a medieval copy of a Roman road map scroll (5th century original), was inscribed in UNESCO's Memory of the World in 2007.",
    image: "/images/fun-facts/peutingeriana.jpg",
  },
  {
    id: 13,
    text: "Abraham Ortelius’s Theatrum Orbis Terrarum (1570) is considered the first modern atlas—compiling maps systematically by region.",
    image: "/images/fun-facts/theatrum-orbis-terrarum.jpg",
  },
  {
    id: 14,
    text: "The Cassini Map (18th century) was the first triangulated, geodetic map of a whole country (France) and still aligns with modern satellite imagery.",
    image: "/images/fun-facts/cassini-map.jpg",
  },
  {
    id: 15,
    text: "Mercator’s projection (1569) preserved navigation directions but exaggerated size at high latitudes—making Greenland appear nearly as big as Africa.",
    image: "/images/fun-facts/mercator-projection.jpg",
  },
  {
    id: 16,
    text: "Lambert projection (1772) introduced conformal designs that preserve shape in local regions—ideal for aeronautical and geographic uses.",
    image: "/images/fun-facts/lambert-projection.jpg",
  },
  {
    id: 17,
    text: "Albers equal-area conic projection (1805) preserves area across maps, especially useful for thematic mapping like population or climate belts.",
    image: "/images/fun-facts/albers-projection.jpg",
  },
  {
    id: 18,
    text: "The Hereford Mappa Mundi from 1300 CE is the largest surviving medieval world map, measuring 5 feet by 4 feet.",
  },
  {
    id: 19,
    text: "Cartography combines art and science—balancing aesthetics with accurate spatial data representation.",
  },
  {
    id: 20,
    text: "Han‑dynasty maps (2nd century BCE) from Mawangdui scrolls were south‑oriented and used symbols and distances—an early example of measured mapping.",
    image: "/images/fun-facts/mawangdui-scrolls.jpg",
  },
  {
    id: 21,
    text: "Ptolemy underestimated Earth’s size, mapping Eurasia as spanning 180° longitude—this error encouraged Columbus to sail west to reach Asia.",
  },
  {
    id: 22,
    text: "Roger Tomlinson coined “GIS” in the mid-1960s, automating geospatial analysis that humans once did manually",
    image: "/images/fun-facts/roger-tomlinson.jpg",
  },
  {
    id: 23,
    text: "John Snow’s 1854 cholera map of London pinpointed infections and discovered the disease source—an early example of spatial epidemiology",
    image: "/images/fun-facts/john-snow.jpg",
  },
  {
    id: 24,
    text: "Satellite imagery resolution now reaches centimeter-scale, enabling precision agriculture and urban planning.",
  },
  {
    id: 25,
    text: "Remote sensing uses spectral bands outside visible light (infrared, radar), uncovering features invisible to the naked eye.",
  },
  {
    id: 26,
    text: "DEM (Digital Elevation Models) represent Earth’s surface in 3D—critical for flood modeling, terrain analysis, and flight simulation.",
    image: "/images/fun-facts/dem.jpg",
  },
  {
    id: 27,
    text: "Alaska is both the westernmost and easternmost U.S. state—its Aleutian Islands cross the 180° meridian",
    image: "/images/fun-facts/alaska.jpg",
  },
  {
    id: 28,
    text: "Maine (West Quoddy Head) is the closest U.S. mainland point to Africa, only ~3,154 miles from Morocco.",
    image: "/images/fun-facts/maine.jpg",
  },
  {
    id: 29,
    text: "Antarctica is technically the world’s largest desert, due to its extremely low annual precipitation",
  },
  {
    id: 30,
    text: "Hawaii moves closer to Alaska by ~7.5 cm/year, due to plate tectonics",
  },
  {
    id: 31,
    text: "There’s an island within a lake within an island within a lake within an island: Vulcan Point in the Philippines.",
    image: "/images/fun-facts/island-within-island.jpg",
  },
  {
    id: 32,
    text: "90 % of Earth’s population lives in the Northern Hemisphere, making the global population map highly asymmetric",
    image: "/images/fun-facts/population-map.jpg",
  },
];

/*======= INTERFACES =======*/
export interface FunFact {
  id: number;
  text: string;
  image?: string; // Optional image path
}

interface FunFactsProps {
  className?: string;
  is_active?: boolean; // Controls whether facts should rotate
  layout?: "horizontal" | "vertical"; // Layout option
}

/*======= COMPONENT =======*/
export default function FunFacts({
  className,
  is_active = true,
  layout = "horizontal",
}: FunFactsProps) {
  /*------- ATTRIBUTES -------*/
  const [current_index, set_current_index] = useState(0);
  const [fade_class, set_fade_class] = useState("opacity-100");

  /*------- METHODS -------*/
  const get_random_fact = () => {
    let new_index;
    do {
      new_index = Math.floor(Math.random() * FUN_FACT.length);
    } while (new_index === current_index && FUN_FACT.length > 1);
    return new_index;
  };

  const change_fact = () => {
    set_fade_class("opacity-0");

    setTimeout(() => {
      const new_index = get_random_fact();
      set_current_index(new_index);
      set_fade_class("opacity-100");
    }, 300); // Half of the transition duration
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!is_active) return;

    // Set initial random fact
    set_current_index(get_random_fact());

    // Set up interval to change facts every 10 seconds
    const interval = setInterval(change_fact, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [is_active]);

  /*------- RENDERER -------*/
  if (!is_active) {
    return null;
  }

  const current_fact = FUN_FACT[current_index];

  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "p-4 bg-accent/20 rounded-md border border-accent/80 min-h-40",
          className
        )}
      >
        {/* TITLE */}
        <div className="flex items-start space-x-6">
          {/* TEXT */}
          <div className="flex-1 min-w-0 flex flex-col gap-y-2">
            <h4 className="flex items-center gap-x-2 text-accent-foreground text-base font-semibold">
              <Lightbulb className="size-4" />
              Did you know ?
            </h4>

            <div
              className={cn(
                "transition-opacity duration-500 ease-in-out",
                fade_class
              )}
            >
              <p className="leading-relaxed font-medium">{current_fact.text}</p>
            </div>
          </div>

          {/* IMAGE */}
          {current_fact.image && (
            <div
              className={cn(
                "transition-opacity duration-500 ease-in-out flex-shrink-0",
                fade_class
              )}
            >
              <div className="relative size-24 md:size-32 overflow-hidden rounded-sm">
                <Image
                  src={current_fact.image}
                  alt="Fun map fact illustration"
                  fill
                  className="object-cover"
                  quality={92}
                  onError={(e) => {
                    // Hide image on error
                    e.currentTarget.style.display = "none";
                  }}
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 bg-accent/20 rounded-md border border-accent/80",
        className
      )}
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Did you know?
          </h4>
        </div>
      </div>

      <div
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          fade_class
        )}
      >
        <div className="space-y-6">
          {/* Text Content */}
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {current_fact.text}
            </p>
          </div>

          {/* Optional Image */}
          {current_fact.image && (
            <div className="w-full">
              <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                <Image
                  src={current_fact.image}
                  alt="Fun map fact illustration"
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                  quality={95}
                  priority
                  onError={(e) => {
                    // Hide image on error
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
