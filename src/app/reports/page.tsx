"use client";

import dynamic from "next/dynamic";
import { useIssuesStore } from "@/store/useIssuesStore";

const KakaoMap = dynamic(() => import("../../components/KakaoMap"), { ssr: false });

export default function ReportsPage() {
  const { issues, center } = useIssuesStore();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">이슈 지도</h1>
      <KakaoMap issues={issues} center={center} />
    </div>
  );
}
