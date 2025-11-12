import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Clinic } from "@shared/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTranslatedName = (clinic: Clinic, i18n: any) => {
  const currentLang = i18n.language;
  switch (currentLang) {
    case 'hi':
      return clinic.name_hi || clinic.name;
    case 'mr':
      return clinic.name_mr || clinic.name;
    default:
      return clinic.name_en || clinic.name;
  }
};

export const getTranslatedAddress = (clinic: Clinic, i18n: any) => {
  const currentLang = i18n.language;
  switch (currentLang) {
    case 'hi':
      return clinic.address_hi || clinic.address;
    case 'mr':
      return clinic.address_mr || clinic.address;
    default:
      return clinic.address_en || clinic.address;
  }
};
