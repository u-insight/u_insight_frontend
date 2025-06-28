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

interface FormData {
  title: string;
  description: string;
  location: string;
  urgency: UrgencyLevel_e;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: File[];
}

export default function ReportsNew() {
  const [formData, setFormData] = useState<FormData>({
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

      const reportId = Date.now(); // 임시 ID
      router.push(`/reports/${reportId}`);
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

    return `relative rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
      isSelected
        ? `${config.selectedColor} shadow-lg`
        : `${config.baseColor} hover:border-gray-300`
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">문제 신고하기</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
        {/* 헤더 섹션 */}
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20">
            <Plus className="h-8 w-8 text-white" />
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
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* 문제 설명 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-3 block text-lg font-semibold text-gray-900">
            문제 설명
          </label>
          <textarea
            className="h-32 w-full resize-none rounded-lg border border-gray-200 p-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialAddress={formData.location}
            required={true}
          />
        </div>

        {/* 긴급도 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-4 block text-lg font-semibold text-gray-900">
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
                    <Icon className="h-6 w-6" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 사진 첨부 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-4 block text-lg font-semibold text-gray-900">
            사진 첨부{" "}
            <span className="font-normal text-gray-500">(선택사항)</span>
          </label>

          {formData.images.length === 0 ? (
            // 빈 상태일 때 업로드 영역
            <label htmlFor="image-upload">
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-gray-400 hover:bg-gray-50">
                <Plus className="mx-auto mb-3 h-8 w-8 text-gray-400" />
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

        {/* <div className="p-6 bg-white border shadow-sm rounded-xl">
          <label className="block mb-4 text-lg font-semibold text-gray-900">
            사진 첨부
            <span className="font-normal text-gray-500">(선택사항)</span>
          </label>

          <label htmlFor="image-upload">
            <div className="p-8 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-gray-400 hover:bg-gray-50">
              <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="font-medium text-gray-600">사진을 추가하세요</p>
              <p className="mt-1 text-sm text-gray-500">최대 5장까지 가능</p>
            </div>
          </label>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden border border-gray-200 rounded-lg group aspect-square"
                >
                  <Image
                    src={URL.createObjectURL(image)}
                    fill
                    alt="첨부 이미지 미리보기"
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute flex items-center justify-center w-6 h-6 text-sm text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
        </div> */}

        {/* 제출 버튼 */}
        <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6">
          <button
            className="w-full rounded-xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
          className="relative h-80 overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100"
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
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
            aria-label={`이미지 ${currentIndex + 1} 삭제`}
          >
            <X className="h-5 w-5" />
          </button>

          {/* 이미지 번호 표시 */}
          <div className="bg-opacity-60 absolute top-3 left-3 rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 좌우 네비게이션 버튼 */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="bg-opacity-90 hover:bg-opacity-100 absolute top-1/2 left-3 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className="bg-opacity-90 hover:bg-opacity-100 absolute top-1/2 right-3 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 썸네일 네비게이션 + 추가 버튼 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* 기존 이미지 썸네일들 */}
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              currentIndex === index
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
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-all hover:border-gray-400 hover:bg-gray-200"
            aria-label="사진 추가"
          >
            <Plus className="h-6 w-6 text-gray-500" />
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

// "use client";

// import Image from "next/image";
// import { ChevronLeft, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { UrgencyLevel_e } from "../../../types/report";
// import { LocationPicker } from "../../../components/features/LocationPicker";

// interface FormData {
//   title: string;
//   description: string;
//   location: string;
//   urgency: UrgencyLevel_e;
//   coordinates?: {
//     lat: number;
//     lng: number;
//   };
//   images: File[];
// }

// export default function ReportsNew() {
//   const [formData, setFormData] = useState<FormData>({
//     title: "",
//     description: "",
//     location: "",
//     urgency: UrgencyLevel_e.Normal,
//     images: [],
//   });

//   const [error, setError] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const router = useRouter();

//   const handleLocationSelect = (location: {
//     address: string;
//     latitude?: number;
//     longitude?: number;
//     accuracy?: number;
//   }) => {
//     setFormData((prev) => ({
//       ...prev,
//       location: location.address,
//       coordinates:
//         location.latitude && location.longitude
//           ? {
//               lat: location.latitude,
//               lng: location.longitude,
//             }
//           : undefined,
//     }));
//   };

//   const handleUrgencySelect = (urgency: UrgencyLevel_e) => {
//     setFormData((prev) => ({ ...prev, urgency }));
//   };

//   const handleImageUpload = (files: File[]) => {
//     setFormData((prev) => {
//       return { ...prev, images: prev.images.concat(files) };
//     });
//   };

//   const validateForm = () => {
//     if (!formData.description.trim()) {
//       setError("문제 설명을 입력해주세요.");
//       return false;
//     }
//     if (!formData.location.trim()) {
//       setError("위치 정보를 선택해주세요.");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       // TODO: API 호출 로직 구현
//       console.log("제출할 데이터:", formData);

//       // 임시로 성공 시뮬레이션
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const reportId = Date.now(); // 임시 ID
//       router.push(`/reports/${reportId}`);
//     } catch (error) {
//       setError("신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getUrgencyButtonClass = (urgencyType: UrgencyLevel_e) => {
//     const baseClass =
//       "rounded-xl border-4 p-6 text-xl font-black shadow-lg transition-all";
//     const isSelected = formData.urgency === urgencyType;

//     switch (urgencyType) {
//       case UrgencyLevel_e.Urgent:
//         return `${baseClass} ${isSelected ? "bg-red-primary border-red-secondary text-white" : "bg-white border-red-primary text-red-primary"}`;
//       case UrgencyLevel_e.Normal:
//         return `${baseClass} ${isSelected ? "bg-yellow-primary border-yellow-secondary text-black" : "bg-white border-yellow-primary text-yellow-600"}`;
//       case UrgencyLevel_e.Low:
//         return `${baseClass} ${isSelected ? "bg-green-primary border-green-secondary text-white" : "bg-white border-green-primary text-green-primary"}`;
//       default:
//         return baseClass;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6 text-white bg-green-primary">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => router.back()}
//             className="p-3 transition-all bg-white rounded-lg bg-opacity-20 active:scale-95"
//           >
//             <ChevronLeft className="w-8 h-8" />
//           </button>
//           <h1 className="text-2xl font-black">문제 신고하기</h1>
//           <div className="w-14"></div>
//         </div>
//       </div>

//       <div className="p-8 space-y-8">
//         <div className="text-center">
//           <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-lg bg-red-primary">
//             <Plus className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-3xl font-black text-gray-900">
//             어떤 문제인가요?
//           </h2>
//         </div>

//         {/* 에러 메시지 */}
//         {error && (
//           <div className="p-4 border-4 border-red-200 rounded-xl bg-red-50">
//             <p className="text-lg font-bold text-red-600">⚠️ {error}</p>
//           </div>
//         )}

//         <div>
//           <label className="block mb-4 text-2xl font-black text-gray-900">
//             문제 설명
//           </label>
//           <textarea
//             className="w-full h-40 p-6 text-xl font-bold bg-white border-4 border-gray-400 rounded-xl focus:border-green-600 focus:outline-none"
//             placeholder="예: 가로등이 고장났어요. 밤에 너무 어두워서 위험해요."
//             value={formData.description}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, description: e.target.value }))
//             }
//           />
//         </div>

//         <div>
//           <label className="block mb-4 text-2xl font-black text-gray-900">
//             위치
//           </label>
//           <LocationPicker
//             onLocationSelect={handleLocationSelect}
//             initialAddress={formData.location}
//             required={true}
//           />
//         </div>

//         <div>
//           <label className="block mb-4 text-2xl font-black text-gray-900">
//             긴급도
//           </label>
//           <div className="grid grid-cols-3 gap-4">
//             <button
//               className={getUrgencyButtonClass(UrgencyLevel_e.Urgent)}
//               onClick={() => handleUrgencySelect(UrgencyLevel_e.Urgent)}
//             >
//               긴급
//             </button>
//             <button
//               className={getUrgencyButtonClass(UrgencyLevel_e.Normal)}
//               onClick={() => handleUrgencySelect(UrgencyLevel_e.Normal)}
//             >
//               보통
//             </button>
//             <button
//               className={getUrgencyButtonClass(UrgencyLevel_e.Low)}
//               onClick={() => handleUrgencySelect(UrgencyLevel_e.Low)}
//             >
//               낮음
//             </button>
//           </div>
//         </div>

//         <div>
//           <label className="block mb-4 text-2xl font-black text-gray-900">
//             사진 첨부 (선택)
//           </label>

//           <label htmlFor="image-upload">
//             <div className="w-full p-10 text-center transition-colors bg-white border-4 border-gray-400 border-dashed shadow-lg cursor-pointer rounded-xl hover:border-green-600">
//               <Plus className="w-10 h-10 mx-auto mb-3 text-gray-600" />
//               <p className="text-xl font-bold text-gray-600">
//                 사진을 추가하세요
//               </p>
//             </div>
//           </label>

//           {formData.images.length > 0 && (
//             <div className="grid h-10 grid-cols-3 gap-4 mt-4">
//               {formData.images.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative w-full h-20 bg-gray-100 border-2 border-gray-300 rounded-lg"
//                 >
//                   <Image
//                     src={URL.createObjectURL(image)}
//                     fill
//                     alt="첨부 이미지 미리보기"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             className="hidden"
//             id="image-upload"
//             onChange={(e) => {
//               if (e.target.files) {
//                 handleImageUpload(Array.from(e.target.files));
//               }
//             }}
//           />
//         </div>

//         <button
//           className="w-full p-6 mt-4 text-2xl font-black text-white transition-all border-4 shadow-xl bg-green-primary border-green-secondary rounded-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "신고 접수 중..." : "신고하기"}
//         </button>
//       </div>
//     </div>
//   );
// }
