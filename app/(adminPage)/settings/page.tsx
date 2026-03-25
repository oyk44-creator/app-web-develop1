import { Settings } from "lucide-react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AppSettings } from "@/components/settings/AppSettings";

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UserProfileForm } from "@/components/form/UserProfileForm";

export const metadata: Metadata = {
  title: "설정 | 퓨처모빌리티AI",
  description: "계정 정보 및 애플리케이션 설정을 관리하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile:
    | {
        phone?: string | null;
        company?: string | null;
        avatar_url?: string | null;
      }
    | undefined;
  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("phone, company, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    profile = data
      ? {
          phone: (data.phone as string | null) ?? null,
          company: (data.company as string | null) ?? null,
          avatar_url: (data.avatar_url as string | null) ?? null,
        }
      : undefined;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1>설정</h1>
          </div>
          <p className="text-base text-muted-foreground">
            계정 정보 및 애플리케이션 환경을 설정하세요
          </p>
        </div>

        {/* Settings Sections */}
        <div className="flex flex-col gap-4">
          <AccountSettings
            user={
              user
                ? {
                    email: user.email || "user@example.com",
                    created_at: user.created_at || new Date().toISOString(),
                  }
                : undefined
            }
            avatarUrl={profile?.avatar_url ?? null}
          />
          <UserProfileForm
            initialProfile={
              profile
                ? {
                    phone: profile.phone ?? null,
                    company: profile.company ?? null,
                    avatar_url: profile.avatar_url ?? null,
                  }
                : undefined
            }
            userId={user?.id}
          />
          <AppSettings />
        </div>
      </div>
    </div>
  );
}
