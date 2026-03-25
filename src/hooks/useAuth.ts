// useAuth 커스텀 훅
// 인증 상태 및 사용자 정보 관리

"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 현재 사용자 가져오기
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 로그아웃
  const signOut = async () => {
    // 로그아웃 이벤트 기록 (로그아웃 전에 호출)
    if (user) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        // 로그 기록 실패해도 로그아웃은 진행
        console.error("Failed to log logout event:", error);
      }
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
