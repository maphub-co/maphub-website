"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import colormap from "colormap";
import { HexColorPicker } from "react-colorful";
import { useShallow } from "zustand/react/shallow";
import { Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";

// Get all available colormaps from the package
const COLORMAP_PRESETS = [
  // Basic colormaps
  "jet",
  "hsv",
  "hot",
  "cool",
  "spring",
  "summer",
  "autumn",
  "winter",
  "bone",
  "copper",
  "greys",
  "rainbow",

  // Perceptually uniform colormaps
  "viridis",
  "inferno",
  "magma",
  "plasma",

  // Scientific colormap
  "cubehelix",
].map((name) => ({
  name,
  colors: colormap({
    colormap: name,
    nshades: 20,
    format: "hex",
    alpha: 1,
  }),
}));

// Helper function to convert hex to rgba
function hexToRgba(hex: string): [number, number, number, number] {
  // Remove the # if present
  hex = hex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b, 255];
}

// Helper function to convert rgba to hex
function rgbaToHex(rgba: [number, number, number, number]): string {
  const [r, g, b] = rgba;
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper function to generate intervals
function generateIntervals(min: number, max: number, steps: number): number[] {
  const step = (max - min) / steps;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const value = min + step * i;
    return Number(value.toFixed(3));
  });
}

// Helper function to get minimum steps required by colormap
function get_colormap_min_nshades(colormap_name: string): number {
  try {
    // Try create a colormap with 1 steps to trigger an error
    colormap({
      colormap: colormap_name,
      nshades: 1,
      format: "hex",
      alpha: 1,
    });

    return 1; // If no error, this is the minimum required steps
  } catch (error) {
    if (error instanceof Error && error.message.includes("nshades")) {
      const match = error.message.match(/nshades to be at least size (\d+)/);
      if (match) {
        return parseInt(match[1]); // Return the minimum steps from error message
      }
    }

    return 1;
  }
}

// Helper function to generate custom colormap format
function generateCustomColormap(
  selectedPreset: string,
  min: number,
  max: number,
  steps: number,
  on_error: (error: string) => void
): string {
  if (!selectedPreset) return "[]";

  const preset = COLORMAP_PRESETS.find((p) => p.name === selectedPreset);
  if (!preset) return "[]";

  const min_nshades = get_colormap_min_nshades(selectedPreset);
  if (steps < min_nshades) {
    on_error(`Minimum steps required is ${min_nshades}`);
    return "[]";
  }

  const intervals = generateIntervals(min, max, steps);
  const colors = colormap({
    colormap: selectedPreset,
    nshades: steps,
    format: "hex",
    alpha: 1,
  });

  const customFormat = intervals.slice(0, -1).map((start, i) => {
    const end = intervals[i + 1];
    const rgba = hexToRgba(colors[i]);
    return [[start, end], rgba];
  });

  return JSON.stringify(customFormat, null, 2);
}

