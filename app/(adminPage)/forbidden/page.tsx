import Link from "next/link";
import { ShieldAlert, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="mb-2 text-6xl text-destructive">403</h1>
          <h2 className="mb-2 text-2xl font-semibold">접근 권한이 없습니다</h2>
          <p className="text-muted-foreground">
            이 페이지에 접근할 권한이 없습니다.
            <br />
            로그인이 필요하거나 관리자 권한이 필요할 수 있습니다.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              로그인하기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 이동
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            권한이 필요한 경우 관리자에게 문의하세요.
          </p>
          <p className="text-sm text-muted-foreground">
            문제가 지속되면{" "}
            <Link href="/settings" className="text-primary hover:underline">
              고객 지원
            </Link>
            에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
