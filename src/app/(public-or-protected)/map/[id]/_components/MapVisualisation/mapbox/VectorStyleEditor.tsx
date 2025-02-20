"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

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
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import colormap from "colormap";

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

/*======= INTERFACES =======*/
interface PropertyStyle {
  colormap: string;
  min_value?: number;
  max_value?: number;
  steps: number;
}

interface Property {
  name: string;
  type: string;
  unique_values: number;
}

/*======= COMPONENT =======*/
export default function VectorStyleEditor({
  className,
}: {
  className?: string;
}) {
  /*======= ATTRIBUTS =======*/
  const [
    is_loading,
    map_type,
    meta_data,
    map_visuals,
    update_visuals,
    qgis_style,
  ] = useMapStore(
    useShallow((state) => [
      state.is_loading,
      state.map?.type,
      state.meta_data,
      state.map?.visuals,
      state.update_visuals,
      state.use_qgis_style,
    ])
  );
  const [is_saving, set_saving] = useState<boolean>(false);
  const [error, set_error] = useState<string | null>(null);
  const [properties, set_properties] = useState<Property[]>([]);
  const [selected_property, set_selected_property] = useState<string | null>(
    null
  );
  const [style, set_style] = useState<PropertyStyle>({
    colormap: "viridis",
    min_value: 0,
    max_value: 100,
    steps: get_colormap_min_nshades("viridis"),
  });
  const [min_steps, set_min_steps] = useState<number>(
    get_colormap_min_nshades(style.colormap)
  );

  /*------- METHODS -------*/
  const handle_selected_property_update = (property: string) => {
    const property_meta = meta_data?.properties?.find(
      (prop) => prop.column_name === property
    );

    if (!property_meta) return;

    set_selected_property(property);
    set_style((prev) => ({
      ...prev,
      min_value: property_meta.min ?? 0,
      max_value: property_meta.max ?? 10,
    }));
  };

  const handle_style_update = (
    key: keyof PropertyStyle,
    value: PropertyStyle[keyof PropertyStyle]
  ) => {
    const new_style = { ...style, [key]: value };
    set_style(new_style);

    if (key === "colormap" && typeof value === "string") {
      const min_steps = get_colormap_min_nshades(value);
      set_min_steps(min_steps);
      set_style((prev) => ({
        ...prev,
        steps: prev.steps < min_steps ? min_steps : prev.steps,
      }));
    }
  };

  // Check if map has QGIS styling
  const has_qgis_style = () => {
    return (
      map_visuals?.qgis &&
      map_visuals.qgis.trim().length > 0 &&
      !map_visuals.styles
    );
  };

  const handle_save = async () => {
    // Check for QGIS conflict before applying
    if (
      has_qgis_style() &&
      !window.confirm(
        "This map already has QGIS styling. Do you want to overwrite it's visualisation on MapHub ?"
      )
    ) {
      return;
    }

    set_saving(true);

    try {
      const visuals = {
        ...map_visuals,
        styles: {
          feature: selected_property,
          colormap: style.colormap,
          min_value: style.min_value,
          max_value: style.max_value,
          steps: style.steps,
        },
      };

      await update_visuals(visuals);
    } catch (error) {
      console.error("Error updating visuals:", error);
      set_error("Error : Failed to update visuals");
    } finally {
      set_saving(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!meta_data) return;

    const all_geometries: Property[] =
      meta_data?.properties
        ?.filter((prop) => prop.column_name !== "geometry")
        .map((prop) => ({
          name: prop.column_name,
          type: prop.data_type,
          unique_values: prop.unique_values,
        })) || [];

    if (all_geometries.length === 0) return;

    set_properties(all_geometries);

    const property = map_visuals?.styles
      ? map_visuals.styles.feature
      : all_geometries[0].name;

    if (!property) return;

    const property_meta = meta_data.properties?.find(
      (prop) => prop.column_name === property
    );

    set_selected_property(property);
    set_style({
      min_value: map_visuals?.styles?.min_value || property_meta?.min,
      max_value: map_visuals?.styles?.max_value || property_meta?.max,

      // COLORMAP
      colormap: map_visuals?.styles?.colormap ?? "viridis",
      steps:
        map_visuals?.styles?.steps >= get_colormap_min_nshades(style.colormap)
          ? map_visuals?.styles?.steps
          : get_colormap_min_nshades(style.colormap),
    });
    set_min_steps(get_colormap_min_nshades(style.colormap));
  }, [meta_data, map_visuals]);

  /*------- RENDERER -------*/
  if (is_loading || map_type !== "vector" || has_qgis_style()) return <></>;

  return (
    <Card className={className}>
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">Vector Style Editor</h3>
      </div>

      <div className="p-4">
        {properties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No properties available for styling
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* PROPERTY SELECTOR */}
            <Label className="flex flex-col gap-y-2 ">
              <span className="text-xs font-medium">Property</span>
              <Select
                value={selected_property ?? undefined}
                onValueChange={(value) =>
                  handle_selected_property_update(value)
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent className="z-100">
                  {properties.map((prop) => (
                    <SelectItem key={prop.name} value={prop.name}>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium capitalize mb-1">
                          {prop.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {prop.type} • {prop.unique_values} unique values
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>

            {/* PARAMETERS */}
            <div className="space-y-4">
              <h4 className="font-medium text-xs">Appearance</h4>

              {/* COLORMAP */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">
                    Colormap
                  </Label>
                  <span className="text-xs text-muted-foreground capitalize">
                    {style?.colormap}
                  </span>
                </div>

                <Select
                  value={style?.colormap}
                  onValueChange={(value) =>
                    handle_style_update("colormap", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="w-full h-4 mr-2 rounded overflow-hidden flex">
                      {COLORMAP_PRESETS.find(
                        (p) => p.name === style?.colormap
                      )?.colors.map((color, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: color }}
                          className="flex-1 h-full"
                        />
                      ))}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="z-100">
                    {COLORMAP_PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        <div className="flex items-center">
                          <div className="w-16 h-4 mr-2 rounded overflow-hidden flex">
                            {preset?.colors.map((color, i) => (
                              <div
                                key={i}
                                style={{ backgroundColor: color }}
                                className="flex-1 h-full"
                              />
                            ))}
                          </div>
                          <span className="text-xs capitalize">
                            {preset.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MIN MAX */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="col-span-2 md:col-span-1 flex flex-col">
                    <Label className="text-xs text-muted-foreground mb-1">
                      Min
                    </Label>
                    <input
                      type="number"
                      value={style?.min_value ?? 0}
                      onChange={(e) =>
                        handle_style_update(
                          "min_value",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full min-w-24 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>

                <div>
                  <div className="col-span-2 md:col-span-1 flex flex-col">
                    <Label className="text-xs text-muted-foreground mb-1">
                      Max
                    </Label>
                    <input
                      type="number"
                      value={style?.max_value ?? 100}
                      onChange={(e) =>
                        handle_style_update(
                          "max_value",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full min-w-24 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* STEPS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">
                    Steps ({min_steps}-20)
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {style.steps}
                  </span>
                </div>
                <Slider
                  min={min_steps}
                  max={20}
                  step={1}
                  value={[style.steps]}
                  onValueChange={(value) =>
                    handle_style_update("steps", value[0])
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* POINT STYLE */}
            {/* <div className="space-y-4">
                <h4 className="text-sm font-medium">Points :</h4>
                <div className="space-y-4">
                  <Label className="grid grid-cols-3 items-center gap-x-2">
                    <span className="w-fit text-xs text-muted-foreground">Color</span>

                    <Input
                      className="w-full p-1.5"
                      type="color"
                      value={style.point_color}
                      onChange={(e) =>
                        handle_update_style("point_color", e.target.value)
                      }
                    />
                  </Label>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Radius</Label>
                      <span className="text-xs text-muted-foreground">
                        {style.point_size}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[style.point_size]}
                      onValueChange={(value) =>
                        handle_update_style("point_size", value[0])
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div> */}

            {/* LINE STYLE */}
            {/* <div className="space-y-4">
                <h4 className="text-sm font-medium">Lines :</h4>

                <div className="space-y-4">
                  <Label className="grid grid-cols-3 items-center gap-x-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Color
                    </span>

                    <Input
                      className="w-full p-1.5"
                      type="color"
                      value={style.line_color}
                      onChange={(e) =>
                        handle_update_style("line_color", e.target.value)
                      }
                    />
                  </Label>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Width</Label>
                      <span className="text-xs text-muted-foreground">
                        {style.line_width}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[style.line_width]}
                      onValueChange={(value) =>
                        handle_update_style("line_width", value[0])
                      }
                    />
                  </div>
                </div>
              </div> */}

            {/* POLYGON STYLE */}
            {/* <div className="space-y-4">
                <h4 className="text-sm font-medium">Polygons :</h4>
                <div className="space-y-4">
                  <Label className="grid grid-cols-3 items-center gap-x-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Fill color
                    </span>

                    <Input
                      className="w-full p-1.5"
                      type="color"
                      value={style.polygon_fill_color}
                      onChange={(e) =>
                        handle_update_style("polygon_fill_color", e.target.value)
                      }
                    />
                  </Label>

                  <Label className="grid grid-cols-3 items-center gap-x-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Stroke color
                    </span>

                    <Input
                      className="w-full p-1.5"
                      type="color"
                      value={style.polygon_stroke_color}
                      onChange={(e) =>
                        handle_update_style("polygon_stroke_color", e.target.value)
                      }
                    />
                  </Label>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">
                        Stroke Width
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {style.polygon_stroke_width}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[style.polygon_stroke_width ?? 2]}
                      onValueChange={(value) =>
                        handle_update_style("polygon_stroke_width", value[0])
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div> */}

            <Button
              onClick={handle_save}
              disabled={is_saving}
              className="w-full"
            >
              {is_saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Styles"
              )}
            </Button>

            {error && <p className="text-destructive text-sm mt-4">{error}</p>}
          </div>
        )}
      </div>
    </Card>
  );
}
