export type Issue = {
  id: number;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  url?: string;
};

export interface KakaoMapProps {
  issues: Issue[];
  center?: { lat: number; lng: number };
}

declare global {
  interface Window {
    kakao: any;
  }
}