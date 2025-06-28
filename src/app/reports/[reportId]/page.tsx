"use client";
import { useEffect, useRef, useState } from "react";
import { useReportsStore } from "@/store/useReportsStore";
import { UrgencyLevel_e } from "@/types/report";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

const AdminReportsPage = () => {
  const { reports } = useReportsStore();
  const mapRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!window.kakao || reports.length === 0) return;

    const mapContainer = document.getElementById("adminMap");
    const mapOption = {
      center: new window.kakao.maps.LatLng(36.1527, 128.7213),
      level: 6,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;

    reports.forEach((report) => {
      if (!report.coordinates) return;
      const { lat, lng } = report.coordinates;

      const urgencyColor = {
        [UrgencyLevel_e.Urgent]: "#EF4444",
        [UrgencyLevel_e.Normal]: "#F59E0B",
        [UrgencyLevel_e.Low]: "#10B981",
      }[report.urgency];

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map,
        title: report.title,
      });

      const iwContent = `
        <div style="padding:10px;font-size:13px;min-width:150px;">
          <strong style="color:${urgencyColor}">[${report.urgency}]</strong> ${report.title}<br/>
          <small>${report.location}</small><br/>
          <small>${new Date(report.timestamp).toLocaleDateString()}</small>
        </div>`;

      const infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
      });

      window.kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
        setSelectedId(report.id); // 리스트 강조용
      });
    });
  }, [reports]);

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

                const { lat, lng } = report.coordinates;
                const loc = new window.kakao.maps.LatLng(lat, lng);
                mapRef.current?.setCenter(loc);
                setSelectedId(report.id);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 max-w-[60%]">
                  <h3 className="font-semibold text-gray-800 truncate">{report.title || "제목 없음"}</h3>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  <span className={`text-xs font-medium ${urgencyColor}`}>{urgencyLabel}</span> |
                  상태: {report.status || "미지정"}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{report.description}</p>

              <div className="mt-2 text-xs text-gray-500 flex gap-2 items-center">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(report.timestamp).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReportsPage;
