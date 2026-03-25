# 인증 시스템 가이드

퓨처모빌리티AI 프론트엔드의 Supabase 기반 인증 시스템 가이드입니다.

## 목차

- [개요](#개요)
- [Magic Link 로그인](#magic-link-로그인)
- [미들웨어 기반 라우트 보호](#미들웨어-기반-라우트-보호)
- [useAuth 훅](#useauth-훅)
- [역할 기반 접근 제어 (RBAC)](#역할-기반-접근-제어-rbac)
- [세션 관리](#세션-관리)
- [감사 로그](#감사-로그)
- [인증 페이지 구현](#인증-페이지-구현)

## 개요

프로젝트는 **Supabase Auth**를 사용하여 사용자 인증을 처리합니다.

### 주요 특징

- **Magic Link 로그인** - 비밀번호 없는 이메일 기반 인증
- **미들웨어 기반 보호** - 인증되지 않은 사용자 자동 리다이렉트
- **세션 자동 갱신** - 사용자 세션 자동 유지
- **역할 기반 접근 제어** - DB 기반 관리자/일반 사용자 구분
- **SSR 지원** - 서버 및 클라이언트 모두에서 인증 상태 접근
- **감사 로그** - 로그인/로그아웃 활동 자동 기록

## Magic Link 로그인

### 사용자 플로우

1. 사용자가 이메일 주소 입력
2. Supabase가 Magic Link를 이메일로 전송
3. 사용자가 이메일의 링크 클릭
4. Supabase가 인증 콜백 처리
5. 자동 로그인 및 대시보드로 리다이렉트

### 구현 위치

- **`app/register/page.tsx`** - 로그인 폼 (Magic Link 진입점)
- **`app/api/auth/callback/route.ts`** - 인증 콜백 처리
- **`middleware.ts`** - 라우트 보호 및 세션 갱신

### 로그인 폼 구현

```tsx
// app/register/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage("Magic Link를 이메일로 전송했습니다. 이메일을 확인하세요.");
    } catch (error: any) {
      setMessage(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">로그인</h1>
        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "전송 중..." : "Magic Link 전송"}
          </Button>

          {message && (
            <p
              className={`text-sm ${
                message.includes("실패") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
```

### 인증 콜백 처리

```typescript
// app/api/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 로그인 후 대시보드로 리다이렉트
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
```

### Supabase 프로젝트 설정

**Redirect URLs 추가**:

1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `http://localhost:3000` (개발), `https://yourdomain.com` (프로덕션)
3. **Redirect URLs**: 다음 URL 추가
   - `http://localhost:3000/api/auth/callback`
   - `https://yourdomain.com/api/auth/callback`

**Email Templates 커스터마이징** (선택사항):

1. Supabase Dashboard → Authentication → Email Templates
2. **Magic Link** 템플릿 선택
3. 한글 메시지로 변경:

```html
<h2>로그인 요청</h2>
<p>아래 버튼을 클릭하여 로그인하세요:</p>
<a href="{{ .ConfirmationURL }}">로그인</a>
<p>이 링크는 {{ .ExpiresIn }}분 동안 유효합니다.</p>
```

## 미들웨어 기반 라우트 보호

### 미들웨어 구현

```typescript
// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - 이미지 파일 (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 미들웨어 유틸리티

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 라우트 체크
  const protectedRoutes = [
    "/dashboard",
    "/data",
    "/charts",
    "/settings",
    "/admin",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 인증되지 않은 사용자가 보호된 페이지 접근 시 리다이렉트
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/register";
    return NextResponse.redirect(url);
  }

  // 관리자 페이지 접근 제어
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isAdmin = await checkAdminRole(user?.email);
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/forbidden";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// 관리자 권한 체크
async function checkAdminRole(email?: string): Promise<boolean> {
  if (!email) return false;

  // 관리자 이메일 목록 (환경 변수 또는 DB에서 관리)
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(email);
}
```

## useAuth 훅

### 커스텀 훅 구현

```typescript
// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 초기 세션 확인
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    checkSession();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/register";
  };

  return { user, isLoading, signOut };
}
```

### 사용 예시

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <div>
      <p>환영합니다, {user.email}님!</p>
      <Button onClick={signOut}>로그아웃</Button>
    </div>
  );
}
```

## 역할 기반 접근 제어 (RBAC)

### DB 기반 역할 관리

사용자 역할은 `user_profiles` 테이블의 `role` 컬럼에 저장됩니다.

```sql
-- user_profiles 테이블 구조
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 관리자 체크 유틸리티

```typescript
// API Route에서 관리자 체크
const { data: profile } = await supabase
  .from("user_profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (profile?.role !== "admin") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### 클라이언트에서 관리자 체크

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export function AdminPanel() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) return;

      const response = await fetch("/api/auth/check-admin", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      setIsAdmin(data.isAdmin);
    };

    checkAdmin();
  }, [user]);

  if (!isAdmin) {
    return <p>권한이 없습니다.</p>;
  }

  return <div>관리자 패널</div>;
}
```

### 관리자 체크 API Route

```typescript
// app/api/auth/check-admin/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const isAdmin = adminEmails.includes(email);

  return NextResponse.json({ isAdmin });
}
```

## 세션 관리

### 세션 확인 (Server Component)

```tsx
// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/register");
  }

  return (
    <div>
      <h1>대시보드</h1>
      <p>환영합니다, {user.email}님!</p>
    </div>
  );
}
```

### 세션 확인 (Client Component)

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedComponent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/register");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>로딩 중...</p>;
  if (!user) return null;

  return <div>보호된 컴포넌트</div>;
}
```

## 감사 로그

### 로그인/로그아웃 기록

모든 인증 활동은 `audit_logs` 테이블에 자동으로 기록됩니다.

```typescript
// 로그아웃 시 감사 로그 기록 (app/api/auth/logout/route.ts)
await supabase.from("audit_logs").insert({
  user_id: userId,
  action: "LOGOUT",
  resource_type: "user_auth",
  details: { email: user.email },
  ip_address: request.headers.get("x-forwarded-for"),
  user_agent: request.headers.get("user-agent"),
});
```

### 감사 로그 타입

| action       | 설명          |
| ------------ | ------------- |
| LOGIN        | 로그인 성공   |
| LOGOUT       | 로그아웃      |
| LOGIN_FAILED | 로그인 실패   |
| CREATE       | 데이터 생성   |
| UPDATE       | 데이터 수정   |
| DELETE       | 데이터 삭제   |

### 관리자 페이지에서 조회

감사 로그는 `/admin` 페이지의 "감사 로그" 탭에서 조회할 수 있습니다.

## 인증 페이지 구현

### 로그인 페이지 (`app/register/page.tsx`)

위의 [Magic Link 로그인](#magic-link-로그인) 섹션 참고

### 권한 부족 페이지 (`app/forbidden/page.tsx`)

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">403 - 접근 권한 없음</h1>
      <p className="mb-6 text-gray-600">이 페이지에 접근할 권한이 없습니다.</p>
      <Link href="/dashboard">
        <Button>대시보드로 돌아가기</Button>
      </Link>
    </div>
  );
}
```

### 로그아웃 처리

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button variant="ghost" onClick={signOut}>
      <LogOut className="mr-2 h-4 w-4" />
      로그아웃
    </Button>
  );
}
```

## 환경 변수 설정

### 필수 환경 변수

```bash
# .env.local

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 관리자 이메일 (쉼표로 구분)
ADMIN_EMAILS=admin@example.com,manager@example.com
```

### Vercel 배포 시 환경 변수 설정

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 위의 환경 변수 추가
4. **Production**, **Preview**, **Development** 모두 체크
5. **Save** 클릭

## 문제 해결

### 로그인 후 리다이렉트 안됨

**원인**: Supabase Redirect URL 설정 누락

**해결**:

1. Supabase Dashboard → Authentication → URL Configuration
2. Redirect URLs에 다음 추가:
   - `http://localhost:3000/api/auth/callback` (개발)
   - `https://yourdomain.com/api/auth/callback` (프로덕션)

### 미들웨어 무한 리다이렉트

**원인**: 미들웨어 `matcher` 설정 오류

**해결**:

```typescript
// middleware.ts
export const config = {
  matcher: [
    // 정적 파일 및 API 인증 경로 제외
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
```

### 세션이 자동으로 만료됨

**원인**: 세션 자동 갱신 누락

**해결**: 미들웨어에서 `updateSession` 호출 확인

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request); // 세션 자동 갱신
}
```

### 관리자 페이지 접근 불가

**원인**: `ADMIN_EMAILS` 환경 변수 미설정

**해결**:

1. `.env.local` 파일에 `ADMIN_EMAILS` 추가
2. 개발 서버 재시작 (`npm run dev` 종료 후 재실행)

## 관련 문서

- [개발 가이드](./DEVELOPMENT.md)
- [API 문서](./API.md)
- [배포 가이드](./DEPLOYMENT.md) (작성 예정)

---

**최종 업데이트**: 2025-11-25
**버전**: 0.3.0
