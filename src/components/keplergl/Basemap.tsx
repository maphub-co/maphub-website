"use client";

// STYLES
import "maplibre-gl/dist/maplibre-gl.css";
import "@kepler.gl/styles";

// LIBRARIES
import { Dispatch } from "react";
import { connect } from "react-redux";
import KeplerGl from "@kepler.gl/components";
import { KeplerGlState } from "@kepler.gl/reducers";
import AutoSizer from "react-virtualized-auto-sizer";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= PROPS =======*/
interface KeplerglBasemapProps {
  id: string;
  appName: string;
  className?: string;
}

/*======= COMPONENT =======*/
function KeplerglBasemap({ id, appName, className }: KeplerglBasemapProps) {
  /*------- RENDERER -------*/
  return (
    <div className={cn(className, "w-full h-full")}>
      <AutoSizer>
        {({ height, width }) => (
          <KeplerGl id={id} appName={appName} width={width} height={height} />
        )}
      </AutoSizer>
    </div>
  );
}

/*======= REDUX CONNECTION =======*/
const mapStateToProps = (state: KeplerGlState) => state;
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(KeplerglBasemap);
