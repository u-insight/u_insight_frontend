"use client";

import { Siren, View } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="relative flex items-start justify-center min-h-screen px-4 pt-20 bg-center bg-cover sm:px-6"
      style={{
        backgroundImage: "url('/images/ui.jpg')",
      }}
    >
      <div className="w-full max-w-lg p-4 text-center shadow-md rounded-xl bg-white/70 sm:max-w-xl sm:p-8 lg:p-12">
        <h1 className="text-2xl font-bold text-green-600 sm:text-2xl">
          Hello, U-Insight!
        </h1>
        <p className="mt-3 text-base sm:text-lg">
          의성군 스마트 민원 시스템에 오신 것을 환영합니다.
        </p>

        {/* Responsive Buttons */}
        <div className="flex flex-col justify-between w-full gap-4 mt-6 sm:flex-row">
          <button
            className="flex items-center justify-center w-full gap-2 px-6 py-2 font-semibold text-white rounded-lg shadow bg-red-primary hover:opacity-50 focus:opacity-50 sm:w-auto"
            onClick={() => router.push("/reports/new")}
          >
            <Siren size={20} color="white" />
            신청하기
          </button>
          <button
            className="flex items-center justify-center w-full gap-2 px-6 py-2 font-semibold text-white rounded-lg shadow bg-green-primary hover:opacity-50 focus:opacity-50 sm:w-auto"
            onClick={() => router.push("/reports")}
          >
            <View size={20} color="white" />
            신고 현황 보기
          </button>
        </div>
      </div>
    </div>
  );
}