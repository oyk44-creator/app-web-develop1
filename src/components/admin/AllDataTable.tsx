"use client";

import { useState, useMemo } from "react";
import { Eye, FileText, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FileUploadRow {
  id: string;
  user_id: string;
  user_email: string;
  file_name: string;
  file_size: number;
  file_type: string;
  vehicle_type: string | null;
  upload_status: string;
  total_records: number | null;
  processed_records: number | null;
  created_at: string;
  completed_at: string | null;
}

// Keep backward compatibility
export interface AllDataRow {
  id: string;
  user_id: string;
  user_email: string;
  file_name: string;
  upload_date: string;
  data_source: "file" | "manual" | "api";
  soc?: number;
  soh?: number;
  battery_temp?: number;
}

interface AllDataTableProps {
  data: FileUploadRow[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onSearch?: (keyword: string) => void;
  onUserFilter?: (userId: string) => void;
}

export function AllDataTable({
  data,
  loading = false,
  pagination,
  onPageChange,
  onSearch,
  onUserFilter,
}: AllDataTableProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const usersMap = new Map<string, string>();
    data.forEach((row) => {
      if (row.user_id && row.user_email) {
        usersMap.set(row.user_id, row.user_email);
      }
    });
    return Array.from(usersMap.entries()).map(([id, email]) => ({ id, email }));
  }, [data]);

  const handleUserFilterChange = (userId: string) => {
    setSelectedUserId(userId);
    if (onUserFilter) {
      onUserFilter(userId === "all" ? "" : userId);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchKeyword);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      completed: {
        text: "완료",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      processing: {
        text: "처리중",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      uploading: {
        text: "업로드중",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      failed: {
        text: "실패",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    const badge = badges[status] || {
      text: status || "-",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.text}
      </span>
    );
  };

  const getVehicleTypeBadge = (vehicleType: string | null) => {
    if (!vehicleType) return <span className="text-muted-foreground">-</span>;

    if (vehicleType === "tesla") {
      return <span className="font-medium text-red-500">Tesla</span>;
    }
    if (vehicleType === "ionic") {
      return <span className="font-medium text-blue-500">Ioniq</span>;
    }
    return <span className="text-muted-foreground">{vehicleType}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          전체 사용자 파일 업로드
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="파일명 검색 후 Enter..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <Select value={selectedUserId} onValueChange={handleUserFilterChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="사용자 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  전체 사용자
                </div>
              </SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          {pagination ? (
            <>
              전체 {pagination.total}개 중 {data.length}개 항목 표시
            </>
          ) : (
            <>전체 {data.length}개 항목</>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              데이터를 불러오는 중...
            </span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>파일명</TableHead>
                    <TableHead>차량</TableHead>
                    <TableHead>파일 크기</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>레코드 수</TableHead>
                    <TableHead>업로드 일시</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        업로드된 파일이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/data/${row.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{row.user_email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.file_name}
                        </TableCell>
                        <TableCell>
                          {getVehicleTypeBadge(row.vehicle_type)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatFileSize(row.file_size)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(row.upload_status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.processed_records !== null &&
                          row.total_records !== null
                            ? `${row.processed_records.toLocaleString()} / ${row.total_records.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/data/${row.id}`);
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            상세
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {pagination.total}개 중{" "}
                  {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                  개 표시
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
