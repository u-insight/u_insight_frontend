"use client";

import Image from "next/image";
import {
  ChevronLeft,
  Plus,
  AlertTriangle,
  Clock,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UrgencyLevel_e } from "../../../types/report";
import { LocationPicker } from "../../../components/features/LocationPicker";
import { ReportData, useReportsStore } from "../../../store/useReportsStore";

export default function ReportsNew() {
  const [formData, setFormData] = useState<ReportData>({
    id: "",
    title: "",
    description: "",
    location: "",
    urgency: UrgencyLevel_e.Normal,
    images: [],
  });

  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();
  const { addReport } = useReportsStore();

  const handleLocationSelect = (location: {
    address: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      location: location.address,
      coordinates:
        location.latitude && location.longitude
          ? {
            lat: location.latitude,
            lng: location.longitude,
          }
          : undefined,
    }));
  };

  const handleUrgencySelect = (urgency: UrgencyLevel_e) => {
    setFormData((prev) => ({ ...prev, urgency }));
  };

  const handleImageUpload = (files: File[]) => {
    setFormData((prev) => {
      return { ...prev, images: prev.images.concat(files) };
    });
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError("문제 설명을 입력해주세요.");
      return false;
    }
    if (!formData.location.trim()) {
      setError("위치 정보를 선택해주세요.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: API 호출 로직 구현
      console.log("제출할 데이터:", formData);

      // 임시로 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const reportId = Date.now(); // 임시 ID

      addReport({ ...formData });
      router.push(`/reports`);
    } catch (error) {
      setError("신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // 현재 인덱스 조정
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentImageIndex >= formData.images.length - 1) {
      setCurrentImageIndex(Math.max(0, formData.images.length - 2));
    }
  };

  const getUrgencyConfig = (urgencyType: UrgencyLevel_e) => {
    switch (urgencyType) {
      case UrgencyLevel_e.Urgent:
        return {
          icon: Zap,
          label: "긴급",
          baseColor: "border-red-200 text-red-600 bg-red-50",
          selectedColor:
            "border-red-500 text-red-700 bg-red-100 shadow-red-100",
        };
      case UrgencyLevel_e.Normal:
        return {
          icon: AlertTriangle,
          label: "보통",
          baseColor: "border-amber-200 text-amber-600 bg-amber-50",
          selectedColor:
            "border-amber-500 text-amber-700 bg-amber-100 shadow-amber-100",
        };
      case UrgencyLevel_e.Low:
        return {
          icon: Clock,
          label: "낮음",
          baseColor: "border-green-200 text-green-600 bg-green-50",
          selectedColor:
            "border-green-500 text-green-700 bg-green-100 shadow-green-100",
        };
      default:
        return {
          icon: AlertTriangle,
          label: "보통",
          baseColor: "border-gray-200 text-gray-600 bg-gray-50",
          selectedColor: "border-gray-500 text-gray-700 bg-gray-100",
        };
    }
  };

  const getUrgencyButtonClass = (urgencyType: UrgencyLevel_e) => {
    const config = getUrgencyConfig(urgencyType);
    const isSelected = formData.urgency === urgencyType;

    return `relative rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${isSelected
      ? `${config.selectedColor} shadow-lg`
      : `${config.baseColor} hover:border-gray-300`
      }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">문제 신고하기</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-2xl px-4 py-6 mx-auto space-y-8">
        {/* 헤더 섹션 */}
        <div className="py-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-500 shadow-lg rounded-2xl shadow-blue-500/20">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            어떤 문제가 있나요?
          </h2>
          <p className="text-gray-600">
            문제를 상세히 설명해주시면 빠르게 해결하겠습니다
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 border border-red-200 rounded-xl bg-red-50">
            <p className="font-medium text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* 문제 설명 */}
        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <label className="block mb-3 text-lg font-semibold text-gray-900">
            문제 설명
          </label>
          <textarea
            className="w-full h-32 p-4 transition-all border border-gray-200 rounded-lg resize-none focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="예: 가로등이 고장났어요. 밤에 너무 어두워서 위험해요."
            value={formData.description}
            onChange={(e) => {
              if (e.target.value.length > 500) {
                return;
              }

              setFormData((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
          <div className="mt-2 text-sm text-gray-500">
            {formData.description.length}/500자
          </div>
        </div>

        {/* 위치 정보 */}
        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialAddress={formData.location}
            required={true}
          />
        </div>

        {/* 긴급도 */}
        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <label className="block mb-4 text-lg font-semibold text-gray-900">
            긴급도
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              UrgencyLevel_e.Urgent,
              UrgencyLevel_e.Normal,
              UrgencyLevel_e.Low,
            ].map((urgency) => {
              const config = getUrgencyConfig(urgency);
              const Icon = config.icon;
              return (
                <button
                  key={urgency}
                  className={getUrgencyButtonClass(urgency)}
                  onClick={() => handleUrgencySelect(urgency)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 사진 첨부 */}
        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <label className="block mb-4 text-lg font-semibold text-gray-900">
            사진 첨부
            <span className="font-normal text-gray-500">(선택사항)</span>
          </label>

          {formData.images.length === 0 ? (
            // 빈 상태일 때 업로드 영역
            <label htmlFor="image-upload">
              <div className="p-8 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-gray-400 hover:bg-gray-50">
                <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-600">사진을 추가하세요</p>
                <p className="mt-1 text-sm text-gray-500">최대 5장까지 가능</p>
              </div>
            </label>
          ) : (
            // 이미지가 있을 때 캐러셀 UI
            <ImageCarousel
              images={formData.images}
              onRemoveImage={removeImage}
              onAddMore={() => document.getElementById("image-upload")?.click()}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
            />
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload"
            onChange={(e) => {
              if (e.target.files) {
                handleImageUpload(Array.from(e.target.files));
              }
            }}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="sticky bottom-0 pt-4 pb-6 bg-gray-50">
          <button
            className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-blue-500 shadow-lg rounded-xl hover:bg-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                신고 접수 중...
              </div>
            ) : (
              "신고하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 이미지 캐러셀 컴포넌트
const ImageCarousel = ({
  images,
  onRemoveImage,
  onAddMore,
  currentIndex,
  setCurrentIndex,
}: {
  images: File[];
  onRemoveImage: (index: number) => void;
  onAddMore: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}) => {
  let touchStart: number | null = null;
  let touchEnd: number | null = null;

  // 스와이프 감지를 위한 최소 거리
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd = null;
    touchStart = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* 메인 이미지 영역 */}
      <div className="relative">
        <div
          className="relative overflow-hidden bg-gray-100 border-2 border-gray-200 h-80 rounded-xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={URL.createObjectURL(images[currentIndex])}
            fill
            alt={`첨부 이미지 ${currentIndex + 1}`}
            className="object-contain"
          />

          {/* 삭제 버튼 */}
          <button
            onClick={() => onRemoveImage(currentIndex)}
            className="absolute flex items-center justify-center w-10 h-10 text-white transition-colors bg-red-500 rounded-full shadow-lg top-3 right-3 hover:bg-red-600"
            aria-label={`이미지 ${currentIndex + 1} 삭제`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* 이미지 번호 표시 */}
          <div className="absolute px-3 py-1 text-sm font-medium text-white bg-black rounded-full bg-opacity-60 top-3 left-3">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 좌우 네비게이션 버튼 */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute flex items-center justify-center w-12 h-12 transition-all -translate-y-1/2 bg-white rounded-full shadow-lg bg-opacity-90 hover:bg-opacity-100 top-1/2 left-3 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className="absolute flex items-center justify-center w-12 h-12 transition-all -translate-y-1/2 bg-white rounded-full shadow-lg bg-opacity-90 hover:bg-opacity-100 top-1/2 right-3 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="다음 이미지"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 썸네일 네비게이션 + 추가 버튼 */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
        {/* 기존 이미지 썸네일들 */}
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${currentIndex === index
              ? "border-blue-500 shadow-md"
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <Image
              src={URL.createObjectURL(image)}
              fill
              alt={`썸네일 ${index + 1}`}
              className="object-cover"
            />
          </button>
        ))}

        {/* 추가 버튼 */}
        {images.length < 5 && (
          <button
            onClick={onAddMore}
            className="flex items-center justify-center flex-shrink-0 w-16 h-16 transition-all bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 hover:bg-gray-200"
            aria-label="사진 추가"
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </button>
        )}
      </div>

      {/* 도움말 텍스트 */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>좌우로 스와이프하여 사진을 넘겨보세요</span>
        <span>{images.length}/5장</span>
      </div>
    </div>
  );
};
