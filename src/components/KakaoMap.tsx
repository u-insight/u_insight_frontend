"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Issue = {
  id: number;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  url?: string;
};

function createColorMarker(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="1" />
    </svg>`;
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

const severityColors = {
  low: "#3CB371",
  medium: "#FFD700",
  high: "#FF4500",
};

interface KakaoMapProps {
  issues: Issue[];
  center?: { lat: number; lng: number };
}

const KakaoMap = ({ issues, center }: KakaoMapProps) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadMap = () => {
      const container = document.getElementById("map");
      if (!container) {
        console.error("지도 컨테이너를 찾을 수 없습니다.");
        return;
      }

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });

      infoWindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    };

    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          loadMap();
        });
      };
    } else {
      window.kakao.maps.load(() => {
        loadMap();
      });
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    issues.forEach((issue) => {
      const color = severityColors[issue.severity];
      const markerImage = new window.kakao.maps.MarkerImage(
        createColorMarker(color),
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 12) }
      );

      const position = new window.kakao.maps.LatLng(issue.lat, issue.lng);

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position,
        title: issue.title,
        image: markerImage,
      });

      markersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (selectedId === issue.id) {
          infoWindowRef.current.close();
          setSelectedId(null);
        } else {
          infoWindowRef.current.setContent(
            `<div style="padding:10px; min-width:250px;">
               <h4 style="margin:0 0 5px 0;">${issue.title}</h4>
               <p style="margin:0 0 5px 0;">${issue.description}</p>
             </div>`
          );
          infoWindowRef.current.open(mapRef.current, marker);
          setSelectedId(issue.id);
        }
      });
    });
  }, [issues, selectedId]);

  useEffect(() => {
    if (!mapRef.current || !center) return;

    const moveLatLng = new window.kakao.maps.LatLng(center.lat, center.lng);
    mapRef.current.setCenter(moveLatLng);
  }, [center]);

  return (
    <div
      id="map"
      className="w-full max-w-4xl h-[500px] border-2 border-gray-400 rounded-xl shadow-lg"
      style={{ maxWidth: "500px", height: "500px" }}
    />
  );
};

export default KakaoMap;
export type { Issue };
