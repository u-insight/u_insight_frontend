"use client";

import { create } from "zustand";
import { UrgencyLevel_e } from "../types/report";

export interface ReportData {
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
  reports: [],
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
  // set((state) => ({
  //   ...report,
  //   // reports: [...state.reports, report],

  //   // center: { lat: report.coordinates.lat, lng: report.coordinates.lng },
  // })),
  setCenter: (center) => set({ center }),
  clearIssues: () => set({ reports: [] }),
}));
