import Image from "next/image";

export default function Presentation() {
  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 flex flex-col gap-y-8">
      {/* TITLE */}
      <div className="flex flex-col items-center gap-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Introducing Maphub.co: <br /> the Geospatial Cloud for collaboration
        </h2>

        {/* <h3 className="text-center text-lg">
          Waste less time handling formats compatibility
        </h3> */}

        <p className="max-w-4xl text-base text-center my-4">
          Store all your geospatial datasets in the cloud, and access it through
          the browser, or directly from QGIS. Increase sharability, boost your
          team’s productivity, and uncover insights as a team.
        </p>
      </div>

      {/* VIDEO */}
      <div className="max-w-5xl mx-auto flex justify-center">
        <Image
          src="/images/home/mockup.webp"
          alt="QGIS plugin for collaboration"
          width={1400}
          height={1000}
          className="object-fit w-full h-auto"
        />
      </div>
    </section>
  );
}
