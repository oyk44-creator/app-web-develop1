"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Calendar, Globe, User } from "lucide-react";
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

export interface ErrorLog {
  id: string;
  user_id: string | null;
  user_email?: string | null;
  user_name?: string | null;
  error_type: string;
  error_code: string | null;
  error_message: string;
  context: string;
  resource_type: string | null;
  resource_id: string | null;
  request_path: string | null;
  ip_address: string | null;
  user_agent: string | null;
  environment: string;
  created_at: string;
}

interface ErrorLogsTableProps {
  logs: ErrorLog[];
}

export function ErrorLogsTable({ logs }: ErrorLogsTableProps) {
  const [selectedErrorType, setSelectedErrorType] = useState<string>("all");
  const [selectedContext, setSelectedContext] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Get unique error types and contexts for filters
  const uniqueErrorTypes = useMemo(() => {
    const types = new Set(logs.map((log) => log.error_type));
    return Array.from(types);
  }, [logs]);

  const uniqueContexts = useMemo(() => {
    const contexts = new Set(logs.map((log) => log.context));
    return Array.from(contexts);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Error type filter
      if (selectedErrorType !== "all" && log.error_type !== selectedErrorType) {
        return false;
      }

      // Context filter
      if (selectedContext !== "all" && log.context !== selectedContext) {
        return false;
      }

      // Keyword filter
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        return (
          log.error_message.toLowerCase().includes(keyword) ||
          log.error_type.toLowerCase().includes(keyword) ||
          (log.user_email && log.user_email.toLowerCase().includes(keyword)) ||
          (log.request_path && log.request_path.toLowerCase().includes(keyword))
        );
      }

      return true;
    });
  }, [logs, selectedErrorType, selectedContext, searchKeyword]);

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

  const getErrorTypeBadge = (errorType: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      database_insert_error: { label: "DB 오류", variant: "destructive" },
      validation_error: { label: "검증 오류", variant: "secondary" },
      unexpected_error: { label: "예상치 못한 오류", variant: "destructive" },
      client_error: { label: "클라이언트 오류", variant: "outline" },
      unhandled_error: { label: "처리되지 않은 오류", variant: "destructive" },
      unhandled_promise_rejection: {
        label: "Promise 오류",
        variant: "destructive",
      },
      react_error: { label: "React 오류", variant: "destructive" },
      api_error: { label: "API 오류", variant: "secondary" },
    };

    const badge = typeMap[errorType] || {
      label: errorType,
      variant: "outline" as const,
    };

    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getEnvironmentBadge = (env: string) => {
    const envMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      production: { label: "운영", variant: "destructive" },
      development: { label: "개발", variant: "secondary" },
      client: { label: "클라이언트", variant: "outline" },
    };

    const badge = envMap[env] || { label: env, variant: "outline" as const };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getContextLabel = (context: string) => {
    const contextMap: Record<string, string> = {
      file_upload: "파일 업로드",
      data_processing: "데이터 처리",
      api_call: "API 호출",
      client: "클라이언트",
      global_error_handler: "전역 핸들러",
      error_boundary: "에러 바운더리",
    };

    return contextMap[context] || context;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          시스템 오류 로그
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="오류 메시지, 경로 또는 사용자 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Select
            value={selectedErrorType}
            onValueChange={setSelectedErrorType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="오류 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 유형</SelectItem>
              {uniqueErrorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedContext} onValueChange={setSelectedContext}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="발생 위치" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 위치</SelectItem>
              {uniqueContexts.map((ctx) => (
                <SelectItem key={ctx} value={ctx}>
                  {getContextLabel(ctx)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          전체 {logs.length}개 중 {filteredLogs.length}개 오류 표시
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>환경</TableHead>
                <TableHead>오류 유형</TableHead>
                <TableHead>발생 위치</TableHead>
                <TableHead>오류 메시지</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead>경로</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {logs.length === 0
                      ? "기록된 오류가 없습니다."
                      : "검색 결과가 없습니다."}
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
                      {getEnvironmentBadge(log.environment)}
                    </TableCell>
                    <TableCell>{getErrorTypeBadge(log.error_type)}</TableCell>
                    <TableCell className="text-sm">
                      {getContextLabel(log.context)}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div
                        className="truncate text-sm text-destructive"
                        title={log.error_message}
                      >
                        {log.error_message}
                      </div>
                      {log.error_code && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          코드: {log.error_code}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.user_email ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.user_email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.request_path ? (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <code className="rounded bg-muted px-1 py-0.5">
                            {log.request_path}
                          </code>
                        </div>
                      ) : (
                        "-"
                      )}
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
