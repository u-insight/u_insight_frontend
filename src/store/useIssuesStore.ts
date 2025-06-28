"use client";

import { create } from "zustand";

export interface Issue {
  id: number;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  address: string;
}

interface IssueState {
  issues: Issue[];
  center: { lat: number; lng: number };
  addIssue: (issue: Issue) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  clearIssues: () => void;
}

export const useIssuesStore = create<IssueState>((set) => ({
  issues: [],
  center: { lat: 37.5665, lng: 126.978 },
  addIssue: (issue) =>
    set((state) => ({
      issues: [...state.issues, issue],
      center: { lat: issue.lat, lng: issue.lng },
    })),
  setCenter: (center) => set({ center }),
  clearIssues: () => set({ issues: [] }),
}));
