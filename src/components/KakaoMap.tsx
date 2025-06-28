import { useEffect, useRef, useState } from "react";
import { Issue } from "@/store/useIssuesStore";

interface KakaoMapProps {
  issues: Issue[];
  center?: { lat: number; lng: number };
}

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

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }; // 서울 기본 좌표

const KakaoMap = ({ issues, center }: KakaoMapProps) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapCenter = center ?? DEFAULT_CENTER;

  // 맵 초기화는 한 번만 실행
  useEffect(() => {
    const loadMap = () => {
      const container = document.getElementById("map");
      if (!container) return;

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 15,
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
  }, []); // 빈 배열: 처음에만 실행

  // 이슈가 변경되거나 맵이 로드되었을 때 마커 생성 및 중심 이동
  useEffect(() => {
    if (!isMapLoaded) return;

    // 기존 마커 모두 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    issues.forEach((issue) => {
      const color = severityColors[issue.severity] ?? "#000000";
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
        const content = `
          <div style="padding:10px; min-width:250px;">
            <h4 style="margin:0 0 5px 0;">${issue.title}</h4>
            <p style="margin:0 0 5px 0;">${issue.description}</p>
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapRef.current, marker);
      });
    });

    if (issues.length > 0) {
      const first = issues[0];
      const centerPos = new window.kakao.maps.LatLng(first.lat, first.lng);
      mapRef.current.setCenter(centerPos);
    } else {
      // 이슈 없으면 기본 서울 중심으로
      const defaultCenterPos = new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
      mapRef.current.setCenter(defaultCenterPos);
    }
  }, [issues, isMapLoaded]);

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
          width: "70%",
          height: "350px",
          border: "2px solid gray",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default KakaoMap;
