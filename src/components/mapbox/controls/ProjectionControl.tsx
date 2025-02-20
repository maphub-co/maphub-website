// LIBRARIES
import { useEffect, useRef } from "react";
import { useControl } from "react-map-gl/mapbox";

// STYLES
import "./ProjectionControl.css";

/**
 * ProjectionControl component for toggling between globe and mercator projections
 */
export default function ProjectionControl({
  position,
  projection,
  on_change,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  projection: "globe" | "mercator";
  on_change: (projection: "globe" | "mercator") => void;
}) {
  // Reference to the button element
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Reference to store the current projection value
  const projectionRef = useRef(projection);

  // Update the ref when the projection prop changes
  useEffect(() => {
    projectionRef.current = projection;
  }, [projection]);

  // Use the useControl hook to add a custom control to the map
  useControl(
    () => {
      // Create a container for the control
      const container = document.createElement("div");
      container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

      // Create a button for toggling the projection
      const button = document.createElement("button");
      button.className = `mapboxgl-ctrl-icon projection-toggle-${
        projection === "mercator" ? "globe" : "map"
      }`;
      button.type = "button";
      button.setAttribute("aria-label", "Toggle Projection");
      button.title =
        projection === "mercator"
          ? "Switch to Globe View"
          : "Switch to Flat Map";

      // Store reference to the button
      buttonRef.current = button;

      // Add click event listener to toggle the projection
      const handleClick = () => {
        // Toggle to the opposite projection using the current value from the ref
        const newProjection =
          projectionRef.current === "mercator" ? "globe" : "mercator";
        on_change(newProjection);
      };

      button.addEventListener("click", handleClick);

      // Add the button to the container
      container.appendChild(button);

      // Return an object implementing the IControl interface
      return {
        onAdd: () => container,
        onRemove: () => {
          // Clean up event listeners when the control is removed
          button.removeEventListener("click", handleClick);
          container.parentNode?.removeChild(container);
          buttonRef.current = null;
        },
      };
    },
    {
      position,
    }
  );

  // Update button appearance when projection changes
  useEffect(() => {
    if (buttonRef.current) {
      // Remove existing classes
      buttonRef.current.classList.remove(
        "projection-toggle-globe",
        "projection-toggle-map"
      );

      // Add appropriate class based on current projection
      buttonRef.current.classList.add(
        `projection-toggle-${projection === "mercator" ? "globe" : "map"}`
      );

      // Update title
      buttonRef.current.title =
        projection === "mercator"
          ? "Switch to Globe View"
          : "Switch to Flat Map";
    }
  }, [projection]);

  return null;
}
