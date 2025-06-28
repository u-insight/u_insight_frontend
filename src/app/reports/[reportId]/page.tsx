"use client";
import { useEffect, useRef, useState } from "react";
import { useReportsStore, ReportData } from "@/store/useReportsStore";
import { UrgencyLevel_e } from "@/types/report";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

// SVG 원형 마커 생성 함수
function createColorMarker(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="1" />
    </svg>`;
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

// 위험도별 컬러 정의
const urgencyColors: Record<UrgencyLevel_e, string> = {
  [UrgencyLevel_e.Low]: "#3CB371",    // 초록
  [UrgencyLevel_e.Normal]: "#FFD700", // 노랑
  [UrgencyLevel_e.Urgent]: "#FF4500", // 빨강
};

const DEFAULT_CENTER = { lat: 36.35, lng: 128.70 };

const AdminReportsPage = () => {
  const { reports } = useReportsStore();
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 맵 초기화
  useEffect(() => {
    const loadMap = () => {
      const container = document.getElementById("adminMap");
      if (!container) return;

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
        level: 6,
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
    if (!isMapLoaded || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((report) => {
      if (!report.coordinates) return;

      const color = urgencyColors[report.urgency] ?? "#000000";
      const markerImage = new window.kakao.maps.MarkerImage(
        createColorMarker(color),
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 12) },
      );

      const position = new window.kakao.maps.LatLng(
        report.coordinates.lat,
        report.coordinates.lng,
      );

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position,
        image: markerImage,
        title: report.title,
      });

      markersRef.current.push(marker);

      const content = `
        <div style="padding:10px; min-width:400px; font-size:14px;">
          <strong style="color:${color};">[${report.urgency}] ${report.title || "제목 없음"}</strong><br/>
          <div style="margin:5px 0;">${report.description}</div>
          <div>위치: ${report.location}</div>
          <div>날짜: ${new Date(report.timestamp).toLocaleDateString()}</div>
          <div>상태: ${report.status || "미지정"}</div>
        </div>
      `;

      window.kakao.maps.event.addListener(marker, "click", () => {
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(mapRef.current!, marker);
        setSelectedId(report.id);
      });
    });

    // 지도 중심 조정
    if (reports.length === 1) {
      const first = reports[0];
      if (first.coordinates) {
        mapRef.current.setCenter(new window.kakao.maps.LatLng(first.coordinates.lat, first.coordinates.lng));
      }
    } else if (reports.length > 1) {
      const bounds = new window.kakao.maps.LatLngBounds();
      reports.forEach((r) => {
        if (r.coordinates) {
          bounds.extend(new window.kakao.maps.LatLng(r.coordinates.lat, r.coordinates.lng));
        }
      });
      mapRef.current.setBounds(bounds);
    } else {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
    }
  }, [reports, isMapLoaded]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 지도 영역 */}
      <div className="md:w-2/3 h-64 md:h-full">
        <div id="adminMap" className="w-full h-full" />
      </div>

      {/* 리스트 영역 */}
      <div className="md:w-1/3 h-[calc(100vh-16rem)] md:h-full overflow-y-auto border-t md:border-t-0 md:border-l bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">신고 목록 ({reports.length}건)</h2>

        {reports.map((report) => {
          const isActive = selectedId === report.id;
          const urgencyLabel = {
            [UrgencyLevel_e.Urgent]: "긴급",
            [UrgencyLevel_e.Normal]: "보통",
            [UrgencyLevel_e.Low]: "낮음",
          }[report.urgency];

          const urgencyColor = {
            [UrgencyLevel_e.Urgent]: "text-red-600",
            [UrgencyLevel_e.Normal]: "text-amber-600",
            [UrgencyLevel_e.Low]: "text-green-600",
          }[report.urgency];

          return (
            <div
              key={report.id}
              className={`mb-4 rounded-lg border p-4 shadow-sm cursor-pointer transition hover:bg-gray-50 ${isActive ? "border-blue-500" : ""
                }`}
              onClick={() => {
                if (!report.coordinates) return;
                if (!window.kakao || !window.kakao.maps) return;

                const loc = new window.kakao.maps.LatLng(report.coordinates.lat, report.coordinates.lng);
                mapRef.current?.setCenter(loc);
                setSelectedId(report.id);
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate max-w-[60%]">{report.title || "제목 없음"}</h3>
                <span className={`text-xs font-medium ${urgencyColor}`}>{urgencyLabel}</span>
                <span className="text-xs font-medium text-gray-500 ml-2">상태: {report.status || "미지정"}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{report.description}</p>
              <div className="mt-2 text-xs text-gray-500 flex gap-2 items-center">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(report.timestamp).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReportsPage;
