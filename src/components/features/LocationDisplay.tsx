"use client";

import React from "react";
import { MapPin, Clock, Target } from "lucide-react";
import { LocationData, GeocodingResult } from "@/services/locationService";

interface LocationDisplayProps {
  location: LocationData;
  address?: GeocodingResult;
  showAccuracy?: boolean;
  showTimestamp?: boolean;
  onMapView?: () => void;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  address,
  showAccuracy = true,
  showTimestamp = true,
  onMapView,
}) => {
  const formatAccuracy = (accuracy: number) => {
    if (accuracy < 10) return "매우 정확";
    if (accuracy < 50) return "정확";
    if (accuracy < 100) return "보통";
    return "부정확";
  };


  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div>
      <div className="space-y-4">
        {/* 주소 정보 */}
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 mt-1 text-green-primary" />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-black text-gray-900">위치</h3>
            {address ? (
              <div className="space-y-1">
                <p className="text-base font-bold text-gray-800">
                  {address.roadAddress || address.address}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  {address.region1depth} {address.region2depth}{" "}
                  {address.region3depth}
                </p>
              </div>
            ) : (
              <p className="text-base font-bold text-gray-600">
                위도: {location.latitude.toFixed(6)}, 경도:{" "}
                {location.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* 정확도 및 시간 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 정확도 */}
            {showAccuracy && (
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-bold text-gray-600">
                  {formatAccuracy(location.accuracy)}
                </span>
                {/* <ResponsiveBadge
                  type="status"
                  value="pending" // 임시로 사용, 실제로는 accuracy 기반 커스텀 배지 필요
                  size="sm"
                  className={`${
                    getAccuracyColor(location.accuracy) === "green"
                      ? "bg-green-primary text-white"
                      : getAccuracyColor(location.accuracy) === "yellow"
                        ? "bg-yellow-primary text-black"
                        : "bg-red-primary text-white"
                  }`}
                /> */}
              </div>
            )}

            {/* 시간 정보 */}
            {showTimestamp && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-bold text-gray-600">
                  {formatTimestamp(location.timestamp)}
                </span>
              </div>
            )}
          </div>

          {/* 지도 보기 버튼 */}
          {onMapView && (
            <button
              onClick={onMapView}
              className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              📍 지도에서 보기
            </button>
          )}
        </div>

        {/* 정확도 상세 정보 */}
        {showAccuracy && location.accuracy > 100 && (
          <div className="p-3 border-2 border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm font-bold text-yellow-800">
              ⚠️ 위치 정확도가 낮습니다 (±{Math.round(location.accuracy)}m).
              실외에서 다시 시도하거나 Wi-Fi를 활성화해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
