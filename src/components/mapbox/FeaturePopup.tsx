"use client";

// LIBRARIES
import { Popup } from "react-map-gl/mapbox";
import { X } from "lucide-react";

// COMPONENTS
import { Button } from "../ui/Button";

interface FeaturePopupProps {
  longitude: number;
  latitude: number;
  properties: Record<string, any>;
  on_close: () => void;
}

export default function FeaturePopup({
  longitude,
  latitude,
  properties,
  on_close,
}: FeaturePopupProps) {
  return (
    <Popup
      className="font-['Inter'] rounded-md"
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      closeButton={false}
      closeOnClick={false}
      onClose={on_close}
      offset={[0, -1]}
    >
      {/* HEADER */}
      <div className="pb-2 mb-2 flex items-center border-b">
        <h3 className="px-2 text-sm font-medium flex-1">Feature Properties</h3>
        <Button variant={"ghost"} size={"sm"} onClick={on_close}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="w-full max-h-[320px] flex overflow-y-scroll">
        <table>
          <tbody>
            {Object.entries(properties).map(([key, value]) => (
              <tr key={key}>
                <td className="p-0.5 font-medium">{key} :</td>
                <td className="p-0.5">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Popup>
  );
}
