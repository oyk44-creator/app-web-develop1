import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Footer from "@/components/layout/footer/Footer";
import CookieConsent from "@/components/layout/footer/CookieConsentCard";
import Header from "@/components/layout/header/Header";
import { DarkModeToggle } from "@/components/layout/footer/DarkModeToggle";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "퓨처모빌리티AI",
  description: "차량 데이터 수집 및 분석 웹 플랫폼 MVP",
  icons: {
    icon: "/images/Favicon/favicon2.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.className} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="퓨처모빌리티AI" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="퓨처모빌리티AI" />
        <link rel="apple-touch-icon" href="/icons/fmai-icon-192.png" />
      </head>
      <body>
        <ThemeProvider>
          <CookieConsent
            cookieName="welcomede_cookieConsent"
            learnMoreHref="/privacy"
            expiresDays={365}
          />

          <Header />
          <main className="flex min-h-[70vh] flex-col">{children}</main>
          <Footer />

          <div className="fixed bottom-8 right-8 z-50">
            <DarkModeToggle />
          </div>

          {/* Global toast notifications */}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
