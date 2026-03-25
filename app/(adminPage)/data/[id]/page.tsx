"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { KpiSummaryCard, KpiSummary } from "@/components/data/KpiSummaryCard";

interface FileUpload {
  id: string;
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

interface TeslaKpiDataRow {
  id: string;
  timestamps: number;
  di_vehicle_speed: number | null;
  di_accel_pedal_pos: number | null;
  batt_voltage: number | null;
  batt_current: number | null;
  pack_power: number | null;
  soc_ui: number | null;
  soc_ave: number | null;
  bms_max_pack_temp: number | null;
  accel: number | null;
  energy_wh: number | null;
  delta_s_km: number | null;
  risk_score: number | null;
  created_at: string;
}

export default function DataDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.id as string;

  const [upload, setUpload] = useState<FileUpload | null>(null);
  const [data, setData] = useState<TeslaKpiDataRow[]>([]);
  const [kpiSummary, setKpiSummary] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "100",
        });

        const response = await fetch(`/api/data/${uploadId}?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setUpload(result.upload);
        setData(result.data);
        setTotalCount(result.pagination.total);

        // KPI 요약 데이터 가져오기
        const summaryResponse = await fetch(
          `/api/data/kpi-summary?uploadId=${uploadId}`
        );
        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          setKpiSummary(summaryResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uploadId, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatNumber = (
    value: number | null | undefined,
    decimals: number = 2
  ) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(decimals);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/data/${uploadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete data");
      }

      toast.success("데이터가 성공적으로 삭제되었습니다");
      router.push("/data/list");
      router.refresh(); // 목록 페이지 새로고침
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(
        error instanceof Error ? error.message : "데이터 삭제에 실패했습니다"
      );
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading && !upload) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              데이터를 불러오는 중...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertDescription>업로드된 파일을 찾을 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/data/list")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </div>

        {/* File Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{upload.file_name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  데이터 내보내기
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">차량 종류</p>
                <p className="text-lg font-medium">
                  {upload.vehicle_type === "tesla" ? (
                    <span className="text-red-600">Tesla</span>
                  ) : upload.vehicle_type === "ionic" ? (
                    <span className="text-blue-600">Ioniq</span>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">파일 크기</p>
                <p className="text-lg font-medium">
                  {formatFileSize(upload.file_size)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">레코드 수</p>
                <p className="text-lg font-medium">
                  {upload.total_records?.toLocaleString() || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">업로드 일시</p>
                <p className="text-lg font-medium">
                  {formatDate(upload.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Summary */}
        {kpiSummary && <KpiSummaryCard kpiSummary={kpiSummary} />}

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tesla 데이터 ({totalCount.toLocaleString()}개 레코드)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  데이터를 불러오는 중...
                </p>
              </div>
            ) : data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">
                          시간(s)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          속도(km/h)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          가속페달(%)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          전압(V)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          전류(A)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          출력(W)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          SOC(%)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          팩온도(℃)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          가속도(m/s²)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          에너지(Wh)
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          위험점수
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30">
                          <td className="px-3 py-2 font-mono text-xs">
                            {formatNumber(row.timestamps, 2)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.di_vehicle_speed, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.di_accel_pedal_pos, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.batt_voltage, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.batt_current, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.pack_power, 0)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.soc_ui, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.bms_max_pack_temp, 1)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.accel, 3)}
                          </td>
                          <td className="px-3 py-2">
                            {formatNumber(row.energy_wh, 4)}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`font-medium ${
                                row.risk_score !== null && row.risk_score >= 50
                                  ? "text-red-600"
                                  : row.risk_score !== null &&
                                      row.risk_score >= 20
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            >
                              {formatNumber(row.risk_score, 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalCount > 100 && (
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                      {totalCount.toLocaleString()}개 중{" "}
                      {((currentPage - 1) * 100 + 1).toLocaleString()}-
                      {Math.min(currentPage * 100, totalCount).toLocaleString()}
                      개 표시
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        이전
                      </Button>
                      <div className="flex items-center px-3 text-sm">
                        페이지 {currentPage} / {Math.ceil(totalCount / 100)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage * 100 >= totalCount}
                      >
                        다음
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  데이터가 없습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>데이터 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 이 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수
                없습니다.
                <br />
                <br />
                <strong>파일명:</strong> {upload.file_name}
                <br />
                <strong>레코드 수:</strong>{" "}
                {upload.total_records?.toLocaleString()}개
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  "삭제"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
