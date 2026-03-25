"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecentDataSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentDataTableProps {
  data: RecentDataSummary[];
}

export function RecentDataTable({ data }: RecentDataTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">최근 업로드 데이터</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/data/list">
              전체 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>파일명</TableHead>
                <TableHead>업로드 날짜</TableHead>
                <TableHead>소스</TableHead>
                <TableHead className="text-right">SOC</TableHead>
                <TableHead className="text-right">SOH</TableHead>
                <TableHead className="text-right">배터리 온도</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <p className="text-muted-foreground">
                      업로드된 데이터가 없습니다
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => (window.location.href = `/data/${row.id}`)}
                  >
                    <TableCell>{row.file_name}</TableCell>
                    <TableCell>{formatDate(row.upload_date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.data_source === "file" ? "default" : "secondary"
                        }
                      >
                        {row.data_source === "file" ? "파일" : "수기"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.key_metrics.soc !== undefined
                        ? `${row.key_metrics.soc.toFixed(1)}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.key_metrics.soh !== undefined
                        ? `${row.key_metrics.soh.toFixed(1)}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.key_metrics.battery_temp !== undefined
                        ? `${row.key_metrics.battery_temp.toFixed(1)}°C`
                        : "-"}
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
