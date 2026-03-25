"use client";

import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface AccountSettingsProps {
  user?: {
    email: string;
    created_at: string;
  };
  avatarUrl?: string | null;
}

export function AccountSettings({
  user: propUser,
  avatarUrl,
}: AccountSettingsProps) {
  const { signOut } = useAuth();

  // 서버에서 전달된 사용자 정보만 사용하고, 없으면 안전한 기본값 표시
  const user = propUser ?? {
    email: "user@example.com",
    created_at: new Date().toISOString(),
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 설정</CardTitle>
        <CardDescription>
          계정 정보를 확인하고 로그아웃할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="프로필 이미지" />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.email}</h3>
            <p className="text-sm text-muted-foreground">
              가입일:{" "}
              {new Date(user.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Account Actions */}
        <div>
          <h4 className="mb-3 text-sm font-medium">계정 관리</h4>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
