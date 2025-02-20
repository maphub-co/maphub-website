"use client";

// TYPES
import type { ExpressionSpecification } from "mapbox-gl";
import type { Feature, Point, LineString, Polygon } from "geojson";

// LIBRARIES
import { useEffect, useState, useCallback, useMemo } from "react";
import { Source, Layer, useMap } from "react-map-gl/mapbox";
import colormap from "colormap";
import { useShallow } from "zustand/react/shallow";
import { QGISStyleParser } from "geostyler-qgis-parser";
import { MapboxStyleParser } from "geostyler-mapbox-parser";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { user_service } from "@/services/user.services";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import Popup from "../FeaturePopup";
import {
  patch_opacity_from_qml,
  scale_geostyler_style_for_zoom,
  patch_units_from_qml,
} from "@/utils/geostyler.utils";

// HELPERS
const generate_color_stops = (
  colormap_name: string,
  steps: number,
  min_value: number,
  max_value: number
) => {
  const colors = colormap({
    colormap: colormap_name,
    nshades: steps,
    format: "hex",
    alpha: 1,
  });

  return colors.map((color: string, i: number) => [
    min_value + (i / (colors.length - 1)) * (max_value - min_value),
    color,
  ]);
};

/*======= INTERFACES =======*/
interface VectorLayerProps {
  map_id: string | null;
  params: LayerInfos;
}

interface ClickedFeature {
  longitude: number;
  latitude: number;
  properties: Record<string, any>;
}

/*======= COMPONENT =======*/
export default function VectorLayer({ map_id, params }: VectorLayerProps) {
  const map_visuals = useMapStore(useShallow((state) => state.map?.visuals));

  /*------- RENDERER -------*/
  if (!!map_visuals?.qgis && !map_visuals.styles) {
    return <QgisStyle map_id={map_id} params={params} />;
  }

  return <DefaultStyle map_id={map_id} params={params} />;
}

