import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SNSLogin } from "@/components/auth/SNSLogin";

// 로그인 페이지
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SNSLogin />
      </Suspense>
    </div>
  );
}
