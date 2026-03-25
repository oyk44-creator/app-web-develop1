# EV Battery Data Platform - Frontend

전기차 배터리 데이터 수집, 분석 및 시각화를 위한 웹 플랫폼입니다.

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 요구사항](#시스템-요구사항)
- [설치 방법](#설치-방법)
- [환경 변수 설정](#환경-변수-설정)
- [실행 방법](#실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [페이지 라우트](#페이지-라우트)
- [배포](#배포)
- [문서](#문서)

---

## 프로젝트 개요

EV Battery Data Platform은 전기차 배터리 데이터를 수집하고 분석하기 위한 웹 기반 플랫폼입니다.

### 핵심 가치

- **데이터 수집**: CSV, Excel, DAT, MAT 파일 업로드 및 수기 입력 지원
- **실시간 모니터링**: 배터리 상태(SOC, SOH, 온도) 실시간 대시보드
- **시각화 분석**: 다양한 차트 타입으로 데이터 트렌드 분석
- **보안**: Magic Link 인증 및 Row Level Security(RLS) 기반 데이터 보호

### 대상 사용자

- 전기차 배터리 연구원
- 차량 데이터 분석가
- 배터리 관리 시스템(BMS) 엔지니어

---

## 주요 기능

### 인증 및 보안

| 기능                | 설명                         |
| ------------------- | ---------------------------- |
| Magic Link 로그인   | 비밀번호 없는 이메일 인증    |
| 역할 기반 접근 제어 | 관리자/일반 사용자 권한 분리 |
| 세션 관리           | 자동 갱신 및 만료 처리       |
| 감사 로그           | 로그인/로그아웃 기록         |

### 데이터 수집

| 기능           | 설명                           |
| -------------- | ------------------------------ |
| 파일 업로드    | CSV, XLSX, XLS, DAT, MAT 지원  |
| 드래그 앤 드롭 | 직관적인 파일 업로드 UI        |
| 다중 업로드    | 최대 10개 파일, 개별 50MB 제한 |
| 수기 입력      | 웹 폼을 통한 직접 데이터 입력  |
| 실시간 진행률  | 업로드/처리 상태 표시          |

### 시각화 및 분석

| 기능          | 설명                     |
| ------------- | ------------------------ |
| 차트 타입     | Line, Bar, Area 차트     |
| 인터랙션      | 줌, 팬, 범례 토글, 툴팁  |
| 다중 비교     | 여러 측정 항목 동시 표시 |
| 차트 다운로드 | PNG 이미지 내보내기      |

### 대시보드

| 위젯        | 설명                               |
| ----------- | ---------------------------------- |
| KPI 카드    | SOC, SOH, 배터리 온도, 에너지 효율 |
| 최근 데이터 | 최근 업로드 파일 목록              |
| 차트 요약   | 핵심 지표 트렌드 시각화            |
| Risk Score  | 배터리 위험도 점수                 |

### 관리자 기능

| 기능        | 설명                                     |
| ----------- | ---------------------------------------- |
| 사용자 관리 | 전체 사용자 목록 및 역할 변경            |
| 시스템 통계 | 총 사용자, 데이터 포인트, 파일 업로드 수 |
| 전체 데이터 | 모든 사용자의 업로드 파일 조회           |
| 감사 로그   | 시스템 활동 모니터링                     |
| 오류 로그   | 시스템 에러 추적                         |

---

## 기술 스택

### Frontend

| 기술          | 버전    | 용도                          |
| ------------- | ------- | ----------------------------- |
| Next.js       | 14.2.18 | React 프레임워크 (App Router) |
| React         | 18.3.1  | UI 라이브러리                 |
| TypeScript    | 5.x     | 타입 안전성                   |
| Tailwind CSS  | 3.4.1   | 유틸리티 CSS                  |
| Chart.js      | 4.5.1   | 데이터 시각화                 |
| Framer Motion | 12.x    | 애니메이션                    |

### UI 컴포넌트

| 라이브러리   | 용도                          |
| ------------ | ----------------------------- |
| Radix UI     | 접근성 준수 헤드리스 컴포넌트 |
| shadcn/ui    | 스타일링된 컴포넌트           |
| Lucide React | 아이콘                        |
| Sonner       | 토스트 알림                   |

### Backend (BaaS)

| 서비스             | 용도                         |
| ------------------ | ---------------------------- |
| Supabase           | 인증, 데이터베이스, 스토리지 |
| PostgreSQL         | 관계형 데이터베이스          |
| Row Level Security | 데이터 접근 제어             |

### 개발 도구

| 도구       | 용도        |
| ---------- | ----------- |
| ESLint     | 코드 린팅   |
| Prettier   | 코드 포맷팅 |
| TypeScript | 타입 체크   |

---

## 시스템 요구사항

### 필수 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상 또는 **yarn**: 1.22.x 이상
- **Git**: 최신 버전

### 지원 브라우저

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

---

## 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/your-org/mvp-web-supabase-next.git
cd mvp-web-supabase-next/frontend
```

### 2. 의존성 설치

```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

### 3. 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp .env.example .env.local

# .env.local 파일 편집하여 실제 값 입력
```

---

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정합니다:

### 필수 환경 변수

```env
# Supabase 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 관리자 이메일 목록 (쉼표로 구분)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

### 환경 변수 설명

| 변수명                          | 설명                    | 필수 |
| ------------------------------- | ----------------------- | ---- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 프로젝트 URL   | O    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키        | O    |
| `ADMIN_EMAILS`                  | 관리자 권한 이메일 목록 | O    |

### Supabase 설정 확인 방법

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Settings > API 메뉴에서 URL과 anon key 확인

---

## 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 사용 가능한 스크립트

| 명령어                 | 설명                        |
| ---------------------- | --------------------------- |
| `npm run dev`          | 개발 서버 실행 (Hot Reload) |
| `npm run build`        | 프로덕션 빌드               |
| `npm run start`        | 프로덕션 서버 실행          |
| `npm run lint`         | ESLint 코드 검사            |
| `npm run type-check`   | TypeScript 타입 검사        |
| `npm run format`       | Prettier 코드 포맷팅        |
| `npm run format:check` | 포맷팅 검사                 |
| `npm run deploy`       | Vercel 배포 (Preview)       |
| `npm run deploy:prod`  | Vercel 프로덕션 배포        |

---

## 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트 그룹
│   │   ├── register/      # 로그인/회원가입
│   │   └── auth/callback/ # OAuth 콜백
│   ├── admin/             # 관리자 페이지
│   ├── charts/            # 차트 분석 페이지
│   ├── dashboard/         # 대시보드
│   ├── data/              # 데이터 관리
│   │   ├── list/          # 데이터 목록
│   │   ├── upload/        # 파일 업로드
│   │   └── [id]/          # 데이터 상세
│   ├── settings/          # 설정 페이지
│   ├── api/               # API 라우트
│   └── layout.tsx         # 루트 레이아웃
│
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── ui/           # shadcn/ui 기본 컴포넌트
│   │   ├── admin/        # 관리자 컴포넌트
│   │   ├── charts/       # 차트 컴포넌트
│   │   ├── dashboard/    # 대시보드 컴포넌트
│   │   ├── data/         # 데이터 관련 컴포넌트
│   │   └── layout/       # 레이아웃 컴포넌트
│   │
│   ├── hooks/            # 커스텀 훅
│   │   └── useAuth.ts    # 인증 훅
│   │
│   └── lib/              # 유틸리티
│       ├── supabase/     # Supabase 클라이언트
│       └── utils/        # 헬퍼 함수
│
├── public/               # 정적 파일
├── docs/                 # 문서
└── package.json
```

---

## 페이지 라우트

| 경로           | 접근 권한   | 설명            |
| -------------- | ----------- | --------------- |
| `/`            | 공개        | 랜딩 페이지     |
| `/register`    | 공개        | 로그인/회원가입 |
| `/dashboard`   | 인증 필요   | 메인 대시보드   |
| `/data/upload` | 인증 필요   | 파일 업로드     |
| `/data/list`   | 인증 필요   | 데이터 목록     |
| `/data/[id]`   | 인증 필요   | 데이터 상세     |
| `/charts`      | 인증 필요   | 차트 분석       |
| `/settings`    | 인증 필요   | 사용자 설정     |
| `/admin`       | 관리자 전용 | 관리자 대시보드 |
| `/forbidden`   | 공개        | 접근 거부 안내  |

---

## 배포

### Vercel 배포 (권장)

```bash
# Preview 배포
npm run deploy

# Production 배포
npm run deploy:prod
```

### 수동 배포

1. **빌드 생성**

   ```bash
   npm run build
   ```

2. **빌드 결과물 확인**
   - `.next/` 디렉토리에 빌드 파일 생성

3. **서버 실행**
   ```bash
   npm run start
   ```

### 환경별 설정

| 환경        | 브랜치     | URL             |
| ----------- | ---------- | --------------- |
| Development | feature/\* | localhost:3000  |
| Preview     | develop    | \*.vercel.app   |
| Production  | main       | your-domain.com |

---

## 문서

상세 문서는 `docs/` 디렉토리를 참조하세요:

| 문서                                                | 설명           |
| --------------------------------------------------- | -------------- |
| [FEATURES.md](./docs/FEATURES.md)                   | 기능 상세 설명 |
| [STACK.md](./docs/STACK.md)                         | 기술 스택 상세 |
| [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | 프로젝트 구조  |
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md)             | 개발 가이드    |
| [AUTHENTICATION.md](./docs/AUTHENTICATION.md)       | 인증 시스템    |
| [COLOR_SYSTEM.md](./docs/COLOR_SYSTEM.md)           | 색상 시스템    |

---

## 트러블슈팅

### 일반적인 문제 해결

#### 1. 환경 변수 오류

```
Error: Missing Supabase URL or Key
```

**해결**: `.env.local` 파일에 환경 변수가 올바르게 설정되었는지 확인

#### 2. 인증 오류

```
Error: Invalid login credentials
```

**해결**: Supabase 대시보드에서 이메일 인증 설정 확인

#### 3. 빌드 오류

```
Type error: ...
```

**해결**: `npm run type-check`로 타입 오류 확인 후 수정

#### 4. 의존성 충돌

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 기여 가이드

### 코드 스타일

- ESLint 규칙 준수
- Prettier 포맷팅 적용
- TypeScript strict 모드 사용

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
```

### Pull Request

1. feature 브랜치 생성
2. 변경사항 커밋
3. PR 생성 및 리뷰 요청

---

## 라이선스

이 프로젝트는 비공개 프로젝트입니다. 무단 복제 및 배포를 금지합니다.

---

## 연락처

- **프로젝트 관리자**: admin@futuremobility.ai
- **기술 지원**: support@futuremobility.ai

---

최종 업데이트: 2025-11-25
