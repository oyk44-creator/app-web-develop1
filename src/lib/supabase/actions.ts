"use server";

import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { createClient } from "./server";

/**
 * OAuth 로그인 액션 (Google 등)
 */
export const signInWith = async (provider: Provider) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      // 사용자 로그인 계속 자주 보여주지 않도록 설정
      // queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("OAuth error:", error);
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  } else {
    throw new Error("OAuth redirect URL is missing.");
  }
};

/**
 * Google 로그인 액션
 */
export const signinWithGoogle = async () => signInWith("google");

/**
 * Kakao 로그인 액션
 */
export const signinWithKakao = async () => signInWith("kakao");
