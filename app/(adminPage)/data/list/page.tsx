"use client";

import { useState, useEffect } from "react";
import { Plus, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchBar, SearchFilters } from "@/components/data/SearchBar";
import { motion } from "framer-motion";

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

export default function DataListPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    startDate: "",
    endDate: "",
  });

  // Fetch data from API
  const fetchUploads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(filters.keyword && { keyword: filters.keyword }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/data/uploads?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setUploads(result.data);
      setTotalCount(result.pagination.total);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      toast.error("데이터를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [currentPage, filters]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
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
      completed: { text: "완료", className: "bg-green-100 text-green-800" },
      processing: { text: "처리중", className: "bg-blue-100 text-blue-800" },
      uploading: {
        text: "업로드중",
        className: "bg-yellow-100 text-yellow-800",
      },
      failed: { text: "실패", className: "bg-red-100 text-red-800" },
    };
    const badge = badges[status] || {
      text: status,
      className: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 tracking-tight">업로드된 파일 목록</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            업로드한 데이터 파일을 확인하고 관리하세요
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-6 flex justify-center">
          <Button
            size="lg"
            onClick={() => router.push("/data/upload")}
            className="group bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600"
          >
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            새 데이터 업로드
          </Button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onReset={handleReset} />

        {/* Results Info */}
        {totalCount > 0 && (
          <Alert className="mb-4 rounded-2xl border-slate-800 bg-slate-900/50">
            <AlertDescription className="text-slate-400">
              총 <strong className="text-white">{totalCount}</strong>개의 파일이
              업로드되었습니다.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Card className="rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-slate-400" />
              <p className="mt-4 text-sm text-slate-400">
                데이터를 불러오는 중...
              </p>
            </CardContent>
          </Card>
        ) : uploads.length > 0 ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
            <Card className="relative rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          파일명
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          차량
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          파일 크기
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          상태
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          레코드 수
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          업로드 일시
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          완료 일시
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {uploads.map((upload, index) => (
                        <motion.tr
                          key={upload.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="cursor-pointer transition-colors hover:bg-slate-900/50"
                          onClick={() => router.push(`/data/${upload.id}`)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-white">
                            {upload.file_name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {upload.vehicle_type === "tesla" ? (
                              <span className="font-medium text-red-400">
                                Tesla
                              </span>
                            ) : upload.vehicle_type === "ionic" ? (
                              <span className="font-medium text-blue-400">
                                Ioniq
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {formatFileSize(upload.file_size)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getStatusBadge(upload.upload_status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {upload.processed_records !== null &&
                            upload.total_records !== null
                              ? `${upload.processed_records.toLocaleString()} / ${upload.total_records.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {formatDate(upload.created_at)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {upload.completed_at
                              ? formatDate(upload.completed_at)
                              : "-"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalCount > 20 && (
                  <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
                    <div className="text-sm text-slate-400">
                      {totalCount}개 중 {(currentPage - 1) * 20 + 1}-
                      {Math.min(currentPage * 20, totalCount)}개 표시
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        이전
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage * 20 >= totalCount}
                      >
                        다음
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h3 className="mb-2 text-lg font-semibold text-white">
                업로드된 파일이 없습니다
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                파일을 업로드하여 데이터 분석을 시작해보세요.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/data/upload")}
                className="group bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600"
              >
                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                첫 파일 업로드하기
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
