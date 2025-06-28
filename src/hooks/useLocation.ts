import { useState, useEffect, useCallback } from "react";
import {
  LocationService,
  LocationData,
  GeocodingResult,
} from "@/services/locationService";

interface UseLocationReturn {
  location: LocationData | null;
  address: GeocodingResult | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  startWatching: () => void;
  stopWatching: () => void;
  isWatching: boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number>(-1);
  const [isWatching, setIsWatching] = useState(false);

  const locationService = LocationService.getInstance();

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);

      // 좌표를 주소로 변환
      try {
        const addressData = await locationService.reverseGeocode(
          locationData.latitude,
          locationData.longitude,
        );
        setAddress(addressData);
      } catch (geocodingError) {
        console.warn("주소 변환 실패:", geocodingError);
        // 위치는 성공했지만 주소 변환만 실패한 경우
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "위치 정보를 가져올 수 없습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [locationService]);

  const startWatching = useCallback(() => {
    if (isWatching) return;

    const id = locationService.watchLocation(
      (locationData) => {
        setLocation(locationData);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
    );

    setWatchId(id);
    setIsWatching(true);
  }, [locationService, isWatching]);

  const stopWatching = useCallback(() => {
    if (watchId !== -1) {
      locationService.stopWatchingLocation(watchId);
      setWatchId(-1);
      setIsWatching(false);
    }
  }, [locationService, watchId]);

  // 컴포넌트 언마운트 시 위치 추적 중지
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    address,
    isLoading,
    error,
    getCurrentLocation,
    startWatching,
    stopWatching,
    isWatching,
  };
};
