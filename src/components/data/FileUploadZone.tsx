"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, AlertCircle } from "lucide-react";
import { FILE_CONFIG } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  vehicleType?: "tesla" | "ionic";
}

// Tesla KPI 필수 헤더
const TESLA_REQUIRED_HEADERS = [
  "timestamps",
  "DI_vehicleSpeed",
  "BattVoltage132",
  "RawBattCurrent132",
  "SOCave292",
];

// Ionic 필수 헤더 (예시 - 실제 스키마에 맞게 수정 필요)
const IONIC_REQUIRED_HEADERS = ["time_s", "speed", "battery_level"];

export function FileUploadZone({
  onFilesSelected,
  disabled = false,
  vehicleType,
}: FileUploadZoneProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // 파일 헤더 검증 함수
  const validateFileHeaders = async (
    file: File
  ): Promise<{ valid: boolean; error?: string; headers?: string[] }> => {
    const requiredHeaders =
      vehicleType === "tesla" ? TESLA_REQUIRED_HEADERS : IONIC_REQUIRED_HEADERS;
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    try {
      let headers: string[] = [];

      if (fileExtension === ".csv") {
        // CSV 파일 헤더 읽기
        const text = await file.text();
        const firstLine = text.split("\n")[0];
        headers = firstLine
          .split(",")
          .map((h) => h.trim().replace(/["\r]/g, ""));
      } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
        // XLSX 파일 헤더 읽기
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        });

        if (jsonData.length > 0) {
          headers = (jsonData[0] as string[]).map((h) => String(h).trim());
        }
      }

      // 필수 헤더 확인
      const missingHeaders = requiredHeaders.filter(
        (required) => !headers.includes(required)
      );

      if (missingHeaders.length > 0) {
        return {
          valid: false,
          error: `필수 헤더가 누락되었습니다: ${missingHeaders.join(", ")}`,
          headers,
        };
      }

      return { valid: true, headers };
    } catch (error) {
      return {
        valid: false,
        error: "파일을 읽는 중 오류가 발생했습니다.",
      };
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setValidationError(null);

      // 파일 검증
      for (const file of acceptedFiles) {
        const validation = await validateFileHeaders(file);

        if (!validation.valid) {
          setValidationError(`${file.name}: ${validation.error}`);
          return; // 검증 실패 시 업로드 중단
        }
      }

      // 검증 통과 시 자동 업로드
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected, vehicleType]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "application/octet-stream": [".dat", ".mat"],
      },
      maxSize: FILE_CONFIG.MAX_SIZE_BYTES,
      maxFiles: FILE_CONFIG.MAX_FILES_PER_UPLOAD,
      disabled,
    });

  return (
    <div>
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-12 transition-all ${isDragActive ? "border-primary bg-accent" : "border-border"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary hover:bg-accent"} `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <CloudUpload
            className={`h-16 w-16 ${
              isDragActive ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <h3 className="text-center text-lg font-semibold">
            {isDragActive
              ? "파일을 여기에 놓으세요"
              : "파일을 드래그하거나 클릭하여 선택하세요"}
          </h3>
          <p className="text-center text-sm text-muted-foreground">
            지원 형식: CSV, Excel (.xls, .xlsx), DAT, MAT
            <br />
            최대 파일 크기: {FILE_CONFIG.MAX_SIZE_MB}MB
            <br />
            최대 {FILE_CONFIG.MAX_FILES_PER_UPLOAD}개 파일까지 업로드 가능
          </p>
        </div>
      </Card>

      {fileRejections.length > 0 && (
        <div className="mt-4 space-y-1">
          {fileRejections.map(({ file, errors }) => (
            <p key={file.name} className="text-sm text-destructive">
              {file.name}: {errors.map((e) => e.message).join(", ")}
            </p>
          ))}
        </div>
      )}

      {validationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>파일 검증 실패</strong>
            <br />
            {validationError}
            <br />
            <br />
            <span className="text-xs">
              {vehicleType === "tesla"
                ? `필수 헤더: ${TESLA_REQUIRED_HEADERS.join(", ")}`
                : `필수 헤더: ${IONIC_REQUIRED_HEADERS.join(", ")}`}
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
