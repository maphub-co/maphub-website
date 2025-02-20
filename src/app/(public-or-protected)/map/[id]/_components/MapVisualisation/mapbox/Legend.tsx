// LIBRARIES
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { Edit } from "lucide-react";

// TYPES
type ColormapEntry = [number[], number[]]; // [value range, rgba color]

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import colormap from "colormap";

/*======= INTERFACE =======*/
interface LegendProps {
  className?: string;
}

/*======= COMPONENT =======*/
export default function Legend({ className }: LegendProps) {
  const visuals = useMapStore(useShallow((state) => state.map?.visuals));

  if (visuals?.qgis) return <></>;

  // If no colormap is provided, show empty state
  if (!visuals?.colormap && !visuals?.styles) {
    return (
      <Card className={className}>
        <div className="border-b p-4 flex items-center">
          <h3 className="text-sm font-bold">Legend</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground italic">
            No legend available for this map.
          </p>
        </div>
      </Card>
    );
  }

  if (visuals?.styles) {
    const colormap_preset = colormap({
      colormap: visuals.styles.colormap,
      nshades: visuals.styles.steps,
      format: "hex",
      alpha: 1,
    });

    return (
      <Card className={className}>
        <div className="border-b p-4 flex items-center">
          <h3 className="text-sm font-semibold">Legend</h3>
        </div>
        <div className="p-4">
          <div className="h-8 rounded overflow-hidden flex">
            {colormap_preset.map((color, i) => (
              <div
                key={i}
                style={{ backgroundColor: color }}
                className="flex-1 h-full"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{visuals.styles.min_value}</span>
            <span>{visuals.styles.max_value}</span>
          </div>
        </div>
      </Card>
    );
  }

  // If colormap is a string (preset name), show a simple legend
  if (typeof visuals.colormap === "string") {
    return (
      <Card className={className}>
        <div className="border-b p-4 flex items-center">
          <h3 className="text-sm font-semibold">Legend</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Using preset colormap: {visuals.colormap}
        </div>
      </Card>
    );
  }

  // Hide element if the colormap is for an RGB image.
  if (visuals.colormap.type === "rgb") return <></>;

  // For category colormap, show the legend with labels
  if (visuals.type_colormap === "category" && visuals.legend) {
    return (
      <Card className={className}>
        <div className="border-b p-4 flex items-center">
          <h3 className="text-sm font-semibold">Legend</h3>
        </div>
        <div className="p-4 space-y-2">
          {Object.entries(visuals.legend).map(([value, label]) => {
            // Find the color for this value
            const colorEntry = visuals.colormap.find(
              (entry: ColormapEntry) =>
                entry[0][0] <= parseFloat(value) &&
                entry[0][1] > parseFloat(value)
            );
            const color = colorEntry ? colorEntry[1] : [0, 0, 0, 255];

            return (
              <div key={value} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: `rgba(${color[0]}, ${color[1]}, ${
                      color[2]
                    }, ${color[3] / 255})`,
                  }}
                />
                <span className="text-sm">{String(label)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  // For continuous colormap, show the color gradient
  return (
    visuals.colormap.length > 0 && (
      <Card className={className}>
        <div className="border-b p-4 flex items-center">
          <h3 className="text-sm font-semibold">Legend</h3>
        </div>
        <div className="p-4">
          <div className="h-8 rounded overflow-hidden flex">
            {visuals.colormap.map((entry: ColormapEntry, i: number) => (
              <div
                key={i}
                style={{
                  backgroundColor: `rgba(${entry[1][0]}, ${entry[1][1]}, ${
                    entry[1][2]
                  }, ${entry[1][3] / 255})`,
                }}
                className="flex-1 h-full"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{visuals.colormap[0][0][0]}</span>
            <span>{visuals.colormap[visuals.colormap.length - 1][0][1]}</span>
          </div>
        </div>
      </Card>
    )
  );
}
