import { MetadataRoute } from "next";

// 전체 사이트는 기본적으로 허용하되, 민감/내부 경로를 명시적으로 차단
// 필요 시 허용 페이지 화이트리스트 방식으로 전환 가능
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/colors", // 내부 개발용 팔레트
          "/admin", // 관리자 대시보드
          "/dashboard", // 사용자 개인 대시보드
          "/data", // 데이터 상세/업로드
          "/settings", // 사용자 설정
          "/register", // 회원가입 폼 (SEO 불필요)
          "/login", // 로그인 폼 (SEO 불필요)
          "/auth", // 인증 콜백/로그인 관련
          "/api", // API 라우트
        ],
      },
    ],
  };
}
