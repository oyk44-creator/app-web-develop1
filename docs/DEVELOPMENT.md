# 개발 가이드

퓨처모빌리티AI 프론트엔드 개발을 위한 상세 가이드입니다.

### 색상 시스템

색상 관련 모든 상세(팔레트, 그라디언트 유틸, 접근성, 마이그레이션)는 전용 문서 `COLOR_SYSTEM.md` 를 참조하세요.

### 사용 예시

```typescript
// Path Alias 사용 (권장)
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// 상대 경로 사용 (복잡함, 비권장)
import { Button } from "../../../src/components/ui/button";
import { createClient } from "../../lib/supabase/client";
```

### 규칙

- `@/*` → `./src/*`
- 모든 `src/` 하위 파일은 `@/`로 시작
- `app/` 디렉터리는 상대 경로 사용 (Next.js App Router 특성)

## 컴포넌트 작성 가이드

### Server Component (기본값)

Next.js 14에서는 모든 컴포넌트가 기본적으로 Server Component입니다.

```tsx
// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: stats } = await supabase
    .from("tesla_kpi_summary")
    .select("avg_soc, risk_score, avg_pack_temp")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard title="평균 SOC" value={stats?.avg_soc} unit="%" />
      <StatsCard title="위험 점수" value={stats?.risk_score} unit="점" />
      <StatsCard title="팩 온도" value={stats?.avg_pack_temp} unit="°C" />
    </div>
  );
}
```

**Server Component 특징**:

- 데이터베이스 직접 접근 가능
- 환경 변수 사용 가능 (서버 전용)
- 클라이언트로 전송되는 JavaScript 번들 크기 감소
- SEO 최적화 (서버에서 렌더링)

### Client Component

사용자 인터랙션, 상태 관리, 브라우저 API가 필요한 경우 Client Component를 사용합니다.

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  const { user, signOut } = useAuth();

  return (
    <div>
      <p>현재 사용자: {user?.email}</p>
      <Button onClick={() => setCount(count + 1)}>클릭 {count}회</Button>
      <Button onClick={signOut}>로그아웃</Button>
    </div>
  );
}
```

**Client Component가 필요한 경우**:

- `useState`, `useEffect`, `useContext` 등 React Hooks 사용
- 브라우저 API 사용 (`window`, `localStorage`, etc.)
- 이벤트 핸들러 (`onClick`, `onChange`, etc.)
- 애니메이션 라이브러리 (Framer Motion, etc.)

**Client Component 최적화**:

- 가능한 한 작은 범위로 제한
- Server Component 내부에 Client Component를 배치
- Client Component 내부에 Server Component를 직접 import하지 않음

### 하이브리드 패턴 (권장)

Server Component와 Client Component를 조합하여 최적화합니다.

```tsx
// app/dashboard/page.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";
import { InteractiveChart } from "@/components/charts/InteractiveChart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: chartData } = await supabase
    .from("tesla_kpi_data")
    .select("timestamps, soc_ave, bms_max_pack_temp")
    .order("timestamps", { ascending: true });

  return (
    <div>
      <h1>대시보드</h1>
      {/* 데이터 fetching은 서버, 인터랙션은 클라이언트 */}
      <InteractiveChart data={chartData} />
    </div>
  );
}
```

```tsx
// src/components/charts/InteractiveChart.tsx (Client Component)
"use client";

import { Line } from "react-chartjs-2";

interface Props {
  data: { timestamps: number; soc_ave: number; bms_max_pack_temp: number }[];
}

export function InteractiveChart({ data }: Props) {
  // 클라이언트에서 차트 인터랙션 처리
  return <Line data={transformData(data)} />;
}
```

## 스타일링 가이드

### Tailwind CSS 클래스

프로젝트는 Tailwind CSS를 사용합니다. 유틸리티 클래스를 조합하여 스타일을 적용합니다.

```tsx
<div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
  <Button variant="default" size="lg">
    Click Me
  </Button>
