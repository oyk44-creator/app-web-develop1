"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DATA_RANGES } from "@/lib/constants";

const manualInputSchema = z.object({
  timestamp: z.string().min(1, "측정 시간을 입력해주세요"),
  soc: z
    .number()
    .min(DATA_RANGES.SOC.min, `SOC는 ${DATA_RANGES.SOC.min}% 이상이어야 합니다`)
    .max(DATA_RANGES.SOC.max, `SOC는 ${DATA_RANGES.SOC.max}% 이하여야 합니다`),
  soh: z
    .number()
    .min(DATA_RANGES.SOH.min, `SOH는 ${DATA_RANGES.SOH.min}% 이상이어야 합니다`)
    .max(DATA_RANGES.SOH.max, `SOH는 ${DATA_RANGES.SOH.max}% 이하여야 합니다`),
  battery_temp: z
    .number()
    .min(
      DATA_RANGES.BATTERY_TEMP.min,
      `배터리 온도는 ${DATA_RANGES.BATTERY_TEMP.min}°C 이상이어야 합니다`
    )
    .max(
      DATA_RANGES.BATTERY_TEMP.max,
      `배터리 온도는 ${DATA_RANGES.BATTERY_TEMP.max}°C 이하여야 합니다`
    ),
  voltage: z.number().optional(),
  current: z.number().optional(),
  power: z.number().optional(),
  notes: z.string().optional(),
});

type ManualInputFormData = z.infer<typeof manualInputSchema>;

interface ManualInputFormProps {
  onSubmit: (data: ManualInputFormData) => void;
  isLoading?: boolean;
  vehicleType?: "tesla" | "ionic";
}

export function ManualInputForm({
  onSubmit,
  isLoading = false,
  vehicleType,
}: ManualInputFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualInputFormData>({
    resolver: zodResolver(manualInputSchema),
    defaultValues: {
      timestamp: new Date().toISOString().slice(0, 16),
      soc: 0,
      soh: 0,
      battery_temp: 0,
      voltage: undefined,
      current: undefined,
      power: undefined,
      notes: "",
    },
  });

  const handleFormSubmit = (data: ManualInputFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>수기 데이터 입력</CardTitle>
        <CardDescription>
          차량 데이터를 직접 입력하세요. 필수 항목(*) 은 반드시 입력해야 합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* 측정 시간 */}
          <div className="space-y-2">
            <Label htmlFor="timestamp">
              측정 시간 <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="timestamp"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    id="timestamp"
                    type="datetime-local"
                    className={errors.timestamp ? "border-destructive" : ""}
                  />
                  {errors.timestamp && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.timestamp.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* SOC, SOH, 배터리 온도 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="soc">
                SOC (State of Charge){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="soc"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="soc"
                        type="number"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(parseFloat(e.target.value) || 0)
                        }
                        step={0.1}
                        min={DATA_RANGES.SOC.min}
                        max={DATA_RANGES.SOC.max}
                        className={
                          errors.soc ? "border-destructive pr-8" : "pr-8"
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                    {errors.soc && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.soc.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soh">
                SOH (State of Health){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="soh"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="soh"
                        type="number"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(parseFloat(e.target.value) || 0)
                        }
                        step={0.1}
                        min={DATA_RANGES.SOH.min}
                        max={DATA_RANGES.SOH.max}
                        className={
                          errors.soh ? "border-destructive pr-8" : "pr-8"
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                    {errors.soh && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.soh.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery_temp">
                배터리 온도 <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="battery_temp"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="battery_temp"
                        type="number"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(parseFloat(e.target.value) || 0)
                        }
                        step={0.1}
                        min={DATA_RANGES.BATTERY_TEMP.min}
                        max={DATA_RANGES.BATTERY_TEMP.max}
                        className={
                          errors.battery_temp
                            ? "border-destructive pr-8"
                            : "pr-8"
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                        °C
                      </span>
                    </div>
                    {errors.battery_temp && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.battery_temp.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* 전압, 전류, 전력 (선택) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="voltage">전압 (선택)</Label>
              <Controller
                name="voltage"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="voltage"
                      type="number"
                      value={value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? undefined : parseFloat(val));
                      }}
                      step={0.1}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                      V
                    </span>
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">전류 (선택)</Label>
              <Controller
                name="current"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="current"
                      type="number"
                      value={value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? undefined : parseFloat(val));
                      }}
                      step={0.1}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                      A
                    </span>
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="power">전력 (선택)</Label>
              <Controller
                name="power"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="power"
                      type="number"
                      value={value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? undefined : parseFloat(val));
                      }}
                      step={0.1}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                      kW
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="notes">메모 (선택)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="notes"
                  rows={3}
                  placeholder="추가 정보나 특이사항을 입력하세요"
                />
              )}
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isLoading}
            >
              초기화
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
