"use client";

import { CheckCircle, AlertCircle, X, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadProgressProps {
  files: UploadFile[];
  onRemove: (id: string) => void;
}

export function UploadProgress({ files, onRemove }: UploadProgressProps) {
  if (files.length === 0) return null;

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getProgressMessage = (progress: number) => {
    if (progress < 50) {
      return "파일 전송 중...";
    } else if (progress < 90) {
      return "서버에서 데이터 처리 중...";
    } else {
      return "완료 처리 중...";
    }
  };

  const getStatusVariant = (
    status: UploadFile["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "uploading":
        return "default";
      case "success":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "uploading":
        return "업로드 중";
      case "success":
        return "완료";
      case "error":
        return "실패";
    }
  };

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold">업로드 진행 상황</h3>
      <div className="space-y-4">
        {files.map((uploadFile) => (
          <Card key={uploadFile.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="pt-0.5">{getStatusIcon(uploadFile.status)}</div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <p
                    className="mr-4 flex-1 truncate text-sm font-medium"
                    title={uploadFile.file.name}
                  >
                    {uploadFile.file.name}
                  </p>
                  <Badge variant={getStatusVariant(uploadFile.status)}>
                    {getStatusText(uploadFile.status)}
                  </Badge>
                </div>

                {uploadFile.status === "uploading" && (
                  <div>
                    <div className="relative">
                      <Progress
                        value={uploadFile.progress}
                        className={cn(
                          "mb-1 h-2",
                          uploadFile.progress >= 50 &&
                            uploadFile.progress < 90 &&
                            "animate-pulse"
                        )}
                      />
                      {/* 진행 중일 때 반짝이는 효과 */}
                      {uploadFile.progress > 0 && uploadFile.progress < 100 && (
                        <div
                          className="absolute left-0 top-0 h-2 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          style={{
                            width: `${uploadFile.progress}%`,
                            animationDuration: "1.5s",
                            animationIterationCount: "infinite",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {getProgressMessage(uploadFile.progress)}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {uploadFile.progress}%
                      </p>
                    </div>
                  </div>
                )}

                {uploadFile.status === "error" && uploadFile.error && (
                  <p className="text-sm text-destructive">{uploadFile.error}</p>
                )}

                {uploadFile.status === "success" && (
                  <p className="text-sm text-muted-foreground">
                    {(uploadFile.file.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(uploadFile.id)}
                disabled={uploadFile.status === "uploading"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
