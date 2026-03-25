"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/; // 예: 010-1234-5678

const ProfileSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.trim() === "" || phoneRegex.test(v.trim()), {
      message: "올바른 전화번호 형식(010-1234-5678)",
    }),
  avatar_url: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || z.string().url().safeParse(v).success, {
      message: "올바른 URL을 입력하세요",
    }),
  company: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length >= 2, {
      message: "회사명은 2자 이상이어야 합니다",
    }),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

interface UserProfileFormProps {
  initialProfile?: {
    phone?: string | null;
    avatar_url?: string | null;
    company?: string | null;
  };
  userId?: string;
}

export function UserProfileForm({
  initialProfile,
  userId,
}: UserProfileFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      phone: initialProfile?.phone ?? "",
      avatar_url: initialProfile?.avatar_url ?? "",
      company: initialProfile?.company ?? "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    // 서버에서 전달된 초기 프로필이 있으면 그대로 사용하고,
    // 없을 때만 클라이언트에서 불러옵니다.
    if (initialProfile) {
      form.reset({
        phone: initialProfile.phone ?? "",
        avatar_url: initialProfile.avatar_url ?? "",
        company: initialProfile.company ?? "",
      });
      return;
    }

    async function loadProfile() {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("phone, avatar_url, company")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        console.error("Failed to load profile", error);
        toast.error("프로필 정보를 불러오지 못했습니다.");
      } else if (data) {
        form.reset({
          phone: (data.phone as string | null) ?? "",
          avatar_url: (data.avatar_url as string | null) ?? "",
          company: (data.company as string | null) ?? "",
        });
      }
      setLoading(false);
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userId,
    initialProfile?.phone,
    initialProfile?.avatar_url,
    initialProfile?.company,
  ]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    setLoading(true);
    const payload = {
      phone: values.phone ?? null,
      avatar_url: values.avatar_url ? values.avatar_url : null,
      company: values.company ?? null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("user_profiles")
      .update(payload)
      .eq("id", userId);

    setLoading(false);
    if (error) {
      console.error("Failed to update profile", error);
      toast.error("프로필 업데이트에 실패했습니다.");
    } else {
      toast.success("프로필이 업데이트되었습니다.");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input placeholder="010-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아바타 URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사</FormLabel>
                  <FormControl>
                    <Input placeholder="회사명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={loading || form.formState.isSubmitting}
              >
                {loading ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
