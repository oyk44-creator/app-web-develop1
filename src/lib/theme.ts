// Theme 설정 (Tailwind CSS 기반)
import { notoSansKr } from "./fonts";

// Theme 색상 정의 (Tailwind와 호환)
export const theme = {
  colors: {
    primary: {
      main: "#3b82f6", // blue-500
      light: "#60a5fa", // blue-400
      dark: "#2563eb", // blue-600
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6", // violet-500
      light: "#a78bfa", // violet-400
      dark: "#7c3aed", // violet-600
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981", // green-500
    },
    warning: {
      main: "#f59e0b", // amber-500
    },
    error: {
      main: "#ef4444", // red-500
    },
    info: {
      main: "#06b6d4", // cyan-500
    },
    background: {
      default: "#f9fafb", // gray-50
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: notoSansKr.style.fontFamily,
  },
  shape: {
    borderRadius: 8,
  },
};
