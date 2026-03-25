"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  Download,
  FileText,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface VehicleDataRow {
  id: string;
  file_name: string;
  upload_date: string;
  data_source: "file" | "manual";
  soc: number;
  soh: number;
  battery_temp: number;
}

interface DataTableProps {
  data: VehicleDataRow[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

type SortField =
  | "file_name"
  | "upload_date"
  | "data_source"
  | "soc"
  | "soh"
  | "battery_temp";
type SortDirection = "asc" | "desc" | null;

export function DataTable({
  data,
  loading = false,
  onDelete,
  onDownload,
}: DataTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("upload_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
            ? null
            : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleRowClick = (id: string) => {
    router.push(`/data/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (
      window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      onDelete?.(id);
    }
  };

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDownload?.(id);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("file_name")}
              >
                <div className="flex items-center">
                  파일명
                  <SortIcon field="file_name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("upload_date")}
              >
                <div className="flex items-center">
                  업로드 일시
                  <SortIcon field="upload_date" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("data_source")}
              >
                <div className="flex items-center">
                  데이터 소스
                  <SortIcon field="data_source" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("soc")}
              >
                <div className="flex items-center justify-end">
                  SOC (%)
                  <SortIcon field="soc" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("soh")}
              >
                <div className="flex items-center justify-end">
                  SOH (%)
                  <SortIcon field="soh" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("battery_temp")}
              >
                <div className="flex items-center justify-end">
                  배터리 온도
                  <SortIcon field="battery_temp" />
                </div>
              </TableHead>
              <TableHead className="text-center">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {row.file_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(row.upload_date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.data_source === "file" ? "default" : "secondary"
                      }
                    >
                      {row.data_source === "file" ? "파일 업로드" : "수기 입력"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.soc.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {row.soh.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {row.battery_temp.toFixed(1)}°C
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(row.id);
                        }}
                        title="상세보기"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onDownload && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleDownload(e, row.id)}
                          title="다운로드"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(e, row.id)}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          전체 {data.length}개 중 {page * pageSize + 1}-
          {Math.min((page + 1) * pageSize, data.length)}개 표시
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10개</SelectItem>
              <SelectItem value="20">20개</SelectItem>
              <SelectItem value="50">50개</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              이전
            </Button>
            <div className="px-3 text-sm">
              {page + 1} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
