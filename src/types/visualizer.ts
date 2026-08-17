export type Stage = "catalogue" | "detail" | "lead" | "upload" | "processing" | "result";

export const BUILDING_TYPES = [
  "Bolig",
  "Kontor",
  "Hotel",
  "Skole",
  "Sundhed",
  "Offentlig bygning",
  "Andet",
] as const;
export type BuildingType = (typeof BUILDING_TYPES)[number];

export interface LeadInfo {
  email: string;
  buildingType: BuildingType | "";
  doorCount: number;
  companyName: string;
  projectName: string;
}

export const EMPTY_LEAD: LeadInfo = {
  email: "",
  buildingType: "",
  doorCount: 8,
  companyName: "",
  projectName: "",
};

export interface UploadedPhoto {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
}
