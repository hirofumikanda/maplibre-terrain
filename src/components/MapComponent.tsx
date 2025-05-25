import { useEffect, useRef } from "react";
import maplibregl, {
  Map,
  type RequestParameters,
  type GetResourceResponse,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const gsidem2terrainrgb = (r: number, g: number, b: number): number[] => {
  let height = r * 655.36 + g * 2.56 + b * 0.01;
  if (r === 128 && g === 0 && b === 0) {
    height = 0;
  } else if (r >= 128) {
    height -= 167772.16;
  }
  height += 100000;
  height *= 10;
  const tB = (height / 256 - Math.floor(height / 256)) * 256;
  const tG =
    (Math.floor(height / 256) / 256 -
      Math.floor(Math.floor(height / 256) / 256)) *
    256;
  const tR =
    (Math.floor(Math.floor(height / 256) / 256) / 256 -
      Math.floor(Math.floor(Math.floor(height / 256) / 256) / 256)) *
    256;
  return [tR, tG, tB];
};

maplibregl.addProtocol(
  "gsidem",
  async (
    params: RequestParameters
  ): Promise<GetResourceResponse<ArrayBuffer>> => {
    const url = params.url.replace("gsidem://", "");

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context not available");
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length / 4; i++) {
      const tRGB = gsidem2terrainrgb(
        imageData.data[i * 4],
        imageData.data[i * 4 + 1],
        imageData.data[i * 4 + 2]
      );
      imageData.data[i * 4] = tRGB[0];
      imageData.data[i * 4 + 1] = tRGB[1];
      imageData.data[i * 4 + 2] = tRGB[2];
    }
    context.putImageData(imageData, 0, 0);

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const arr = await blob.arrayBuffer();

    return {
      data: arr,
      cacheControl: "public, max-age=3600",
      expires: new Date(Date.now() + 1000 * 60 * 60),
    };
  }
);

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "./styles/style.json",
      center: [139.7671, 35.6812],
      zoom: 12,
      hash: true,
    });
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default MapComponent;
