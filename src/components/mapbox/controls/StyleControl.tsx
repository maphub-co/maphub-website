// STYLES
import "./StyleControl.css";

// LIBRARIES
import { IControl, useControl } from "react-map-gl/mapbox";
import {
  MapboxStyleDefinition,
  MapboxStyleSwitcherControl,
} from "mapbox-gl-style-switcher";

export default function StyleControl(props: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const styles: MapboxStyleDefinition[] = [
    { title: "Streets", uri: "mapbox://styles/mapbox/streets-v12" },
    { title: "Satellite", uri: "mapbox://styles/mapbox/satellite-streets-v12" },
    { title: "Dark", uri: "mapbox://styles/mapbox/dark-v11" },
    { title: "Light", uri: "mapbox://styles/mapbox/light-v11" },
  ];

  useControl(
    () => new MapboxStyleSwitcherControl(styles, "Streets") as IControl,
    {
      position: props.position,
    }
  );

  return null;
}
