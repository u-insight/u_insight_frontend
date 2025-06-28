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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.push("/reports/new")}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
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
            <MapPinned className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6">
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
                    className="mx-auto mb-2 h-6 w-6"
                    style={{ color: config.color }}
                  />
                  <div className="font-medium text-gray-900">{config.label}</div>
                  <div className="text-sm text-gray-600">{count}건</div>
                </div>
              );
            }
          )}
        </div>

        {showMap ? (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="border-b bg-gray-50 p-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">지도 보기</h3>
            </div>
            <div className="relative h-80">
              <KakaoMap reports={reports} center={center} />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">필터</h3>
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
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

            <div className="mb-20 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="border-b bg-gray-50 p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  신고 목록 ({filteredReports.length}건)
                </h3>
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="mb-2 text-lg font-medium text-gray-900">
                    신고가 없습니다
                  </h4>
                  <p className="mb-4 text-gray-600">아직 등록된 신고가 없습니다.</p>
                  <button
                    onClick={() => router.push("/reports/new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
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
                          className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
                          onClick={() => router.push(`/reports/${report.id}`)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`${config.bgColor} flex-shrink-0 rounded-lg p-2`}>
                              <Icon className="h-5 w-5" style={{ color: config.color }} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex items-start justify-between">
                                <h4 className="truncate font-medium text-gray-900">
                                  {report.title || "제목 없음"}
                                </h4>
                                <span
                                  className={`ml-2 flex-shrink-0 rounded px-2 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}
                                >
                                  {config.label}
                                </span>
                              </div>

                              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                                {report.description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{report.location}</span>
                                </div>
                              </div>

                              {report.images && report.images.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                  {report.images.slice(0, 3).map((img, i) => (
                                    <div
                                      key={i}
                                      className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200"
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
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
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
          </>
        )}

        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={() => router.push("/reports/new")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg hover:bg-blue-600 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            새 신고 작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
