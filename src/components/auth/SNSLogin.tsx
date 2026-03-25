"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import LogoImage from "@/components/shared/LogoImage";
import { signinWithGoogle, signinWithKakao } from "@/lib/supabase/actions";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

export function SNSLogin() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const isAllAgreed = agreeToTerms && agreeToPrivacy;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeToTerms(checked);
    setAgreeToPrivacy(checked);
  };

  const handleGoogle = async () => {
    await signinWithGoogle();
  };

  const handleKakao = async () => {
    await signinWithKakao();
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-foreground">퓨처모빌리티AI 로그인</h1>
            <p className="text-base text-muted-foreground">
              소셜 계정으로 간편하게 로그인하세요. 로그인 후 자동으로
              가입됩니다.
            </p>
          </div>
          <LogoImage className="h-48 w-auto" />
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeAll"
                  checked={isAllAgreed}
                  onCheckedChange={handleAgreeAll}
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
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
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
              {/* 약관 에러 출력 로직 제거 (간소화) */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToPrivacy"
                  checked={agreeToPrivacy}
                  onCheckedChange={(checked) => setAgreeToPrivacy(!!checked)}
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
              {/* 개인정보 처리방침 에러 출력 로직 제거 */}
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={!isAllAgreed}
              onClick={handleGoogle}
            >
              <FaGoogle />
              구글 로그인
            </Button>
            <Button
              type="button"
              className="w-full bg-[#FEE500] text-black hover:bg-[#FDD400]"
              size="lg"
              disabled={!isAllAgreed}
              onClick={handleKakao}
            >
              <RiKakaoTalkFill />
              카카오톡 로그인
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
