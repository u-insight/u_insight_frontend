"use client";

import { create } from "zustand";
import { UrgencyLevel_e } from "../types/report";

export interface ReportData {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: UrgencyLevel_e;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: File[];
}

interface ReportsState {
  reports: ReportData[];
  center: { lat: number; lng: number };
  addReport: (issue: ReportData) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  clearIssues: () => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [
    // TODO: 빈배열로 초기화 필요
    {
      id: "0",
      title: "",
      description: "asdf",
      location: "경상북도 의성군 의성읍 충효로 88",
      urgency: "normal",
      images: [],
      coordinates: {
        lat: 36.355473200305546,
        lng: 128.70238171538088,
      },
    },
    {
      id: "1",
      title: "",
      description: "asdf",
      location: "경상북도 의성군 봉양면 봉호로 14",
      urgency: "urgent",
      images: [],
      coordinates: {
        lat: 36.344546,
        lng: 128.704852,
      },
    },
  ],
  center: { lat: 37.5665, lng: 126.978 },
  addReport: (report) => {
    console.log("Adding report:", report);
    set((state) => ({
      reports: [...state.reports, report],
      center: {
        lat: report.coordinates?.lat || state.center.lat,
        lng: report.coordinates?.lng || state.center.lng,
      },
    }));
  },
  setCenter: (center) => set({ center }),
  clearIssues: () => set({ reports: [] }),
}));
