import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useGsidemProtocol } from "../hooks/useGsidemProtocol";
import ExaggerationSlider from "./ExaggerationSlider";

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [exaggeration, setExaggeration] = useState(1.5);

  useGsidemProtocol();

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "./styles/style.json",
      center: [139.7671, 35.6812],
      zoom: 12,
      hash: true,
    });
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getStyle()) return;

    map.setTerrain({ source: "gsi-dem", exaggeration });

    const layerId = "hillshade-gsi-dem";
    if (
      map.getLayer(layerId) &&
      map.getPaintProperty(layerId, "hillshade-exaggeration") !== undefined
    ) {
      map.setPaintProperty(layerId, "hillshade-exaggeration", exaggeration / 3);
    }
  }, [exaggeration]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <ExaggerationSlider value={exaggeration} onChange={setExaggeration} />
    </div>
  );
};

export default MapComponent;
