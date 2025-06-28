"use client";
import Image from "next/image";
import { Siren, View } from "lucide-react";

export default function Home() {
  return (
    <div
      className="relative flex min-h-screen items-start justify-center bg-cover bg-center px-4 pt-20 sm:px-6"
      style={{
        backgroundImage: "url('/images/ui.jpg')",
      }}
    >
      <div className="w-full max-w-lg rounded-xl bg-white/70 p-4 text-center shadow-md sm:max-w-xl sm:p-8 lg:p-12">
        <h1 className="text-2xl font-bold text-green-600 sm:text-2xl">
          Hello, U-Insight!
        </h1>
        <p className="mt-3 text-base sm:text-lg">
          의성군 스마트 민원 시스템에 오신 것을 환영합니다.
        </p>

        {/* Responsive Buttons */}
        <div className="mt-6 flex w-full flex-col justify-between gap-4 sm:flex-row">
          <button
            className="bg-red-primary flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow hover:opacity-50 focus:opacity-50 sm:w-auto"
            onClick={() => alert("신청하기")}
          >
            <Siren size={20} color="white" />
            신청하기
          </button>
          <button
            className="bg-green-primary flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow hover:opacity-50 focus:opacity-50 sm:w-auto"
            onClick={() => alert("신고 현황 보기")}
          >
            <View size={20} color="white" />
            신고 현황 보기
          </button>
        </div>
      </div>
    </div>
  );
}
