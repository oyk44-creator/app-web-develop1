"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PAGINATION, STORAGE_KEYS } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppSettingsState {
  chartColor: string;
  itemsPerPage: number;
  theme: "light" | "dark";
}

const DEFAULT_SETTINGS: AppSettingsState = {
  chartColor: "#3b82f6",
  itemsPerPage: PAGINATION.DEFAULT_LIMIT,
  theme: "light",
};

export function AppSettings() {
  const [settings, setSettings] = useState<AppSettingsState>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USER_SETTINGS,
        JSON.stringify(settings)
      );
      toast.success("설정이 저장되었습니다.");
    } catch (error) {
      toast.error("설정 저장에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    toast.info("설정이 초기화되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>앱 설정</CardTitle>
        <CardDescription>
          애플리케이션 사용 환경을 설정할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Color Setting */}
        <div>
          <Label className="mb-3 block">차트 기본 색상</Label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={settings.chartColor}
              onChange={(e) =>
                setSettings({ ...settings, chartColor: e.target.value })
              }
              className="h-10 w-16 cursor-pointer rounded border border-input"
            />
            <div>
              <p className="text-sm font-medium">{settings.chartColor}</p>
              <p className="text-sm text-muted-foreground">
                차트에서 사용할 기본 색상을 선택하세요
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Items Per Page Setting */}
        <div className="space-y-3">
          <Label htmlFor="items-per-page">페이지당 표시 항목 수</Label>
          <Select
            value={settings.itemsPerPage.toString()}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                itemsPerPage: Number(value),
              })
            }
          >
            <SelectTrigger id="items-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION.LIMIT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}개
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            데이터 목록에서 한 페이지에 표시할 항목 수를 설정합니다
          </p>
        </div>

        <Separator />

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
