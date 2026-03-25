"use client";

import CookieConsentProvider from "@/providers/CookieConsentProvider";
import React, { useState } from "react";

export interface CookieConsentProps {
  cookieName?: string;
  title?: string;
  description?: string;
  acceptText?: string;
  declineText?: string;
  learnMoreText?: string;
  learnMoreHref?: string;
  expiresDays?: number;
}

const CookieConsent: React.FC<CookieConsentProps> = (props) => {
  const cookieName = props.cookieName || "cookieConsent";
  // 쿠키 값이 false로 저장되어 있으면 analyticEnabled를 false로 초기화
  // 서버 사이드 렌더링 시에는 항상 true
  const [analyticEnabled, setAnalyticEnabled] = useState<boolean>(
    () =>
      typeof document === "undefined" ||
      !document.cookie.includes(`${cookieName}=false`)
  );

  return (
    <>
      <CookieConsentProvider
        {...props}
        onAcceptCallback={() => setAnalyticEnabled(true)}
        onDeclineCallback={() => setAnalyticEnabled(false)}
      />
      {/* {analyticEnabled && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      )} */}
    </>
  );
};

export default CookieConsent;