function DefaultStyle({ map_id, params }: VectorLayerProps) {
  /*------- ATTRIBUTS -------*/
  const { current: map } = useMap();
  const map_visuals = useMapStore(useShallow((state) => state.map?.visuals));
  const [colormap_expression, set_colormap_expression] =
    useState<ExpressionSpecification | null>(null);
  const [layer_id] = useState(`vector-layer-${map_id}`);
  const [source_id] = useState(`vector-source-${map_id}`);
  const [clicked_feature, set_clicked_feature] =
    useState<ClickedFeature | null>(null);

  // Define clickable layer IDs once
  const clickable_layers_ids = useMemo(() => {
    return [
      `${layer_id}-points`, // Points
      `${layer_id}-lines`, // Lines
      `${layer_id}-polygons-fill`, // Polygons
    ];
  }, [layer_id]);

  // Memoize the tiles URL to avoid re-renders
  const tiles_url = useMemo(() => {
    if (!params.tiling_url) return null;

    const url = `${params.tiling_url}${
      params.tiling_url.includes("?") ? "&" : "?"
    }_t=${map_id}`;

    return url;
  }, [map_id, params.tiling_url]);

  /*------- METHODS -------*/
  // Memoize the click handler to prevent unnecessary re-renders
  const handle_click = useCallback(
    (event: any) => {
      if (!map) return;

      const features = map.queryRenderedFeatures(event.point, {
        layers: clickable_layers_ids,
      });

      // Close popup when clicking on empty space
      if (features.length === 0) {
        set_clicked_feature(null);
        return;
      }

      const feature = features[0] as Feature<Point | LineString | Polygon>;

      const { lng: longitude, lat: latitude } = event.lngLat;

      if (!longitude || !latitude) {
        console.error("Invalid coordinates:", event.lngLat);
        return;
      }

      set_clicked_feature({
        longitude,
        latitude,
        properties: feature.properties || {},
      });
    },
    [map, clickable_layers_ids]
  );

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!map) return;

    const handle_mouse_enter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handle_mouse_leave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", handle_click);
    map.on("mouseenter", clickable_layers_ids, handle_mouse_enter);
    map.on("mouseleave", clickable_layers_ids, handle_mouse_leave);

    return () => {
      map.off("click", handle_click);
      map.off("mouseenter", clickable_layers_ids, handle_mouse_enter);
      map.off("mouseleave", clickable_layers_ids, handle_mouse_leave);
    };
  }, [map, clickable_layers_ids]);

  useEffect(() => {
    if (
      map_visuals?.styles === undefined ||
      map_visuals?.styles.feature === undefined ||
      map_visuals?.styles.colormap === undefined ||
      map_visuals?.styles.steps === undefined ||
      map_visuals?.styles.min_value === undefined ||
      map_visuals?.styles.max_value === undefined
    )
      return;

    const color_stops = generate_color_stops(
      map_visuals.styles.colormap,
      map_visuals.styles.steps,
      map_visuals.styles.min_value,
      map_visuals.styles.max_value
    );

    const colormap_expression: ExpressionSpecification = [
      "interpolate",
      ["linear"],
      ["to-number", ["get", map_visuals.styles.feature], 0],
      ...color_stops.flat(),
    ];

    set_colormap_expression(colormap_expression);
  }, [map_visuals]);

  /*------- RENDERER -------*/
  if (!params.tiling_url || !tiles_url) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Vector layer is missing URL",
    });
    return null;
  }

  return (
    <>
      <Source
        id={source_id}
        type="vector"
        tiles={[tiles_url]}
        minzoom={params.min_zoom ?? 0} // Default mapbox min zoom level
        maxzoom={params.max_zoom ?? 22} // Default mapbox max zoom level
      >
        {/* POINTS */}
        <Layer
          id={`${layer_id}-points`}
          source-layer="vector"
          type="circle"
          paint={{
            "circle-radius": 5,
            "circle-color": colormap_expression ?? "#007cbf",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-opacity": 1,
          }}
          filter={["==", "$type", "Point"]}
        />

        {/* LINES */}
        <Layer
          id={`${layer_id}-lines`}
          source-layer="vector"
          type="line"
          paint={{
            "line-width": 2,
            "line-color": colormap_expression ?? "#007cbf",
            "line-opacity": 1,
          }}
          filter={["==", "$type", "LineString"]}
        />

        {/* POLYGONS */}
        <Layer
          id={`${layer_id}-polygons-fill`}
          source-layer="vector"
          type="fill"
          paint={{
            "fill-color": colormap_expression ?? "#007cbf",
            "fill-opacity": 0.75,
          }}
          filter={["==", "$type", "Polygon"]}
        />
        <Layer
          id={`${layer_id}-polygons-outline`}
          source-layer="vector"
          type="line"
          paint={{
            "line-color": "#007cbf",
            "line-width": 2,
            "line-opacity": colormap_expression ? 0 : 1,
          }}
          filter={["==", "$type", "Polygon"]}
        />
      </Source>

      {clicked_feature && (
        <Popup
          longitude={clicked_feature.longitude}
          latitude={clicked_feature.latitude}
          properties={clicked_feature.properties}
          on_close={() => set_clicked_feature(null)}
        />
      )}
    </>
  );
}

