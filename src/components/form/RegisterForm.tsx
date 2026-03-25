"use client";

import { useState } from "react";
import { Send, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

// 폼 스키마 정의
const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 주소를 입력해주세요"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해주세요",
  }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  // 체크박스 값 감시
  const agreeToTerms = watch("agreeToTerms");
  const agreeToPrivacy = watch("agreeToPrivacy");

  // 전체 동의 처리
  const handleAgreeAll = (checked: boolean) => {
    setValue("agreeToTerms", checked);
    setValue("agreeToPrivacy", checked);
  };

  // 모든 약관에 동의했는지 확인
  const isAllAgreed = agreeToTerms && agreeToPrivacy;

  // 폼 유효성 검사 실패 시 호출
  const onError = () => {
    // 에러 메시지 재표시를 위한 키 증가
    setErrorKey((prev) => prev + 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      const supabase = createClient();

      // emailRedirectTo URL 생성 (redirect 파라미터가 있으면 포함)
      // 환경 변수 사용으로 일관된 리다이렉트 보장
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectUrl = new URL("/api/auth/callback", baseUrl);

      if (redirect) {
        redirectUrl.searchParams.set("redirect", redirect);
      }

      // Supabase Magic Link 전송
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: redirectUrl.toString(),
        },
      });

      if (error) {
        throw error;
      }

      // 이메일 발송 성공 상태로 전환
      setSentEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error("로그인 링크 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-8">
        {emailSent ? (
          // 이메일 발송 완료 안내 화면
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Mail className="h-16 w-16 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h2 className="text-2xl font-bold text-foreground">
                  이메일 전송 완료
                </h2>
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {sentEmail}
                </span>
                <br />로 로그인 링크를 전송했습니다
              </p>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-foreground">
                다음 단계를 진행해주세요:
              </p>
              <ol className="space-y-2 text-left text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>이메일 수신함을 확인하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>로그인 링크를 클릭하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>자동으로 로그인됩니다</span>
                </li>
              </ol>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                이메일이 오지 않았나요? 스팸 메일함을 확인하거나 몇 분 후 다시
                시도해주세요.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setSentEmail("");
                reset();
              }}
            >
              다른 이메일로 로그인
            </Button>
          </div>
        ) : (
          // 로그인 폼
          <>
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                퓨처모빌리티AI
              </h1>
              <p className="text-base text-muted-foreground">
                이메일 주소를 입력하시면 로그인 링크를 보내드립니다
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="mt-4 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  autoFocus
                  disabled={loading}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    key={`email-error-${errorKey}`}
                    className="animate-shake text-sm text-destructive"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 약관 동의 체크박스 */}
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                {/* 전체 동의 */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeAll"
                    checked={isAllAgreed}
                    onCheckedChange={handleAgreeAll}
                    disabled={loading}
                  />
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor="agreeAll"
                      className="cursor-pointer text-sm font-semibold"
                    >
                      전체 동의
                    </label>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* 이용약관 동의 */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setValue("agreeToTerms", checked as boolean)
                    }
                    disabled={loading}
                  />
                  <div className="flex-1 space-y-1 leading-none">
                    <label
                      htmlFor="agreeToTerms"
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <span className="text-destructive">[필수]</span>
                      <span>이용약관 동의</span>
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        보기
                      </a>
                    </label>
                  </div>
                </div>
                {errors.agreeToTerms && (
                  <p
                    key={`terms-error-${errorKey}`}
                    className="animate-shake ml-7 text-sm text-destructive"
                  >
                    {errors.agreeToTerms.message}
                  </p>
                )}

                {/* 개인정보 처리방침 동의 */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={agreeToPrivacy}
                    onCheckedChange={(checked) =>
                      setValue("agreeToPrivacy", checked as boolean)
                    }
                    disabled={loading}
                  />
                  <div className="flex-1 space-y-1 leading-none">
                    <label
                      htmlFor="agreeToPrivacy"
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <span className="text-destructive">[필수]</span>
                      <span>개인정보 처리방침 동의</span>
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        보기
                      </a>
                    </label>
                  </div>
                </div>
                {errors.agreeToPrivacy && (
                  <p
                    key={`privacy-error-${errorKey}`}
                    className="animate-shake ml-7 text-sm text-destructive"
                  >
                    {errors.agreeToPrivacy.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    로그인 링크 받기
                  </>
                )}
              </Button>

              <Alert>
                <AlertDescription>
                  비밀번호 없이 이메일만으로 안전하게 로그인할 수 있습니다.
                </AlertDescription>
              </Alert>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
