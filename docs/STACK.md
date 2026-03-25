# TECH STACK 상세

## 프레임워크 & 언어

- Next.js 14.2.18 (App Router / 서버 컴포넌트 / Edge 가능)
- React 18.3.1
- TypeScript 5

## UI / 스타일

- Tailwind CSS 3.4.1 + 커스텀 fmai 색상
- shadcn/ui (Radix 기반 접근성 컴포넌트)
- MUI (Material UI) 7.x (DataGrid, 아이콘)
- Framer Motion 12.x (애니메이션)
- Lucide React (아이콘 집합)
- next-themes (다크 모드)

## 데이터 / 유틸

- Supabase (Auth + Postgres + Storage)
- PapaParse (CSV 파싱)
- XLSX (Excel 처리)
- react-dropzone (파일 업로드 인터랙션)
- date-fns (날짜 포맷팅)

## 폼 / 검증

- React Hook Form 7.x (고성능 폼 상태)
- Zod 4.x (타입 + 런타임 스키마)

## 차트 / 시각화

- Chart.js 4.5.1 + react-chartjs-2 (시계열 차트)
- chartjs-plugin-zoom (줌/팬)
- Recharts 2.x (추가 차트 옵션)

## PWA 지원

- next-pwa (Service Worker, 오프라인 지원)
- Web App Manifest

## 알림 / 토스트

- Sonner (토스트 알림)

## 개발 경험

- ESLint + Prettier + prettier-plugin-tailwindcss
- Type Checking 스크립트 분리 (`npm run type-check`)

## 패스 Alias

`@/*` → `src/*`

## 선택 기준 요약

| 영역          | 선택            | 이유                              |
| ------------- | --------------- | --------------------------------- |
| UI 프레임워크 | Tailwind        | 빠른 프로토타이핑 + 디자인 일관성 |
| 컴포넌트      | shadcn/ui       | 접근성·구성 가능성 우수           |
| 데이터 그리드 | MUI DataGrid    | 정렬, 필터, 페이지네이션 내장     |
| 인증          | Supabase Auth   | 서버/클라이언트 통합 편의성       |
| 폼            | React Hook Form | 리렌더 최소화 + 확장성            |
| 검증          | Zod             | 타입/런타임 단일 소스             |
| 시각화        | Chart.js        | 커뮤니티·플러그인 생태계          |
| PWA           | next-pwa        | 오프라인 지원, 설치 가능          |

## 주요 패키지 버전

| 패키지        | 버전    |
| ------------- | ------- |
| next          | 14.2.18 |
| react         | 18.3.1  |
| @supabase/ssr | 0.7.0   |
| chart.js      | 4.5.1   |
| framer-motion | 12.x    |
| zod           | 4.x     |
| tailwindcss   | 3.4.1   |

---

최종 업데이트: 2025-11-25
