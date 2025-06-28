"use client";

import { useState, useEffect } from "react";
import { X, Search, MapPin, Loader } from "lucide-react";
import { useAddress } from "@/hooks/useAddress";
import { AddressData } from "@/services/addressService";

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: AddressData) => void;
  title?: string;
}

export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  isOpen,
  onClose,
  onAddressSelect,
  title = "주소 검색",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { selectedAddress, isLoading, error, openAddressSearch } = useAddress();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 모달이 열리면 자동으로 주소 검색 시작
      openAddressSearch();
    } else {
      setIsVisible(false);
    }
  }, [isOpen, openAddressSearch]);

  useEffect(() => {
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
      onClose();
    }
  }, [selectedAddress, onAddressSelect, onClose]);

  useEffect(() => {
    // 에러가 발생하면 모달 닫기
    if (error && error.includes("취소")) {
      onClose();
    }
  }, [error, onClose]);

  // 모달이 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-black backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                주소 검색 준비 중
              </h3>
              <p className="text-gray-600">잠시만 기다려주세요...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !error.includes("취소") && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                오류가 발생했습니다
              </h3>
              <p className="mb-6 text-gray-600">{error}</p>

              <div className="space-y-3">
                <button
                  onClick={openAddressSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <Search className="h-4 w-4" />
                  다시 시도
                </button>

                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          {!isLoading && !error && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                주소를 검색해주세요
              </h3>
              <p className="mb-6 text-gray-600">
                팝업 창에서 원하는 주소를 선택하세요
              </p>

              <button
                onClick={onClose}
                className="w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// "use client";

// import { useState, useEffect } from "react";
// import { X, Search, MapPin } from "lucide-react";
// import { useAddress } from "@/hooks/useAddress";
// import { AddressData } from "@/services/addressService";

// interface AddressSearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddressSelect: (address: AddressData) => void;
//   title?: string;
// }

// export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
//   isOpen,
//   onClose,
//   onAddressSelect,
//   title = "주소 검색",
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const { selectedAddress, isLoading, error, openAddressSearch } = useAddress();

//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//       // 모달이 열리면 자동으로 주소 검색 시작
//       openAddressSearch();
//     } else {
//       setIsVisible(false);
//     }
//   }, [isOpen, openAddressSearch]);

//   useEffect(() => {
//     if (selectedAddress) {
//       onAddressSelect(selectedAddress);
//       onClose();
//     }
//   }, [selectedAddress, onAddressSelect, onClose]);

//   useEffect(() => {
//     // 에러가 발생하면 모달 닫기
//     if (error && error.includes("취소")) {
//       onClose();
//     }
//   }, [error, onClose]);

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* 배경 오버레이 */}
//       <div
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={onClose}
//       />

//       {/* 모달 콘텐츠 */}
//       <div className="relative w-full max-w-md mx-4">
//         <div>
//           {/* 헤더 */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-black text-gray-900 lg:text-xl">
//               {title}
//             </h2>
//             <button
//               onClick={onClose}
//               className="p-2 transition-colors rounded-lg hover:bg-gray-100"
//               aria-label="닫기"
//             >
//               <X className="w-6 h-6 text-gray-500" />
//             </button>
//           </div>

//           {/* 로딩 상태 */}
//           {isLoading && (
//             <div className="py-8 text-center">
//               <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full border-green-primary animate-spin"></div>
//               <p className="text-lg font-bold text-gray-600">
//                 주소 검색 준비 중...
//               </p>
//             </div>
//           )}

//           {/* 에러 상태 */}
//           {error && !error.includes("취소") && (
//             <div className="py-8 text-center">
//               <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
//                 <X className="w-8 h-8 text-red-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-black text-gray-900">
//                 오류가 발생했습니다
//               </h3>
//               <p className="mb-6 text-lg font-bold text-gray-600">{error}</p>

//               <div className="space-y-3">
//                 <button onClick={openAddressSearch}>
//                   <Search className="w-5 h-5 mr-2" />
//                   다시 시도
//                 </button>

//                 <button onClick={onClose}>취소</button>
//               </div>
//             </div>
//           )}

//           {/* 안내 메시지 */}
//           {!isLoading && !error && (
//             <div className="py-8 text-center">
//               <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
//                 <MapPin className="w-8 h-8 text-green-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-black text-gray-900">
//                 주소를 검색해주세요
//               </h3>
//               <p className="mb-6 text-lg font-bold text-gray-600">
//                 팝업 창에서 원하는 주소를 선택하세요
//               </p>

//               <button onClick={onClose}>취소</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