function QgisStyle({ map_id, params }: VectorLayerProps) {
  /*------- ATTRIBUTS -------*/
  const { current: map } = useMap();
  const map_visuals = useMapStore(useShallow((state) => state.map?.visuals));
  const [layer_id] = useState(`vector-layer-${map_id}`);
  const [source_id] = useState(`vector-source-${map_id}`);
  const [mapbox_layers, set_mapbox_layers] = useState<any[]>([]);
  const [clickable_layers_ids, set_clickable_layers_ids] = useState<string[]>(
    []
  );
  const [clicked_feature, set_clicked_feature] =
    useState<ClickedFeature | null>(null);
  const [parsing, set_parsing] = useState(false);
  const [parse_error, set_parse_error] = useState<string | null>(null);

  /*------- METHODS -------*/
  async function parse_qgis_style(qgis_style: string) {
    if (!qgis_style) return;

    try {
      const qgis_parser = new QGISStyleParser();
      const mapbox_parser = new MapboxStyleParser();
      // Parse QGIS XML to GeoStyler style
      const { output: geo_styler_style } = await qgis_parser.readStyle(
        qgis_style
      );

      if (!geo_styler_style) {
        throw new Error(
          "Failed to parse QGIS style: No GeoStyler style produced."
        );
      }

      // === PATCH WITH UNIT-AWARE CONVERSION ===
      const unit_patched_style = patch_units_from_qml(
        qgis_style,
        geo_styler_style
      );

      // === SCALE SYMBOL SIZES ===
      const scaled_style = scale_geostyler_style_for_zoom(unit_patched_style, [
        params.min_zoom ?? 0,
        params.max_zoom ?? 22,
      ]);

      const patched_style = patch_opacity_from_qml(qgis_style, scaled_style);

      const { output: mapbox_style, errors } = await mapbox_parser.writeStyle(
        patched_style
      );

      if (!mapbox_style || !mapbox_style.layers) {
        throw new Error("Failed to convert to Mapbox style.");
      }

      return mapbox_style.layers;
    } catch (err: any) {
      throw new Error("Failed to parse QGIS style: " + (err?.message || err));
    }
  }

  const handle_click = useCallback(
    (event: any) => {
      if (!map) return;

      const features = map.queryRenderedFeatures(event.point, {
        layers: clickable_layers_ids,
      });

      // Close popup when clicking on empty space
      if (features.length === 0) {
        set_clicked_feature(null);
        return;
      }

      const feature = features[0] as Feature<Point | LineString | Polygon>;

      const { lng: longitude, lat: latitude } = event.lngLat;

      if (!longitude || !latitude) {
        console.error("Invalid coordinates:", event.lngLat);
        return;
      }

      set_clicked_feature({
        longitude,
        latitude,
        properties: feature.properties || {},
      });
    },
    [map, clickable_layers_ids]
  );

  /*------- HOOKS -------*/
  const tiles_url = useMemo(() => {
    if (!params.tiling_url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Vector layer is missing URL",
      });
      return null;
    }

    const url = `${params.tiling_url}${
      params.tiling_url.includes("?") ? "&" : "?"
    }_t=${map_id}`;

    return url;
  }, [map_id, params.tiling_url]);

  // QGIS style parsing effect
  useMemo(() => {
    if (!map_visuals?.qgis) {
      set_mapbox_layers([]);
      set_clickable_layers_ids([]);
      return;
    }

    const handle_parsing = async () => {
      set_parsing(true);
      set_parse_error(null);

      try {
        const layers = await parse_qgis_style(map_visuals.qgis);
        set_mapbox_layers(layers ?? []);
        set_clickable_layers_ids(layers?.map((layer) => layer.id) ?? []);
      } catch (err: any) {
        // toast({
        //   variant: "destructive",
        //   title: "QGIS Style Error",
        //   description: err?.message || "Failed to parse QGIS style.",
        // });

        set_parse_error("Failed to parse QGIS style: " + (err?.message || err));
      } finally {
        set_parsing(false);
      }
    };

    handle_parsing();
  }, [map_visuals]);

  useEffect(() => {
    if (!map || clickable_layers_ids.length === 0) return;

    const handle_mouse_enter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handle_mouse_leave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", handle_click);
    map.on("mouseenter", clickable_layers_ids, handle_mouse_enter);
    map.on("mouseleave", clickable_layers_ids, handle_mouse_leave);

    return () => {
      map.off("click", handle_click);
      map.off("mouseenter", clickable_layers_ids, handle_mouse_enter);
      map.off("mouseleave", clickable_layers_ids, handle_mouse_leave);
    };
  }, [map, clickable_layers_ids]);

  /*------- RENDERER -------*/
  if (!params.tiling_url || !tiles_url) {
    return null;
  }

  if (parsing) {
    return <div style={{ padding: 16 }}>Parsing QGIS style...</div>;
  }

  if (parse_error) {
    user_service
      .send_bug_report(
        `Failed to parse QGIS style (map: ${map_id}): ${parse_error}`
      )
      .catch((error: any) => {
        console.error("Failed to send bug report:", error);
      });
    return <DefaultStyle map_id={map_id} params={params} />;
  }

  return (
    <>
      <Source
        id={source_id}
        type="vector"
        tiles={[tiles_url]}
        minzoom={params.min_zoom ?? 0} // Default mapbox min zoom level
        maxzoom={params.max_zoom ?? 22} // Default mapbox max zoom level
      >
        {/* Render parsed Mapbox layers */}
        {mapbox_layers.map((layer: any) => (
          <Layer key={layer.id} source-layer="vector" {...layer} />
        ))}
      </Source>

      {clicked_feature && (
        <Popup
          longitude={clicked_feature.longitude}
          latitude={clicked_feature.latitude}
          properties={clicked_feature.properties}
          on_close={() => set_clicked_feature(null)}
        />
      )}
    </>
  );
}
