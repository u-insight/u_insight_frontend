import { useState, useCallback } from "react";
import { AddressService, AddressData } from "@/services/addressService";

interface UseAddressReturn {
  selectedAddress: AddressData | null;
  isLoading: boolean;
  error: string | null;
  openAddressSearch: () => Promise<void>;
  clearAddress: () => void;
  geocodeAddress: (
    address: string,
  ) => Promise<{ latitude: number; longitude: number } | null>;
}

export const useAddress = (): UseAddressReturn => {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addressService = AddressService.getInstance();

  const openAddressSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const addressData = await addressService.openAddressSearch();
      setSelectedAddress(addressData);
    } catch (err) {
      if (err instanceof Error && err.message.includes("취소")) {
        // 사용자가 취소한 경우는 에러로 처리하지 않음
        setError(null);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "주소 검색 중 오류가 발생했습니다.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [addressService]);

  const clearAddress = useCallback(() => {
    setSelectedAddress(null);
    setError(null);
  }, []);

  const geocodeAddress = useCallback(
    async (address: string) => {
      try {
        setIsLoading(true);
        const coordinates = await addressService.geocodeAddress(address);
        return coordinates;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "좌표 변환 중 오류가 발생했습니다.",
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [addressService],
  );

  return {
    selectedAddress,
    isLoading,
    error,
    openAddressSearch,
    clearAddress,
    geocodeAddress,
  };
};
