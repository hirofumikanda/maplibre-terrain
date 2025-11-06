import { useEffect } from "react";
import { Protocol } from "pmtiles";
import maplibregl from "maplibre-gl";

let pmtilesProtocolRegistered = false;

export const usePmtilesProtocol = () => {
  useEffect(() => {
    // pmtilesプロトコルが既に登録されているかチェック
    if (pmtilesProtocolRegistered) {
      return;
    }

    // pmtilesプロトコルを登録
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    pmtilesProtocolRegistered = true;

    // クリーンアップ関数でプロトコルを削除
    return () => {
      maplibregl.removeProtocol("pmtiles");
      pmtilesProtocolRegistered = false;
    };
  }, []);
};