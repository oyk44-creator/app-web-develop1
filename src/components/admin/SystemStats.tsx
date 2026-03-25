"use client";

import { Users, Database, Upload, Activity } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export interface SystemStatsData {
  totalUsers: number;
  totalDataPoints: number;
  totalFileUploads: number;
  activeUsersLast7Days: number;
}

interface SystemStatsProps {
  stats: SystemStatsData;
}

export function SystemStats({ stats }: SystemStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <StatsCard
        title="전체 사용자 수"
        value={stats.totalUsers}
        unit="명"
        icon={Users}
        iconColor="bg-blue-500"
      />
      <StatsCard
        title="전체 데이터 건수"
        value={stats.totalDataPoints}
        unit="건"
        icon={Database}
        iconColor="bg-purple-500"
      />
      <StatsCard
        title="파일 업로드 건수"
        value={stats.totalFileUploads}
        unit="건"
        icon={Upload}
        iconColor="bg-pink-500"
      />
      <StatsCard
        title="최근 7일 활동 사용자"
        value={stats.activeUsersLast7Days}
        unit="명"
        icon={Activity}
        iconColor="bg-green-500"
      />
    </div>
  );
}
