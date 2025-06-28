export const UrgencyLevel_e = {
  Urgent: "urgent",
  Normal: "normal",
  Low: "low",
} as const;

export type UrgencyLevel_e =
  (typeof UrgencyLevel_e)[keyof typeof UrgencyLevel_e];

export interface Report {
  id: string;
  title?: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  urgency: UrgencyLevel_e;
  images: string[]; // 이미지 URL 배열
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  category?: string;
}

export enum ReportStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Resolved = "RESOLVED",
  Rejected = "REJECTED",
}
