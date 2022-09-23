import Head from "next/head";
import MapContainer from "../components/map/MapContainer";

export default function Home() {
  return (
    <>
      <Head>
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js"></script>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css"
          type="text/css"
        />
      </Head>
      <MapContainer />;
    </>
  );
}
