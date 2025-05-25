import { useEffect } from "react";
import maplibregl, {
  type RequestParameters,
  type GetResourceResponse,
} from "maplibre-gl";
import { gsidem2terrainrgb } from "../utils/gsidem";

export const useGsidemProtocol = () => {
  useEffect(() => {
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
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

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
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );
        const buffer = await blob.arrayBuffer();

        return {
          data: buffer,
          cacheControl: "public, max-age=3600",
          expires: new Date(Date.now() + 3600 * 1000),
        };
      }
    );
  }, []);
};
