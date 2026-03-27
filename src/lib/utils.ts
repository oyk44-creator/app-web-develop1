import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui의 cn 유틸리티 함수
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
