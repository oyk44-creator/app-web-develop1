"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadZone } from "@/components/data/FileUploadZone";
import { UploadProgress, UploadFile } from "@/components/data/UploadProgress";
import { ManualInputForm } from "@/components/data/ManualInputForm";
import { processTeslaKpiFile } from "@/lib/tesla-kpi-processor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type VehicleType = "tesla" | "ionic" | null;

export default function DataUploadPage() {
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  // 실제 파일 업로드 처리
  const uploadFile = async (file: File): Promise<void> => {
    const uploadId = Math.random().toString(36).substr(2, 9);
    const newUploadFile: UploadFile = {
      id: uploadId,
      file,
      progress: 0,
      status: "uploading",
    };

    setUploadFiles((prev) => [...prev, newUploadFile]);

    try {
      // 파일 검증
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/octet-stream",
      ];

      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(csv|xls|xlsx|dat|mat)$/i)
      ) {
        throw new Error("지원하지 않는 파일 형식입니다");
      }

      if (vehicleType === "tesla") {
        // Tesla: 클라이언트 사이드 처리
        // 1. 클라이언트에서 파일 파싱 및 계산 (0% ~ 80%)
        const processResult = await processTeslaKpiFile(file, (progress) => {
          // 파싱/계산은 0~80%
          const adjustedProgress = Math.round(progress * 0.8);
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId ? { ...f, progress: adjustedProgress } : f
            )
          );
        });

        // 2. 서버로 청크 단위 전송 (80% ~ 98%)
        const CHUNK_SIZE = 2000; // 2000개씩 전송
        const totalChunks = Math.ceil(
          processResult.timeSeriesData.length / CHUNK_SIZE
        );

        // 2-1. 초기화 요청
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 82 } : f))
        );

        const initResponse = await fetch("/api/upload/tesla-kpi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "init",
            fileName: file.name,
            fileSize: file.size,
            totalRecords: processResult.totalRecords,
          }),
        });

        if (!initResponse.ok) {
          const error = await initResponse.json();
          throw new Error(error.error || "업로드 초기화에 실패했습니다");
        }

        const { uploadId: serverUploadId } = await initResponse.json();

        // 2-2. 청크 단위 전송
        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(
            start + CHUNK_SIZE,
            processResult.timeSeriesData.length
          );
          const chunk = processResult.timeSeriesData.slice(start, end);

          const chunkResponse = await fetch("/api/upload/tesla-kpi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "chunk",
              uploadId: serverUploadId,
              chunkIndex: i,
              data: chunk,
            }),
          });

          if (!chunkResponse.ok) {
            const error = await chunkResponse.json();
            throw new Error(
              error.error || `청크 ${i + 1} 업로드에 실패했습니다`
            );
          }

          // 진행률 업데이트 (82% ~ 96%)
          const chunkProgress = 82 + Math.round(((i + 1) / totalChunks) * 14);
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId ? { ...f, progress: chunkProgress } : f
            )
          );
        }

        // 2-3. 완료 요청
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 98 } : f))
        );

        const finalizeResponse = await fetch("/api/upload/tesla-kpi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "finalize",
            uploadId: serverUploadId,
            kpiSummary: processResult.kpiSummary,
            totalRecords: processResult.totalRecords,
          }),
        });

        if (!finalizeResponse.ok) {
          const error = await finalizeResponse.json();
          throw new Error(error.error || "업로드 완료 처리에 실패했습니다");
        }

        const result = await finalizeResponse.json();

        // 업로드 성공
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId ? { ...f, progress: 100, status: "success" } : f
          )
        );

        toast.success(
          `${file.name} 업로드 완료 (${result.recordsProcessed}개 레코드)`
        );
      } else {
        // Ionic: 기존 서버 사이드 처리
        const formData = new FormData();
        formData.append("file", file);

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 5 } : f))
        );

        const response = await new Promise<Response>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const uploadProgress =
                Math.round((event.loaded / event.total) * 45) + 5;
              setUploadFiles((prev) =>
                prev.map((f) =>
                  f.id === uploadId ? { ...f, progress: uploadProgress } : f
                )
              );
            }
          });

          xhr.addEventListener("load", () => {
            setUploadFiles((prev) =>
              prev.map((f) => (f.id === uploadId ? { ...f, progress: 50 } : f))
            );

            const response = new Response(xhr.response, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers({
                "Content-Type":
                  xhr.getResponseHeader("Content-Type") || "application/json",
              }),
            });
            resolve(response);
          });

          xhr.addEventListener("error", () =>
            reject(new Error("네트워크 오류"))
          );
          xhr.addEventListener("abort", () =>
            reject(new Error("업로드 취소됨"))
          );

          xhr.open("POST", "/api/upload/ionic");
          xhr.send(formData);
        });

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 90 } : f))
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "업로드에 실패했습니다");
        }

        const result = await response.json();

        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId ? { ...f, progress: 100, status: "success" } : f
          )
        );

        toast.success(
          `${file.name} 업로드 완료 (${result.recordsProcessed}개 레코드)`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "업로드 중 오류가 발생했습니다";

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId
            ? {
                ...f,
                status: "error",
                error: errorMessage,
              }
            : f
        )
      );

      throw error;
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    try {
      const uploadPromises = files.map((file) => uploadFile(file));
      await Promise.all(uploadPromises);
      toast.success(`${files.length}개 파일이 성공적으로 업로드되었습니다`);
    } catch (error) {
      toast.error("일부 파일 업로드에 실패했습니다");
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleManualSubmit = async (data: any) => {
    try {
      // Mock API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("데이터가 성공적으로 저장되었습니다");
    } catch (error) {
      toast.error("데이터 저장에 실패했습니다");
    }
  };

  // 차량 선택 화면
  if (vehicleType === null) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 tracking-tight">차량 종류 선택</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              데이터를 업로드할 차량 종류를 선택하세요
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Tesla Card */}
            {[
              {
                logoImage: "/images/logo/logo_tesla.png",
                title: "Tesla",
                description: "테슬라 차량 데이터",
                detail: "테슬라 전기차의 배터리 및 주행 데이터를 업로드합니다.",
                gradient: "from-red-500 to-orange-500",
                onClick: () => setVehicleType("tesla"),
                delay: 0,
              },
              {
                logoImage: "/images/logo/logo_ioniq.png",
                title: "Ioniq",
                description: "아이오닉 차량 데이터",
                detail:
                  "현대 아이오닉 전기차의 배터리 및 주행 데이터를 업로드합니다.",
                gradient: "from-blue-500 to-cyan-500",
                onClick: () => setVehicleType("ionic"),
                delay: 0.1,
              },
            ].map((vehicle, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: vehicle.delay }}
                  className="group relative"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${vehicle.gradient} rounded-3xl opacity-0 blur transition duration-500 group-hover:opacity-30`}
                  />
                  <Card
                    className="relative h-full cursor-pointer rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all hover:border-slate-700"
                    onClick={vehicle.onClick}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                          <Image
                            src={vehicle.logoImage}
                            alt={`${vehicle.title} Logo`}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="space-y-3">
                          <CardTitle className="text-2xl text-white">
                            {vehicle.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-400">
                            {vehicle.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm leading-relaxed text-slate-400">
                        {vehicle.detail}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 차량 선택 후 업로드 화면
  const logoImage =
    vehicleType === "tesla"
      ? "/images/logo/logo_tesla.png"
      : "/images/logo/logo_ioniq.png";

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => {
              setVehicleType(null);
              setUploadFiles([]);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            차량 선택으로 돌아가기
          </Button>
        </div>

        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex justify-center">
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src={logoImage}
                alt={`${vehicleType === "tesla" ? "Tesla" : "Ioniq"} Logo`}
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-primary lg:text-6xl">
            데이터 업로드
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            파일을 업로드하거나 데이터를 직접 입력하세요
          </p>
        </div>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="file">파일 업로드</TabsTrigger>
            <TabsTrigger value="manual">수기 입력</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-6">
            <FileUploadZone
              onFilesSelected={handleFilesSelected}
              disabled={uploadFiles.some((f) => f.status === "uploading")}
              vehicleType={vehicleType}
            />
            <UploadProgress files={uploadFiles} onRemove={handleRemoveFile} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <ManualInputForm
              onSubmit={handleManualSubmit}
              vehicleType={vehicleType}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
