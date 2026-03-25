# PROJECT STRUCTURE 상세

## 상위 디렉터리

| 폴더           | 역할                                           |
| -------------- | ---------------------------------------------- |
| app            | Next.js 라우트(App Router) / 레이아웃 / 페이지 |
| src/components | UI 및 도메인 컴포넌트 모음                     |
| src/lib        | 클라이언트 생성, 유틸, 타입, 설정              |
| src/hooks      | 커스텀 훅(useAuth 등)                          |
| public         | 정적 자산(이미지, manifest, sw)                |
| docs           | 문서 아카이브                                  |

## App 라우트 하이라이트

| 경로         | 설명                                      |
| ------------ | ----------------------------------------- |
| /            | 랜딩 페이지                               |
| /dashboard   | KPI 및 요약 차트                          |
| /data/upload | 파일 업로드 (Tesla KPI 청크 업로드)       |
| /data/list   | 데이터 목록                               |
| /data/[id]   | 업로드 상세 (시계열 데이터 + KPI 요약)    |
| /charts      | 멀티 차트 분석 뷰                         |
| /settings    | 계정/앱 설정                              |
| /admin       | 관리자 대시보드 (사용자/데이터/로그 관리) |
| /register    | 로그인(Magic Link) 진입                   |
| /forbidden   | 권한 부족 안내                            |
| /about       | 회사/서비스 소개                          |
| /contact     | 문의 페이지                               |
| /offline     | PWA 오프라인 페이지                       |
| /terms       | 이용약관                                  |
| /privacy     | 개인정보처리방침                          |
| /legal       | 법적고지                                  |

## 컴포넌트 분류 예시

| 그룹      | 예시 파일                                   | 목적                |
| --------- | ------------------------------------------- | ------------------- |
| home      | HeroSection / FeatureSection                | 랜딩 페이지 섹션    |
| dashboard | StatsCard / RecentDataTable / ChartSummary  | 요약 & 테이블       |
| data      | FileUploadZone / DataTable / KpiSummaryCard | 데이터 업로드/표시  |
| charts    | Chart / MultiChartView / ChartFilters       | 시각화 래퍼         |
| settings  | AccountSettings / AppSettings               | 사용자/앱 구성      |
| admin     | UserManagement / SystemStats / AllDataTable | 관리 기능           |
| admin     | AuditLogsTable / ErrorLogsTable             | 로그 조회           |
| layout    | Header / Footer                             | 레이아웃 구성       |
| providers | ThemeProvider                               | 컨텍스트 프로바이더 |

## Supabase 관련

| 파일          | 역할                                        |
| ------------- | ------------------------------------------- |
| client.ts     | 브라우저 Supabase 클라이언트 생성           |
| server.ts     | 서버(Edge/Node) 클라이언트 생성 + 쿠키 연동 |
| middleware.ts | 세션 갱신 + 보호 라우트 처리                |
| index.ts      | Barrel export (createBrowserClient 등)      |

## API 라우트

| 경로                       | 메서드 | 설명                  |
| -------------------------- | ------ | --------------------- |
| /api/auth/logout           | POST   | 로그아웃 + 감사 로그  |
| /api/data/uploads          | GET    | 업로드 목록 조회      |
| /api/data/[id]             | GET    | 업로드 상세 데이터    |
| /api/data/[id]             | DELETE | 업로드 삭제           |
| /api/data/kpi-summary      | GET    | KPI 요약 조회         |
| /api/upload/tesla-kpi      | POST   | Tesla KPI 청크 업로드 |
| /api/charts/data           | GET    | 차트 시계열 데이터    |
| /api/admin/stats           | GET    | 시스템 통계           |
| /api/admin/users           | GET    | 사용자 목록           |
| /api/admin/users/[id]/role | PUT    | 역할 변경             |
| /api/admin/users/[id]      | DELETE | 사용자 삭제           |
| /api/admin/uploads         | GET    | 전체 업로드 조회      |
| /api/admin/audit-logs      | GET    | 감사 로그 조회        |
| /api/admin/error-logs      | GET    | 에러 로그 조회        |
| /api/errors/log            | POST   | 클라이언트 에러 기록  |
| /api/healthcheck           | GET    | 서버 상태 확인        |

## 확장 계획 (구조)

- `src/services/` 레이어 추가(도메인 비즈니스 로직)
- `src/state/` 글로벌 상태(Reducer/Zustand 등 필요 시)
- 테스트 디렉터리(`__tests__`) 도입 (유닛/통합)

---

최종 업데이트: 2025-11-25
