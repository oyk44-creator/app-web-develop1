"use client";

import { Cookie } from "lucide-react";
import { forwardRef, useState, useEffect, useCallback } from "react";

// import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CookieConsentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "small" | "mini";
  demo?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  expiresDays?: number; // 쿠키 만료일(일 단위)
  learnMoreHref?: string;
  cookieName?: string; // 추가: 쿠키 이름
}

const CookieConsent = forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      variant = "default",
      demo = false,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      expiresDays = 365,
      cookieName = "cookieConsent",
      learnMoreHref = "#",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
      try {
        setIsOpen(true);
        if (
          (document.cookie.includes(`${cookieName}=true`) ||
            document.cookie.includes(`${cookieName}=false`)) &&
          !demo
        ) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);
        }
      } catch (error) {
        console.warn("Cookie consent error:", error);
      }
    }, [demo, cookieName]);

    const handleAccept = useCallback(() => {
      setIsOpen(false);
      // 만료일 계산
      const expires = new Date();
      expires.setDate(expires.getDate() + expiresDays);
      document.cookie = `${cookieName}=true; expires=${expires.toUTCString()}; path=/`;
      setTimeout(() => {
        setHide(true);
      }, 700);
      onAcceptCallback();
    }, [onAcceptCallback, expiresDays, cookieName]);

    const handleDecline = useCallback(() => {
      setIsOpen(false);
      // 만료일 계산
      const expires = new Date();
      expires.setDate(expires.getDate() + expiresDays);
      document.cookie = `${cookieName}=false; expires=${expires.toUTCString()}; path=/`;
      setTimeout(() => {
        setHide(true);
      }, 700);
      onDeclineCallback();
    }, [onDeclineCallback, expiresDays, cookieName]);

    if (hide) return null;

    const containerClasses = cn(
      "fixed z-50 transition-all duration-700",
      !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
      className
    );

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        variant === "mini"
          ? "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
          : "bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md"
      ),
      ...props,
    };

    if (variant === "default") {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">쿠키를 사용합니다</CardTitle>
              <Cookie className="h-5 w-5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription className="text-sm">
                저희는 웹사이트에서 최상의 경험을 제공하기 위해 쿠키를
                사용합니다. 쿠키 사용에 대한 자세한 정보는 쿠키 정책을
                참조하세요.
              </CardDescription>
              <a
                href={learnMoreHref}
                className="text-xs text-primary underline underline-offset-4 hover:no-underline"
              >
                더 알아보기
              </a>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button
                onClick={handleDecline}
                variant="secondary"
                className="flex-1"
              >
                거부
              </Button>
              <Button onClick={handleAccept} className="flex-1">
                동의
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === "small") {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg">
            <CardHeader className="flex h-0 flex-row items-center justify-between space-y-0 px-4 pb-2">
              <CardTitle className="text-base">쿠키를 사용합니다</CardTitle>
              <Cookie className="h-4 w-4" />
            </CardHeader>
            <CardContent className="px-4 pb-2 pt-0">
              <CardDescription className="text-sm">
                저희는 웹사이트에서 최상의 경험을 제공하기 위해 쿠키를
                사용합니다. 쿠키 사용에 대한 자세한 정보는 쿠키 정책을
                참조하세요.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex h-0 gap-2 px-4 py-2">
              <Button
                onClick={handleDecline}
                variant="secondary"
                size="sm"
                className="flex-1 rounded-full"
              >
                거부
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 rounded-full"
              >
                동의
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === "mini") {
      return (
        <div {...commonWrapperProps}>
          <Card className="mx-3 p-0 py-3 shadow-lg">
            <CardContent className="grid gap-4 p-0 px-3.5 sm:flex">
              <CardDescription className="flex-1 text-xs sm:text-sm">
                저희는 웹사이트에서 최상의 경험을 제공하기 위해 쿠키를
                사용합니다. 쿠키 사용에 대한 자세한 정보는 쿠키 정책을
                참조하세요.
              </CardDescription>
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <Button
                  onClick={handleDecline}
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs"
                >
                  거부
                  <span className="sr-only sm:hidden">거부</span>
                </Button>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="h-7 text-xs"
                >
                  동의
                  <span className="sr-only sm:hidden">동의</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }
);

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;
