// LIBRARIES
import { ImageResponse } from "next/og";

// SERVICES
import { map_services } from "@/services/map.services";

// Image metadata
export const alt = "MapHub.co";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// INTERFACES
interface FontOptions {
  name: string;
  data: ArrayBuffer;
  style?: "normal" | "italic";
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

const load_fonts = async (): Promise<FontOptions[]> => {
  return [
    // NORMAL
    {
      name: "Inter",
      data: await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/Inter-Regular.ttf`
      ).then((res) => res.arrayBuffer()),
      style: "normal",
      weight: 400,
    },
    // BOLD
    {
      name: "Inter",
      data: await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/Inter-Bold.ttf`
      ).then((res) => res.arrayBuffer()),
      style: "normal",
      weight: 700,
    },
  ];
};

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const map_info = await map_services.get_map_async(id, false);
    const { map } = map_info;

    return new ImageResponse(
      map.public ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            color: "#0e1016",
            fontFamily: "Inter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* background-primary */}
          <img
            src={`${process.env.NEXT_PUBLIC_MAPHUB_API_URL}/maps/${id}/thumbnail`}
            alt={map.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "relative",
              zIndex: 0,
            }}
          />

          {/* LOGO */}
          <div
            style={{
              background: "#020817",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 1.5rem 1rem 1rem",
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/icon.svg`}
              alt={"Maphub.co Logo"}
              style={{
                width: "3rem",
                height: "3rem",
              }}
            />

            <span
              style={{
                color: "white",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              MapHub.co
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "white",
            color: "#0e1016",
            fontFamily: "Inter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* CONTENT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              position: "relative",
            }}
          >
            {/* LOGO */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/icon.svg`}
                alt={"Maphub.co Logo"}
                style={{
                  width: "6rem",
                  height: "6rem",
                }}
              />

              <span
                style={{
                  fontSize: "4rem",
                  fontWeight: 700,
                }}
              >
                MapHub.co
              </span>
            </div>

            {/* SUBTITLE */}
            <span
              style={{
                fontSize: "1.4rem",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Private Map
            </span>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: await load_fonts(),
      }
    );
  } catch (error: any) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "white",
            color: "#0e1016",
            fontFamily: "Inter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/icon.svg`}
              alt={"Maphub.co Logo"}
              style={{
                width: "6rem",
                height: "6rem",
              }}
            />

            <span
              style={{
                fontSize: "4rem",
                fontWeight: 700,
              }}
            >
              MapHub.co
            </span>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: await load_fonts(),
      }
    );
  }
}
