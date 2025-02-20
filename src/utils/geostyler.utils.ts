import { XMLParser } from "fast-xml-parser";
import { Style } from "geostyler-style";

type GeoStylerSymbolizer = {
  kind: string;
  radius?: number | any[];
  width?: number | any[];
  height?: number | any[];
  [key: string]: any;
};

export type GeoStylerRule = {
  symbolizers: GeoStylerSymbolizer[];
  [key: string]: any;
};

export function scale_geostyler_style_for_zoom(
  geostyler_style: Style,
  zoom_stops: [number, number] = [10, 14],
  factor: number = 6
): Style {
  const new_style = JSON.parse(JSON.stringify(geostyler_style)); // deep clone

  new_style.rules.forEach((geostyler_rule: GeoStylerRule) => {
    geostyler_rule.symbolizers.forEach((symbolizer: GeoStylerSymbolizer) => {
      const zoom_expr = (base: number) => [
        "interpolate",
        ["linear"],
        ["zoom"],
        zoom_stops[0],
        base,
        zoom_stops[1],
        base * factor,
      ];

      if (symbolizer.kind === "Mark" || symbolizer.kind === "Icon") {
        if (typeof symbolizer.radius === "number")
          symbolizer.radius = zoom_expr(symbolizer.radius);
        if (typeof symbolizer.width === "number")
          symbolizer.width = zoom_expr(symbolizer.width);
        if (typeof symbolizer.height === "number")
          symbolizer.height = zoom_expr(symbolizer.height);
      }

      if (symbolizer.kind === "Line") {
        if (typeof symbolizer.width === "number")
          symbolizer.width = zoom_expr(symbolizer.width);
      }

      // Optional: handle 'Text' or 'Fill' if needed
    });
  });

  return new_style;
}

export function patch_opacity_from_qml(
  qmlContent: string,
  style: Style
): Style {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  // Navigate to symbol layers
  const symbols =
    parser.parse(qmlContent)?.qgis?.["renderer-v2"]?.symbols?.symbol;

  if (!symbols) return style;

  const patched_style = JSON.parse(JSON.stringify(style)); // deep clone

  if (Array.isArray(symbols)) {
    symbols.forEach((symbol, i) => {
      const alpha = symbol.alpha;

      if (alpha) {
        const symb = patched_style.rules[i]?.symbolizers[0];
        if (
          symb?.kind === "Fill" ||
          symb?.kind === "Line" ||
          symb?.kind === "Mark"
        ) {
          symb.opacity = parseFloat(alpha);
        }
      }
    });
  }

  if (typeof symbols === "object") {
    const alpha = symbols.alpha;

    if (alpha) {
      const symb = patched_style.rules[0]?.symbolizers[0];
      if (
        symb?.kind === "Fill" ||
        symb?.kind === "Line" ||
        symb?.kind === "Mark"
      ) {
        symb.opacity = parseFloat(alpha);
      }
    }
  }

  return patched_style;
}

/**
 * Extracts property values and their units from QGIS XML for a given symbol/layer.
 * Returns a map: { property: { value, unit } }
 */
export function extract_qgis_property_units(
  qmlContent: string
): Record<string, { value: number; unit: string }> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const xml = parser.parse(qmlContent);
  const result: Record<string, { value: number; unit: string }> = {};

  // Find all <Option> elements under or <symbol>
  const layer_attributes = xml?.qgis?.["renderer-v2"]?.symbols?.symbol?.layer;
  const layer_array = !!layer_attributes
    ? Array.isArray(layer_attributes)
      ? layer_attributes
      : [layer_attributes]
    : [];

  for (const layer of layer_array) {
    const options = layer.Option.Option;
    const options_array = !!options
      ? Array.isArray(options)
        ? options
        : [options]
      : [];

    // Build a map of property values and units
    for (const option of options_array) {
      const name = option?.name;
      const value = option?.value;

      if (!name || value === undefined) continue;

      // If this is a unit property, pair it with the corresponding value
      if (name.endsWith("_unit")) {
        const prop = name.replace(/_unit$/, "");
        if (result[prop]) {
          result[prop].unit = value;
        } else {
          result[prop] = { value: NaN, unit: value };
        }
      } else {
        // Try to parse as number
        const num = parseFloat(value);
        if (!isNaN(num)) {
          if (result[name]) {
            result[name].value = num;
          } else {
            result[name] = { value: num, unit: "" };
          }
        }
      }
    }
  }

  return result;
}

/**
 * Converts a value to px if needed, based on unit.
 * Supports mm, Pixel, RenderMetersInMapUnits (warn), etc.
 */
export function convert_qgis_value_to_px(value: number, unit: string): number {
  if (unit === "MM") return value * 3.78; // 1mm ≈ 3.78px at 96DPI
  if (unit === "Pixel" || unit === "pixels") return value;
  if (unit === "RenderMetersInMapUnits") {
    // Map units: warn, fallback to value
    console.warn(
      "Map units to px conversion not implemented. Returning default value 0.8."
    );
    return 0.8;
  }
  return value; // Default: no conversion
}

/**
 * Patch a GeoStyler style object with px-converted values from QGIS XML.
 * (First implementation: only handles width, size, radius, height for Mark, Icon, Line)
 */
export function patch_units_from_qml(qml_content: string, style: Style): Style {
  const property_units = extract_qgis_property_units(qml_content);
  const patched_style = JSON.parse(JSON.stringify(style)); // deep clone

  patched_style.rules.forEach((rule: GeoStylerRule) => {
    rule.symbolizers.forEach((symbolizer: GeoStylerSymbolizer) => {
      // Handle width
      if (typeof symbolizer.width === "number" && property_units.width) {
        symbolizer.width = convert_qgis_value_to_px(
          property_units.width.value,
          property_units.width.unit
        );
      }
      if (typeof symbolizer.width === "number" && property_units.line_width) {
        symbolizer.width = convert_qgis_value_to_px(
          property_units.line_width.value,
          property_units.line_width.unit
        );
      }
      if (
        typeof symbolizer.outlineWidth === "number" &&
        property_units.outline_width
      ) {
        symbolizer.outlineWidth = convert_qgis_value_to_px(
          property_units.outline_width.value,
          property_units.outline_width.unit
        );
      }

      // Handle radius/size/height
      if (typeof symbolizer.radius === "number" && property_units.size) {
        symbolizer.radius = convert_qgis_value_to_px(
          property_units.size.value,
          property_units.size.unit
        );
      }
      if (typeof symbolizer.height === "number" && property_units.height) {
        symbolizer.height = convert_qgis_value_to_px(
          property_units.height.value,
          property_units.height.unit
        );
      }
    });
  });
  return patched_style;
}
