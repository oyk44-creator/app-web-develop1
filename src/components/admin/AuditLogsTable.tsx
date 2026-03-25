"use client";

import { useState, useMemo } from "react";
import { Shield, User, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditLogsTableProps {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Get unique actions for filter
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((log) => log.action));
    return Array.from(actions);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Action filter
      if (selectedAction !== "all" && log.action !== selectedAction) {
        return false;
      }

      // Keyword filter
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        return (
          log.action.toLowerCase().includes(keyword) ||
          log.resource_type.toLowerCase().includes(keyword) ||
          (log.user_email && log.user_email.toLowerCase().includes(keyword))
        );
      }

      return true;
    });
  }, [logs, selectedAction, searchKeyword]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { label: string; variant: any }> = {
      CREATE: { label: "생성", variant: "default" },
      UPDATE: { label: "수정", variant: "secondary" },
      DELETE: { label: "삭제", variant: "destructive" },
      LOGIN: { label: "로그인", variant: "outline" },
      LOGOUT: { label: "로그아웃", variant: "outline" },
      LOGIN_FAILED: { label: "로그인 실패", variant: "destructive" },
      VIEW: { label: "조회", variant: "secondary" },
    };

    const badge = actionMap[action] || {
      label: action,
      variant: "outline",
    };

    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getResourceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      vehicle_data: "배터리 데이터",
      file_upload: "파일 업로드",
      user_profile: "사용자 프로필",
      user_settings: "사용자 설정",
      user_auth: "사용자 인증",
    };

    return typeMap[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          감사 로그
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="작업, 리소스 또는 사용자 이메일 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="작업 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  전체 작업
                </div>
              </SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          전체 {logs.length}개 중 {filteredLogs.length}개 로그 표시
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead>작업</TableHead>
                <TableHead>리소스 유형</TableHead>
                <TableHead>리소스 ID</TableHead>
                <TableHead>IP 주소</TableHead>
                <TableHead>상세 정보</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(log.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {log.user_email || log.user_id || "시스템"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      {getResourceTypeLabel(log.resource_type)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.resource_id ? (
                        <code className="rounded bg-muted px-1 py-0.5">
                          {log.resource_id.slice(0, 8)}...
                        </code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {log.details ? JSON.stringify(log.details) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
