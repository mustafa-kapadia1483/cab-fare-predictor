import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { Box, useMantineTheme } from "@mantine/core";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

const MapContainer = ({ map }) => {
  const theme = useMantineTheme();
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(19.0685555);
  const [lat, setLat] = useState(72.7948277);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLng(position.coords.longitude);
      setLat(position.coords.latitude);
    });
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  useEffect(() => {
    if (map.current && !theme.colorScheme) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${
        theme.colorScheme === "dark"
          ? "navigation-night-v1"
          : "navigation-day-v1"
      }`,
      center: [lng, lat],
      zoom: zoom,
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-left");

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
  }, []);
  return (
    <>
      <Box sx={{ height: "100%", width: "100%" }} ref={mapContainer} />
    </>
  );
};

export default MapContainer;
