"use client";

import CookieConsent, {
  CookieConsentProps,
} from "@/components/layout/footer/CookieConsentCard";
import dynamic from "next/dynamic";

// const CookieConsent = dynamic(
//   () =>
//     import("@/components/ui/components/Card/cookie-consent-card").then(
//       (mod) => mod.CookieConsent
//     ),
//   { ssr: false }
// );

// import type { CookieConsentProps } from "@workspace/ui/components/Card/cookie-consent-card";

export default function CookieConsentProvider(
  props: CookieConsentProps & {
    onAcceptCallback?: () => void;
    onDeclineCallback?: () => void;
  }
) {
  const { onAcceptCallback, onDeclineCallback, ...rest } = props;
  return (
    <CookieConsent
      {...rest}
      onAcceptCallback={onAcceptCallback}
      onDeclineCallback={onDeclineCallback}
    />
  );
}
