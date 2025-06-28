export interface AddressData {
  fullAddress: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  roadname?: string;
  buildingName?: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
}

export class AddressService {
  private static instance: AddressService;

  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }
    return AddressService.instance;
  }

  // Daum(Kakao) 주소 검색 API 사용
  public async openAddressSearch(): Promise<AddressData> {
    return new Promise((resolve, reject) => {
      // 1. 우선 Daum 주소 검색 라이브러리 로드
      if (!window.daum || !window.daum.Postcode) {
        this.loadDaumPostcodeScript()
          .then(() => this.executeDaumPostcode(resolve, reject))
          .catch(reject);
      } else {
        this.executeDaumPostcode(resolve, reject);
      }
    });
  }

  private loadDaumPostcodeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById("daum-postcode-script")) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "daum-postcode-script";
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Daum 주소 검색 스크립트 로드 실패"));
      document.head.appendChild(script);
    });
  }

  private executeDaumPostcode(
    resolve: (value: AddressData) => void,
    reject: (reason?: Error) => void,
  ): void {
    new daum.Postcode({
      oncomplete: (data) => {
        const addressData: AddressData = {
          fullAddress: data.address,
          roadAddress: data.roadAddress || data.address,
          jibunAddress: data.jibunAddress || data.address,
          sido: data.sido,
          sigungu: data.sigungu,
          roadname: data.roadname,
          buildingName: data.buildingName,
          zipcode: data.zonecode,
        };

        resolve(addressData);
      },
      onclose: (state: string) => {
        if (state === "FORCE_CLOSE" || state === "COMPLETE_CLOSE") {
          reject(new Error("사용자가 주소 검색을 취소했습니다."));
        }
      },
      width: "100%",
      height: "100%",
    }).open({
      q: "", // 검색어 초기값
      left: window.screen.width / 2 - 500 / 2,
      top: window.screen.height / 2 - 600 / 2,
    });
  }

  // 주소를 좌표로 변환 (Kakao Map API 필요)
  public async geocodeAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Kakao Map API를 사용한 지오코딩
      // 실제 구현시 Kakao Developers에서 앱 키 발급 필요
      const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

      console.log("KAKAO_API_KEY",KAKAO_API_KEY);

      if (!KAKAO_API_KEY) {
        console.warn("Kakao API 키가 설정되지 않았습니다.");
        return null;
      }

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("지오코딩 API 호출 실패");
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const result = data.documents[0];
        return {
          latitude: parseFloat(result.y),
          longitude: parseFloat(result.x),
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }
}
