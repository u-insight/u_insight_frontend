"use client";
import { useState } from "react";
import {
  ChevronLeft,
  FileText,
  MapPin,
  Zap,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  MapPinned,
} from "lucide-react";
import { useRouter } from "next/navigation";
import KakaoMap from "@/components/KakaoMap";
import { useReportsStore } from "@/store/useReportsStore";
import { UrgencyLevel_e } from "@/types/report";
import Image from "next/image";

const ReportsPage = () => {
  const router = useRouter();
  const { reports } = useReportsStore();

  const [showMap, setShowMap] = useState(true);
  const [selectedUrgency, setSelectedUrgency] = useState<
    UrgencyLevel_e | "all"
  >("all");

  const center =
    reports.length > 0 && reports[0].coordinates
      ? {
        lat: reports[0].coordinates.lat,
        lng: reports[0].coordinates.lng,
      }
      : { lat: 36.1527, lng: 128.7213 };

  const urgencyStats = {
    urgent: reports.filter((r) => r.urgency === UrgencyLevel_e.Urgent).length,
    normal: reports.filter((r) => r.urgency === UrgencyLevel_e.Normal).length,
    low: reports.filter((r) => r.urgency === UrgencyLevel_e.Low).length,
  };

  const filteredReports =
    selectedUrgency === "all"
      ? reports
      : reports.filter((r) => r.urgency === selectedUrgency);

  const getUrgencyConfig = (urgency: UrgencyLevel_e) => {
    switch (urgency) {
      case UrgencyLevel_e.Urgent:
        return {
          icon: Zap,
          label: "긴급",
          color: "#EF4444",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
        };
      case UrgencyLevel_e.Normal:
        return {
          icon: AlertTriangle,
          label: "보통",
          color: "#F59E0B",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
        };
      case UrgencyLevel_e.Low:
        return {
          icon: Clock,
          label: "낮음",
          color: "#10B981",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">신고 현황</h1>
            <p className="text-sm text-gray-500">총 {reports.length}건</p>
          </div>
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${showMap
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <MapPinned className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 w-full max-w-4xl px-4 py-6 mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[UrgencyLevel_e.Urgent, UrgencyLevel_e.Normal, UrgencyLevel_e.Low].map(
            (urgency) => {
              const config = getUrgencyConfig(urgency);
              const Icon = config.icon;
              const count =
                urgency === UrgencyLevel_e.Urgent
                  ? urgencyStats.urgent
                  : urgency === UrgencyLevel_e.Normal
                    ? urgencyStats.normal
                    : urgencyStats.low;

              return (
                <div
                  key={urgency}
                  className={`${config.bgColor} ${config.borderColor} rounded-lg border p-3 text-center`}
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: config.color }}
                  />
                  <div className="font-medium text-gray-900">{config.label}</div>
                  <div className="text-sm text-gray-600">{count}건</div>
                </div>
              );
            }
          )}
        </div>

        {/* 필터 */}
        <div className="p-4 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">필터</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedUrgency("all")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors whitespace-nowrap ${selectedUrgency === "all"
                ? "border border-blue-200 bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              전체 ({reports.length})
            </button>
            {[UrgencyLevel_e.Urgent, UrgencyLevel_e.Normal, UrgencyLevel_e.Low].map(
              (urgency) => {
                const config = getUrgencyConfig(urgency);
                const count =
                  urgency === UrgencyLevel_e.Urgent
                    ? urgencyStats.urgent
                    : urgency === UrgencyLevel_e.Normal
                      ? urgencyStats.normal
                      : urgencyStats.low;

                return (
                  <button
                    key={urgency}
                    onClick={() => setSelectedUrgency(urgency)}
                    className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${selectedUrgency === urgency
                      ? `${config.bgColor} ${config.textColor} border ${config.borderColor}`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              }
            )}
          </div>
        </div>


        {showMap ? (
          <div className="overflow-hidden bg-white border shadow-sm rounded-xl">
            <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">지도 보기</h3>
            </div>
            <div className="relative h-80">
              <KakaoMap reports={reports} center={center} />
            </div>
          </div>
        ) : (
          <div className="mb-20 overflow-hidden bg-white border shadow-sm rounded-xl">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                신고 목록 ({filteredReports.length}건)
              </h3>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">
                  신고가 없습니다
                </h4>
                <p className="mb-4 text-gray-600">아직 등록된 신고가 없습니다.</p>
                <button
                  onClick={() => router.push("/reports/new")}
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  첫 신고 작성하기
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredReports
                  .slice()
                  .reverse()
                  .map((report, index) => {
                    const config = getUrgencyConfig(report.urgency);
                    const Icon = config.icon;

                    return (
                      <div
                        key={`${report.id}-${index}`}
                        className="p-4 transition-colors cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/reports/${report.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`${config.bgColor} flex-shrink-0 rounded-lg p-2`}>
                            <Icon className="w-5 h-5" style={{ color: config.color }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 truncate">
                                {report.title || "제목 없음"}
                              </h4>
                              <span
                                className={`ml-2 flex-shrink-0 rounded px-2 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}
                              >
                                {config.label}
                              </span>
                            </div>

                            <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{report.location}</span>
                              </div>
                            </div>

                            {report.images && report.images.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {report.images.slice(0, 3).map((img, i) => (
                                  <div
                                    key={i}
                                    className="relative w-12 h-12 overflow-hidden border border-gray-200 rounded-lg"
                                  >
                                    <Image
                                      src={
                                        typeof img === "string"
                                          ? img
                                          : URL.createObjectURL(img)
                                      }
                                      fill
                                      alt={`신고 이미지 ${i + 1}`}
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                                {report.images.length > 3 && (
                                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg">
                                    <span className="text-xs text-gray-600">
                                      +{report.images.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={() => router.push("/reports/new")}
            className="flex items-center justify-center w-full gap-2 px-6 py-4 font-semibold text-white bg-blue-500 shadow-lg rounded-xl hover:bg-blue-600 hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            {"새 신고 작성하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
