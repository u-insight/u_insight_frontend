"use client";
import { useState } from "react";
import { ChevronLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import KakaoMap from "@/components/KakaoMap";
import { useReportsStore } from "@/store/useReportsStore";

const colors = {
  red: "#FF4500",
  yellow: "#FFD700",
  green: "#3CB371",
};

const ReportsPage = () => {
  const router = useRouter();
  const { reports } = useReportsStore();
  console.log("reports in AdminMapPage:", reports);

  const [showMap, setShowMap] = useState(true);
  const center = reports[0].coordinates
    ? { lat: reports[0].coordinates.lat, lng: reports[0].coordinates.lng }
    : { lat: 36.1527, lng: 128.7213 };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          {/* 첫번째 버튼: reports/new 페이지로 이동 */}
          <button
            onClick={() => router.push("/reports/new")}
            className="bg-opacity-20 rounded-lg bg-white p-3"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <h1 className="text-2xl font-black">지도 보기</h1>

          {/* 두번째 버튼: 지도 켜고 끄기 토글 */}
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="bg-opacity-20 rounded-lg bg-white p-3"
          >
            <FileText className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* 지도 영역 - showMap이 true일 때만 렌더 */}
      {showMap && (
        <div className="h-96 border-b-4 border-gray-300 p-4">
          <KakaoMap reports={reports} center={center} />
        </div>
      )}

      {/* 범례 */}
      <div className="bg-white p-8">
        <h3 className="mb-6 text-2xl font-black text-gray-900">범례</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-6 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: colors.red }}
            />
            <span className="text-xl font-bold">긴급</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-6 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: colors.yellow }}
            />
            <span className="text-xl font-bold">보통</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-6 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: colors.green }}
            />
            <span className="text-xl font-bold">낮음</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
