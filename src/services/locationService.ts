export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeocodingResult {
  address: string;
  roadAddress: string;
  region1depth: string; // 시도
  region2depth: string; // 시군구
  region3depth: string; // 읍면동
  buildingName?: string;
}

export class LocationService {
  private static instance: LocationService;
  private watchIds: Map<number, number> = new Map();
  private nextWatchId: number = 1;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // 현재 위치 가져오기
  public async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("이 브라우저에서는 위치 서비스를 지원하지 않습니다."));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage = "위치 정보를 가져올 수 없습니다.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "위치 정보를 사용할 수 없습니다. GPS가 켜져있는지 확인해주세요.";
              break;
            case error.TIMEOUT:
              errorMessage =
                "위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.";
              break;
          }

          reject(new Error(errorMessage));
        },
        options,
      );
    });
  }

  // 위치 추적 시작
  public watchLocation(
    successCallback: (location: LocationData) => void,
    errorCallback: (error: Error) => void,
  ): number {
    if (!navigator.geolocation) {
      errorCallback(
        new Error("이 브라우저에서는 위치 서비스를 지원하지 않습니다."),
      );
      return -1;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1분
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        successCallback(locationData);
      },
      (error) => {
        let errorMessage = "위치 추적 중 오류가 발생했습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
        }

        errorCallback(new Error(errorMessage));
      },
      options,
    );

    const id = this.nextWatchId++;
    this.watchIds.set(id, watchId);
    return id;
  }

  // 위치 추적 중지
  public stopWatchingLocation(watchId: number): void {
    const nativeWatchId = this.watchIds.get(watchId);
    if (nativeWatchId !== undefined) {
      navigator.geolocation.clearWatch(nativeWatchId);
      this.watchIds.delete(watchId);
    }
  }

  // 좌표를 주소로 변환 (역지오코딩)
  public async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodingResult> {
    try {
      // Kakao Map API를 사용한 역지오코딩
      const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

      if (!KAKAO_API_KEY) {
        throw new Error("Kakao API 키가 설정되지 않았습니다.");
      }

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("역지오코딩 API 호출 실패");
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const document = data.documents[0];
        const roadAddress = document.road_address;
        const jibunAddress = document.address;

        return {
          address: jibunAddress.address_name,
          roadAddress: roadAddress
            ? roadAddress.address_name
            : jibunAddress.address_name,
          region1depth: jibunAddress.region_1depth_name,
          region2depth: jibunAddress.region_2depth_name,
          region3depth: jibunAddress.region_3depth_name,
          buildingName: roadAddress?.building_name,
        };
      }

      throw new Error("주소 정보를 찾을 수 없습니다.");
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  }

  // 두 좌표 간의 거리 계산 (미터 단위)
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
