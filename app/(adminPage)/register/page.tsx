import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RegisterForm } from "@/components/form/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | 퓨처모빌리티AI",
  description:
    "퓨처모빌리티AI에 회원가입하여 차량 데이터 수집, 분석, 시각화 서비스를 이용하세요.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