// Helper function to interpolate between two colors
function interpolateColors(
  color1: string,
  color2: string,
  steps: number
): string[] {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    colors.push(
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`
    );
  }

  return colors;
}

interface CategoryEntry {
  min: string;
  max: string;
  label: string;
  color: string;
}

export default function ColormapEditor({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const [loading_map, map_type, map_visuals, update_visuals, meta_data] =
    useMapStore(
      useShallow((state) => [
        state.is_loading,
        state.map?.type,
        state.map?.visuals,
        state.update_visuals,
        state.meta_data,
      ])
    );
  const [is_loading, set_loading] = useState<boolean>(false);
  const [error, set_error] = useState<string | null>(null);
  const [styleType, setStyleType] = useState<string>("library");
  const [minValue, setMinValue] = useState<string>(
    meta_data?.min?.toString() || "0"
  );
  const [maxValue, setMaxValue] = useState<string>(
    meta_data?.max?.toString() || "1"
  );
  const [steps, setSteps] = useState<number>(10);
  const [min_steps, set_min_steps] = useState<number>(2);

  // Library state variables
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Gradient state variables
  const [startColor, setStartColor] = useState<string>("#ff0000");
  const [endColor, setEndColor] = useState<string>("#0000ff");
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  // Category state variables
  const [categoryEntries, setCategoryEntries] = useState<CategoryEntry[]>([]);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);

  /*------- METHODS -------*/
  const addCategoryEntry = () => {
    setCategoryEntries([
      ...categoryEntries,
      { min: "0", max: "1", label: "", color: "#000000" },
    ]);
  };

  const removeCategoryEntry = (index: number) => {
    setCategoryEntries(categoryEntries.filter((_, i) => i !== index));
  };

  const updateCategoryEntry = (
    index: number,
    field: keyof CategoryEntry,
    value: string
  ) => {
    const newEntries = [...categoryEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setCategoryEntries(newEntries);
  };

  const generateCategoryColormap = () => {
    const colormap = categoryEntries.map((entry) => {
      const rgba = hexToRgba(entry.color);
      return [[parseFloat(entry.min), parseFloat(entry.max)], rgba];
    });

    const legend = categoryEntries.reduce((acc, entry, index) => {
      acc[entry.min] = entry.label;
      return acc;
    }, {} as Record<string, string>);

    return {
      colormap,
      type_colormap: "category",
      legend,
    };
  };

  // Check if map has QGIS styling
  const has_qgis_style = () => {
    return map_visuals?.qgis && map_visuals.qgis.trim().length > 0;
  };

  // Handle apply button click - now checks for QGIS conflict first
  const handle_apply_colormap = async () => {
    try {
      if (
        has_qgis_style() &&
        !window.confirm(
          "This map already has QGIS styling. Do you want to overwrite it's visualisation on MapHub ?"
        )
      ) {
        return;
      }

      // Add validation for library mode
      if (styleType === "library" && !selectedPreset) {
        set_error("Please select a colormap preset");
        return;
      }

      // Add validation for category mode
      if (styleType === "category" && categoryEntries.length === 0) {
        set_error("Please add at least one category");
        return;
      }

      set_error(null);

      let visuals: any = {};

      if (styleType === "library") {
        // For library mode - generate the custom format from the preset
        const min = parseFloat(minValue);
        const max = parseFloat(maxValue);

        // Generate the colormap in the required format
        set_error(null);
        const customFormat = generateCustomColormap(
          selectedPreset,
          min,
          max,
          steps,
          (error: string) => {
            set_error(error);
          }
        );

        visuals = {
          colormap_name: selectedPreset,
          colormap: JSON.parse(customFormat),
          type_colormap: "library",
        };
      } else if (styleType === "gradient") {
        // For gradient mode - generate from two colors
        const min = parseFloat(minValue);
        const max = parseFloat(maxValue);
        const colors = interpolateColors(startColor, endColor, steps);

        const intervals = generateIntervals(min, max, steps);
        const customFormat = intervals.slice(0, -1).map((start, i) => {
          const end = intervals[i + 1];
          const rgba = hexToRgba(colors[i]);
          return [[start, end], rgba];
        });

        visuals = {
          colormap: customFormat,
          type_colormap: "gradient",
        };
      } else if (styleType === "category") {
        // For category mode - use the generated category colormap
        visuals = generateCategoryColormap();
      }

      set_loading(true);

      try {
        await update_visuals(visuals);
      } finally {
        set_loading(false);
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to update colormap";

      set_error(errorMessage);
    }
  };

  /*------- HOOKS -------*/
  // Initialize category entries from existing colormap if it's a category type
  useEffect(() => {
    if (!map_visuals) return;

    // LEGACY
    if (
      typeof map_visuals?.colormap === "string" &&
      COLORMAP_PRESETS.some((preset) => preset.name === map_visuals?.colormap)
    ) {
      setSelectedPreset(map_visuals?.colormap);
    }

    // LIBRARY
    if (
      map_visuals?.type_colormap === "library" &&
      map_visuals?.colormap_name
    ) {
      setSelectedPreset(map_visuals.colormap_name);
      setStyleType("library");
      set_min_steps(get_colormap_min_nshades(map_visuals?.colormap_name || 1));
    }

    if (map_visuals?.type_colormap === "gradient") {
      setStyleType("gradient");
      setStartColor(rgbaToHex(map_visuals.colormap[0][1]));
      setEndColor(
        rgbaToHex(map_visuals.colormap[map_visuals.colormap.length - 1][1])
      );
      set_min_steps(2);
    }

    if (
      map_visuals?.type_colormap === "category" &&
      map_visuals?.colormap &&
      map_visuals?.legend
    ) {
      const entries: CategoryEntry[] = [];
      map_visuals.colormap.forEach((entry: any, index: number) => {
        const [range, color] = entry;
        const value = Object.keys(map_visuals.legend)[index];
        entries.push({
          min: range[0].toString(),
          max: range[1].toString(),
          label: map_visuals.legend[value],
          color: rgbaToHex(color as [number, number, number, number]),
        });
      });

      setStyleType("category");
      setCategoryEntries(entries);
    }
  }, [map_visuals]);

  // Sync category changes to custom mode
  useEffect(() => {
    if (styleType === "category" && categoryEntries.length > 0) {
      const visuals = generateCategoryColormap();
    }

    if (
      map_visuals?.type_colormap === "category" &&
      map_visuals?.colormap &&
      map_visuals?.legend
    ) {
      const entries: CategoryEntry[] = [];
      map_visuals.colormap.forEach((entry: any, index: number) => {
        const [range, color] = entry;
        const value = Object.keys(map_visuals.legend)[index];
        entries.push({
          min: range[0].toString(),
          max: range[1].toString(),
          label: map_visuals.legend[value],
          color: rgbaToHex(color as [number, number, number, number]),
        });
      });

      setStyleType("category");
      setCategoryEntries(entries);
    }
  }, [map_visuals]);

  /*------- RENDERER -------*/
  if (loading_map || map_type?.toLowerCase() !== "raster") return <></>;

  return (
    <Card className={className}>
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">Colormap Editor</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <Label htmlFor="style-type">Style Type</Label>
          <Select
            value={styleType}
            onValueChange={(value) => {
              setStyleType(value);
            }}
          >
            <SelectTrigger id="style-type">
              <SelectValue placeholder="Choose a style type" />
            </SelectTrigger>
            <SelectContent className="z-100">
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {styleType === "library" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="colormap-preset">Select Colormap</Label>
              <Select
                value={selectedPreset}
                onValueChange={(value) => {
                  setSelectedPreset(value);
                  set_min_steps(get_colormap_min_nshades(value));
                }}
              >
                <SelectTrigger id="colormap-preset">
                  <SelectValue placeholder="Choose a colormap" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] z-100">
                  {COLORMAP_PRESETS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      <div className="flex items-center">
                        <div className="w-16 h-4 mr-2 rounded overflow-hidden flex">
                          {preset.colors.map((color, i) => (
                            <div
                              key={i}
                              style={{ backgroundColor: color }}
                              className="flex-1 h-full"
                            />
                          ))}
                        </div>
                        <span>{preset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview Section */}
            {selectedPreset && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 h-8 rounded overflow-hidden flex">
                  {COLORMAP_PRESETS.find(
                    (p) => p.name === selectedPreset
                  )?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color }}
                      className="flex-1 h-full"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-value">Min Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max-value">Max Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <Label
                  className="text-xs text-muted-foreground"
                  htmlFor="steps"
                >
                  Steps ({min_steps}-50)
                </Label>
                <span className="text-xs text-muted-foreground">{steps}</span>
              </div>
              <div className="pt-2">
                <Slider
                  id="steps"
                  min={min_steps}
                  max={20}
                  step={1}
                  value={[steps]}
                  onValueChange={(value) => setSteps(value[0])}
                />
              </div>
            </div>
          </div>
        )}

        {/* Gradient Style */}
        {styleType === "gradient" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Color</Label>
                <div>
                  <div
                    className="w-full h-10 rounded-md cursor-pointer border mb-2"
                    style={{ backgroundColor: startColor }}
                    onClick={() => setShowStartPicker(!showStartPicker)}
                  />
                  {showStartPicker && (
                    <div className="border rounded-md p-2 bg-background-primary shadow-md">
                      <HexColorPicker
                        color={startColor}
                        onChange={setStartColor}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label>End Color</Label>
                <div>
                  <div
                    className="w-full h-10 rounded-md cursor-pointer border mb-2"
                    style={{ backgroundColor: endColor }}
                    onClick={() => setShowEndPicker(!showEndPicker)}
                  />
                  {showEndPicker && (
                    <div className="border rounded-md p-2 bg-background-primary shadow-md">
                      <HexColorPicker
                        color={endColor}
                        onChange={setEndColor}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 h-8 rounded overflow-hidden flex">
                {interpolateColors(startColor, endColor, steps).map(
                  (color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color }}
                      className="flex-1 h-full"
                    />
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-value">Min Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max-value">Max Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <Label
                  className="text-xs text-muted-foreground"
                  htmlFor="steps"
                >
                  Steps (2-50)
                </Label>
                <span className="text-xs text-muted-foreground">{steps}</span>
              </div>
              <div className="pt-2">
                <Slider
                  id="steps"
                  min={2}
                  max={50}
                  step={1}
                  value={[steps]}
                  onValueChange={(value) => setSteps(value[0])}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Style */}
        {styleType === "category" && (
          <div className="space-y-4">
            <div className="space-y-4">
              {categoryEntries.map((entry, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      Category {index + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategoryEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Min Value</Label>
                      <Input
                        type="number"
                        value={entry.min}
                        onChange={(e) =>
                          updateCategoryEntry(index, "min", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Max Value</Label>
                      <Input
                        type="number"
                        value={entry.max}
                        onChange={(e) =>
                          updateCategoryEntry(index, "max", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={entry.label}
                      onChange={(e) =>
                        updateCategoryEntry(index, "label", e.target.value)
                      }
                      placeholder="Enter category label"
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <div>
                      <div
                        className="w-full h-10 rounded-md cursor-pointer border mb-2"
                        style={{ backgroundColor: entry.color }}
                        onClick={() =>
                          setShowColorPicker(
                            showColorPicker === index ? null : index
                          )
                        }
                      />
                      {showColorPicker === index && (
                        <div className="border rounded-md p-2 bg-background-primary shadow-md">
                          <HexColorPicker
                            color={entry.color}
                            onChange={(color) =>
                              updateCategoryEntry(index, "color", color)
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={addCategoryEntry}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        )}

        {/* Show QGIS style indicator */}
        {has_qgis_style() && (
          <div className="mb-4 p-3 bg-accent border border-accent-foreground rounded-md">
            <div className="flex items-center text-accent-foreground">
              <TriangleAlert className="size-4 mr-1" />
              <span className="text-sm font-medium">QGIS Style detected</span>
            </div>
            <p className="text-xs text-accent-foreground mt-1">
              This map style is currently based on its QGIS styling. If you
              apply changes here, they will only be applied to MapHub.co
              visualisations. The map styling will remain unchanged in QGIS.
            </p>
          </div>
        )}

        <Button
          onClick={handle_apply_colormap}
          disabled={is_loading}
          className="w-full mt-4"
        >
          {is_loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...
            </>
          ) : (
            `Apply ${
              styleType.charAt(0).toUpperCase() + styleType.slice(1)
            } Colormap`
          )}
        </Button>

        {error && <p className="text-destructive text-sm mt-4">{error}</p>}
      </div>
    </Card>
  );
}
