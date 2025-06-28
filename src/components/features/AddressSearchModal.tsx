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
        className="absolute inset-0 bg-opacity-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
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
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-50">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                오류가 발생했습니다
              </h3>
              <p className="mb-6 text-gray-600">{error}</p>

              <div className="space-y-3">
                <button
                  onClick={openAddressSearch}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <Search className="w-4 h-4" />
                  다시 시도
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          {!isLoading && !error && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-50">
                <MapPin className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                주소를 검색해주세요
              </h3>
              <p className="mb-6 text-gray-600">
                팝업 창에서 원하는 주소를 선택하세요
              </p>

              <button
                onClick={onClose}
                className="w-full px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
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
