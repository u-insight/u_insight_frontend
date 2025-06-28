import { useEffect, useRef, useState } from "react";
import { ReportData } from "@/store/useReportsStore";
import { UrgencyLevel_e } from "../types/report";

interface KakaoMapProps {
  reports: ReportData[];
  center?: { lat: number; lng: number };
}

function createColorMarker(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="1" />
    </svg>`;
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

const urgencyColors = {
  [UrgencyLevel_e.Low]: "#3CB371",
  [UrgencyLevel_e.Normal]: "#FFD700",
  [UrgencyLevel_e.Urgent]: "#FF4500",
};

const DEFAULT_CENTER = { lat: 36.35, lng: 128.70 };

const KakaoMap = ({ reports, center }: KakaoMapProps) => {
  const mapRef = useRef<kakao.maps.Map>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const infoWindowRef = useRef<kakao.maps.InfoWindow>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapCenter = center ?? DEFAULT_CENTER;

  useEffect(() => {
    const loadMap = () => {
      const container = document.getElementById("map");
      if (!container) return;

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 3,
      });

      infoWindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
      setIsMapLoaded(true);
    };

    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(loadMap);
      };
    } else {
      window.kakao.maps.load(loadMap);
    }
  }, []);

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }

    if (!mapRef.current) {
      return;
    }

    if (!infoWindowRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((report) => {
      const color = urgencyColors[report.urgency] ?? "#000000";
      const markerImage = new window.kakao.maps.MarkerImage(
        createColorMarker(color),
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 12) },
      );

      if (!report.coordinates) {
        return;
      }

      const position = new window.kakao.maps.LatLng(
        report.coordinates.lat,
        report.coordinates.lng,
      );

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current!,
        position,
        image: markerImage,
      });

      markersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        const content = `
          <div style="padding:10px; min-width:250px;">
            <h4 style="margin:0 0 5px 0;">${report.title}</h4>
            <p style="margin:0 0 5px 0;">${report.description}</p>
          </div>
        `;
        infoWindowRef.current!.setContent(content);
        infoWindowRef.current!.open(mapRef.current!, marker);
      });
    });

    if (reports.length > 1) {
      const centerPos = new window.kakao.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng,
      );
      mapRef.current.setCenter(centerPos);
      mapRef.current.setLevel(8);
    } else if (reports.length === 1) {
      const first = reports[0];

      if (!first.coordinates) {
        return;
      }

      const centerPos = new window.kakao.maps.LatLng(
        first.coordinates.lat,
        first.coordinates.lng,
      );
      mapRef.current.setCenter(centerPos);
    } else {
      const defaultCenterPos = new window.kakao.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng,
      );
      mapRef.current.setCenter(defaultCenterPos);
    }
  }, [reports, isMapLoaded]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        id="map"
        style={{
          width: "100%",
          height: "350px",
        }}
      />
    </div>
  );
};

export default KakaoMap;