</div>
```

**Tailwind 클래스 카테고리**:

- **레이아웃**: `flex`, `grid`, `block`, `inline`, `hidden`
- **간격**: `p-4`, `m-2`, `gap-2`, `space-x-4`
- **크기**: `w-full`, `h-screen`, `max-w-lg`, `min-h-[200px]`
- **타이포그래피**: `text-sm`, `font-bold`, `text-center`, `text-white`
- **배경**: `bg-blue-500`, `bg-gradient-to-r`, `from-blue-500 to-cyan-500`
- **테두리**: `border`, `border-gray-300`, `rounded-lg`, `ring-2`
- **효과**: `shadow-md`, `opacity-50`, `backdrop-blur`
- **전환**: `transition`, `duration-200`, `ease-in-out`
- **상태**: `hover:bg-blue-600`, `focus:ring-2`, `disabled:opacity-50`
- **반응형**: `sm:text-lg`, `md:w-1/2`, `lg:flex`
- **다크 모드**: `dark:bg-gray-800`, `dark:text-white`

### (Color System 자세한 내용은 별도 문서 참조)

색상/그라디언트 사용 규칙은 중복을 피하기 위해 `COLOR_SYSTEM.md` 에만 정리합니다.

### shadcn/ui 컴포넌트

shadcn/ui는 Radix UI 기반의 재사용 가능한 컴포넌트 라이브러리입니다.

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="user@example.com" />
          </div>
          <Button type="submit">로그인</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**shadcn/ui 컴포넌트 변형**:

```tsx
// Button
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Card
<Card className="shadow-md">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
  <CardFooter>푸터</CardFooter>
</Card>

// Badge
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### 커스텀 CSS (globals.css)

전역 스타일은 `app/globals.css`에 정의합니다.

````css
/* FMAI 브랜드 색상 CSS 변수 */
:root {
  --fmai-primary: ...%; /* Emerald-500 */
  --fmai-secondary: ...%; /* Cyan-500 */
  /* ... 기타 색상 ... */
}

.dark {
  --fmai-primary: ...%; /* 다크 모드 색상 */
  /* ... */
}



## 폼 처리

### React Hook Form + Zod

폼 상태 관리는 React Hook Form, 검증은 Zod를 사용합니다.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Zod 스키마 정의
const formSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("유효한 이메일을 입력하세요"),
  age: z
    .number({
      required_error: "나이를 입력하세요",
      invalid_type_error: "숫자를 입력하세요",
    })
    .min(0, "나이는 0 이상이어야 합니다")
    .max(120, "나이는 120 이하여야 합니다"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(/[A-Z]/, "대문자를 포함해야 합니다")
    .regex(/[0-9]/, "숫자를 포함해야 합니다"),
});

type FormData = z.infer<typeof formSchema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("제출 실패");

      // 성공 처리
      console.log("제출 성공:", data);
    } catch (error) {
      console.error("제출 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="age">나이</Label>
        <Input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "제출 중..." : "제출"}
      </Button>
    </form>
  );
}
````

### 파일 업로드 (Dropzone)

파일 업로드는 React Dropzone을 사용합니다.

