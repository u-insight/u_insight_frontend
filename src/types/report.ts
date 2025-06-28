export const UrgencyLevel_e = {
  Urgent: "urgent",
  Normal: "normal",
  Low: "low",
} as const;

export type UrgencyLevel_e =
  (typeof UrgencyLevel_e)[keyof typeof UrgencyLevel_e];

export const ReportStatus_e = {
  Pending: "PENDING",
  InProgress: "IN_PROGRESS",
  Resolved: "RESOLVED",
  Rejected: "REJECTED",
} as const;

export type ReportStatus_e =
  (typeof ReportStatus_e)[keyof typeof ReportStatus_e];

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
  status: ReportStatus_e;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  category?: string;
}
