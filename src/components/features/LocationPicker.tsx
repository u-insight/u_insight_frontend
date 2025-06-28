"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle,
  AlertCircle,
  Loader,
  MapPinIcon,
} from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useAddress } from "@/hooks/useAddress";
import { AddressSearchModal } from "./AddressSearchModal";
import { AddressData } from "@/services/addressService";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }) => void;
  initialAddress?: string;
  disabled?: boolean;
  required?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialAddress = "",
  disabled = false,
  required = false,
}) => {
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const [searchedAddress, setSearchedAddress] = useState<AddressData | null>(
    null,
  );
  const [selectedMethod, setSelectedMethod] = useState<
    "manual" | "gps" | "search"
  >("manual");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const {
    location,
    address: gpsAddress,
    isLoading: gpsLoading,
    error: gpsError,
    getCurrentLocation,
  } = useLocation();

  const {
    isLoading: searchLoading,
    error: searchError,
    geocodeAddress,
  } = useAddress();

  // 선택된 주소가 변경될 때 부모 컴포넌트에 알림
  useEffect(() => {
    let finalAddress = "";
    let coordinates: {
      latitude?: number;
      longitude?: number;
      accuracy?: number;
    } = {};

    switch (selectedMethod) {
      case "gps":
        if (gpsAddress) {
          finalAddress = gpsAddress.roadAddress || gpsAddress.address;
          if (location) {
            coordinates = {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
            };
          }
        }
        break;
      case "search":
        if (searchedAddress) {
          finalAddress =
            searchedAddress.roadAddress || searchedAddress.fullAddress;
          // 검색된 주소의 좌표를 가져오기
          geocodeAddress(finalAddress).then((coords) => {
            if (coords) {
              onLocationSelect({
                address: finalAddress,
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
            }
          });
          return; // 비동기 처리이므로 여기서 리턴
        }
        break;
      case "manual":
        finalAddress = manualAddress;
        break;
    }

    if (finalAddress) {
      onLocationSelect({
        address: finalAddress,
        ...coordinates,
      });
    }
  }, [selectedMethod, gpsAddress, location, searchedAddress, manualAddress]);

  const handleGPSLocation = async () => {
    setSelectedMethod("gps");
    await getCurrentLocation();
  };

  const handleAddressSearch = () => {
    setSelectedMethod("search");
    setIsAddressModalOpen(true);
  };

  const handleManualInput = (value: string) => {
    setSelectedMethod("manual");
    setManualAddress(value);
  };

  // 주소 검색 모달에서 주소가 선택되었을 때 처리
  const handleAddressSelect = (address: AddressData) => {
    setSearchedAddress(address);
    setIsAddressModalOpen(false);
  };

  const getCurrentAddress = () => {
    switch (selectedMethod) {
      case "gps":
        return gpsAddress ? gpsAddress.roadAddress || gpsAddress.address : "";
      case "search":
        return searchedAddress
          ? searchedAddress.roadAddress || searchedAddress.fullAddress
          : "";
      case "manual":
        return manualAddress;
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    if (gpsLoading || searchLoading) {
      return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
    }

    if (getCurrentAddress()) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    if (gpsError || searchError) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }

    return null;
  };

  const getButtonClass = (method: string, isSelected: boolean) => {
    const baseClass =
      "w-full rounded-lg border-2 p-4 text-left transition-all duration-200 flex items-center gap-3 font-medium";

    if (isSelected) {
      switch (method) {
        case "gps":
          return `${baseClass} border-blue-500 bg-blue-50 text-blue-700 shadow-sm`;
        case "search":
          return `${baseClass} border-purple-500 bg-purple-50 text-purple-700 shadow-sm`;
        default:
          return `${baseClass} border-green-500 bg-green-50 text-green-700 shadow-sm`;
      }
    }

    return `${baseClass} border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50`;
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">위치 정보</h3>
        {getStatusIcon()}
      </div>

      {/* 위치 입력 방법 선택 */}
      <div className="space-y-3">
        {/* GPS 위치 */}
        <button
          className={getButtonClass("gps", selectedMethod === "gps")}
          onClick={handleGPSLocation}
          disabled={disabled || gpsLoading}
        >
          {gpsLoading ? (
            <Loader className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5 text-blue-500" />
          )}
          <div>
            <div className="font-medium">현재 위치 사용</div>
            <div className="text-sm text-gray-500">GPS로 정확한 위치 찾기</div>
          </div>
        </button>

        {/* 주소 검색 */}
        <button
          className={getButtonClass("search", selectedMethod === "search")}
          onClick={handleAddressSearch}
          disabled={disabled || searchLoading}
        >
          {searchLoading ? (
            <Loader className="w-5 h-5 text-purple-500 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-purple-500" />
          )}
          <div>
            <div className="font-medium">주소 검색</div>
            <div className="text-sm text-gray-500">정확한 주소 찾기</div>
          </div>
        </button>

        {/* 직접 입력 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span>직접 입력</span>
          </div>
          <input
            type="text"
            className="w-full p-3 transition-colors bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="주소를 직접 입력하세요"
            value={manualAddress}
            onChange={(e) => handleManualInput(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* 선택된 주소 표시 */}
      {getCurrentAddress() && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div className="flex-1 min-w-0">
              <h4 className="mb-1 font-medium text-green-800">선택된 위치</h4>
              <p className="text-green-700 break-words">
                {getCurrentAddress()}
              </p>

              {/* GPS 정확도 표시 */}
              {selectedMethod === "gps" && location && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">
                      정확도: 약 {Math.round(location.accuracy)}m
                    </span>
                  </div>
                  {location.accuracy > 100 && (
                    <span className="text-sm font-medium text-amber-600">
                      (정확도가 낮습니다)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {(gpsError || searchError) && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
            <p className="font-medium text-red-700">
              {gpsError ||
                searchError ||
                "위치 정보를 가져오는 중 오류가 발생했습니다."}
            </p>
          </div>
        </div>
      )}

      {/* GPS 사용 가이드 */}
      {selectedMethod === "gps" && !location && !gpsLoading && !gpsError && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="flex items-center gap-2 mb-2 font-medium text-blue-900">
            <Navigation className="w-4 h-4" />
            GPS 사용 팁
          </h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• 실외에서 정확도가 더 높습니다</li>
            <li>• 브라우저에서 위치 권한을 허용해주세요</li>
            <li>• Wi-Fi나 모바일 데이터가 필요합니다</li>
          </ul>
        </div>
      )}

      {/* 필수 필드 표시 */}
      {required && !getCurrentAddress() && (
        <p className="text-sm font-medium text-red-500">
          * 위치 정보는 필수 입력 항목입니다.
        </p>
      )}

      {/* 주소 검색 모달 */}
      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
      />
    </div>
  );
};