```tsx
"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export function FileUploadZone() {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      maxFiles: 10,
      maxSize: 50 * 1024 * 1024, // 50MB
      onDrop: (files) => {
        console.log("업로드할 파일:", files);
        // 파일 업로드 로직
      },
    });

  return (
    <div
      {...getRootProps()}
      className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
        isDragActive
          ? "border-fmai-primary bg-fmai-primary/10"
          : "hover:border-fmai-primary border-gray-300"
      } `}
    >
      <input {...getInputProps()} />
      <Upload className="mb-4 h-12 w-12 text-gray-400" />
      <p className="text-center text-gray-600">
        {isDragActive
          ? "파일을 여기에 놓으세요"
          : "파일을 드래그하거나 클릭하여 업로드"}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        CSV, Excel 파일 지원 (최대 10개, 50MB)
      </p>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 w-full">
          <p className="font-semibold">선택된 파일:</p>
          <ul className="mt-2 space-y-1">
            {acceptedFiles.map((file) => (
              <li key={file.name} className="text-sm text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 코드 포매팅

### Prettier 설정

프로젝트는 Prettier를 사용하여 코드 스타일을 자동으로 통일합니다.

**`.prettierrc` 파일**:

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**VSCode 자동 저장 설정** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**VSCode 확장 프로그램 필수 설치**:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)

### Tailwind CSS 클래스 자동 정렬

`prettier-plugin-tailwindcss` 플러그인이 Tailwind CSS 클래스를 공식 권장 순서로 자동 정렬합니다.

**정렬 순서**:

1. 레이아웃 (flex, grid, block, inline, hidden)
2. 위치 (absolute, relative, fixed, top, left)
3. 박스 모델 (w-full, h-screen, p-4, m-2, gap-2)
4. 타이포그래피 (text-sm, font-bold, text-center)
5. 배경 (bg-blue-500, bg-gradient-to-r)
6. 테두리 (border, rounded-lg, ring-2)
7. 효과 (shadow-md, opacity-50)
8. 전환 (transition, duration-200)
9. 인터랙티브 (cursor-pointer, select-none)
10. 상태 수정자 (hover:, focus:, disabled:)
11. 반응형 (sm:, md:, lg:)
12. 다크 모드 (dark:)

**정렬 예시**:

```tsx
// 정렬 전
<div className="hover:bg-blue-500 text-white p-4 flex items-center bg-blue-600 rounded-lg shadow-lg dark:bg-blue-800">

// 정렬 후 (저장 시 자동 적용)
<div className="flex items-center rounded-lg bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-500 dark:bg-blue-800">
```

### npm 스크립트

```bash
# 전체 프로젝트 포매팅
npm run format

# 포매팅 체크 (수정하지 않고 확인만)
npm run format:check
```

## 코딩 컨벤션

### 파일명

- **컴포넌트**: PascalCase (예: `MyComponent.tsx`, `Button.tsx`)
- **유틸리티**: camelCase (예: `chartUtils.ts`, `formatDate.ts`)
- **페이지**: 소문자 (예: `page.tsx`, `layout.tsx`)
- **타입**: camelCase (예: `types.ts`, `vehicleData.ts`)

### 디렉터리 구조

```
src/
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트 (Header, Footer)
│   ├── dashboard/          # 대시보드 전용 컴포넌트
│   ├── data/               # 데이터 관리 전용 컴포넌트
│   └── charts/             # 차트 전용 컴포넌트
│
├── lib/
│   ├── supabase/           # Supabase 클라이언트 & 미들웨어
│   ├── types/              # 타입 정의
│   └── utils/              # 유틸리티 함수
│
└── hooks/                  # 커스텀 훅
    └── useAuth.ts
```

### 컴포넌트

- **함수형 컴포넌트** 사용 (클래스 컴포넌트 사용 금지)
- **Client Component**는 `"use client"` 명시
- **Server Component**가 기본값
- **Props 타입**은 interface 또는 type으로 정의

```tsx
// 권장
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

export function Counter({ title, count, onIncrement }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>+</button>
    </div>
  );
}

// 지양
class Counter extends React.Component {
  // ...
}
```

### 타입

- **TypeScript `interface`** 우선 사용 (객체 타입)
- **`type`**은 유니온, 교차, 프리미티브 타입에 사용
- **Zod 스키마**로 런타임 검증

```typescript
// interface 사용 (객체 타입)
interface User {
  id: string;
  email: string;
  name: string;
}

// type 사용 (유니온, 교차)
type Status = "pending" | "approved" | "rejected";
type UserWithRole = User & { role: "admin" | "user" };

// Zod 스키마 (런타임 검증)
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
});

// type으로 객체 타입 정의 (지양)
type User = {
  id: string;
  email: string;
};
```

### 네이밍

- **컴포넌트**: PascalCase (예: `UserProfile`, `DataTable`)
- **함수**: camelCase (예: `fetchData`, `handleSubmit`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_FILE_SIZE`, `API_URL`)
- **변수**: camelCase (예: `userName`, `isLoading`)
- **인터페이스**: PascalCase (예: `User`, `VehicleData`)
- **타입**: PascalCase (예: `Status`, `UserRole`)

### 주석

- **복잡한 로직**에만 한글 주석
- **함수 설명**은 JSDoc 형식

```typescript
/**
 * Tesla KPI 데이터를 차트 데이터 형식으로 변환합니다.
 * @param data - Tesla KPI 데이터 배열
 * @returns 차트 데이터 객체
 */
export function transformChartData(data: TeslaKPIData[]): ChartData {
  // SOC 데이터 추출
  const socData = data.map((d) => d.soc_ave);

  // 타임스탬프(초) 추출
  const labels = data.map((d) => `${d.timestamps.toFixed(1)}s`);

  return { labels, datasets: [{ label: "SOC", data: socData }] };
}
```

### Import 순서

```typescript
// 1. React 및 Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. 외부 라이브러리
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 3. 내부 컴포넌트
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. 유틸리티 및 타입
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/types";

// 5. 스타일 (필요 시)
import "./styles.css";
```

## 메타데이터 전략

### 메타데이터 구조

각 페이지에 `layout.tsx` 파일을 추가하여 메타데이터를 정의합니다.

**공개 페이지** (홈, 로그인):

```typescript
// app/page.tsx (또는 app/layout.tsx)
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "퓨처모빌리티AI - OBD·AI 기반 차량 데이터 분석",
  description:
    "OBD 센서 기반 실시간 차량 데이터 수집 및 AI 분석 솔루션. 배터리 상태 모니터링, 위험 예측, 디지털 트윈 기술을 제공합니다.",
  keywords: [
    "차량 데이터",
    "OBD",
    "AI 분석",
    "디지털트윈",
    "배터리 모니터링",
    "Future Mobility",
  ],
  openGraph: {
    title: "퓨처모빌리티AI",
    description: "OBD·AI 기반 차량 데이터 분석 솔루션",
    url: "https://futuremobility.ai",
    siteName: "퓨처모빌리티AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "퓨처모빌리티AI 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "퓨처모빌리티AI",
    description: "OBD·AI 기반 차량 데이터 분석 솔루션",
    images: ["/twitter-image.jpg"],
  },
};
```

**비공개 페이지** (대시보드, 데이터, 설정):

```typescript
// app/dashboard/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 | 퓨처모빌리티AI",
  description: "차량 데이터 현황을 한눈에 확인하세요.",
  robots: {
    index: false, // 검색 엔진 색인 방지
    follow: false, // 링크 추적 방지
  },
};
```

### SEO 전략

- **공개 페이지**: 검색 엔진 최적화 (OpenGraph, keywords, sitemap)
- **비공개 페이지**: 검색 엔진 제외 (`noindex, nofollow`)
- **개인정보 보호**: 사용자 데이터가 포함된 페이지는 색인 방지
- **동적 메타데이터**: 페이지 내용에 따라 메타데이터 동적 생성

**동적 메타데이터 예시**:

```typescript
// app/data/[id]/page.tsx
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("file_uploads")
    .select("file_name, vehicle_type")
    .eq("id", params.id)
    .single();

  return {
    title: `${data?.file_name} | 퓨처모빌리티AI`,
    description: `차량 타입: ${data?.vehicle_type}`,
    robots: { index: false, follow: false },
  };
}
```

## 관련 문서

- [색상 시스템](./COLOR_SYSTEM.md)
- [인증 시스템](./AUTHENTICATION.md) (작성 예정)
- [배포 가이드](./DEPLOYMENT.md) (작성 예정)
- [문제 해결](./TROUBLESHOOTING.md) (작성 예정)

---

**최종 업데이트**: 2025-11-25
**버전**: 0.3.0
