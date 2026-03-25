"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";

const colorInfo = [
  {
    name: "Primary",
    key: "primary",
    description: "메인 CTA, 강조",
    category: "Blue-Cyan 계열",
  },
  {
    name: "Secondary",
    key: "secondary",
    description: "보조 링크/아이콘",
    category: "Cyan",
  },
  {
    name: "Accent",
    key: "accent",
    description: "액센트 하이라이트",
    category: "Teal",
  },
  {
    name: "Info",
    key: "info",
    description: "정보/분석/차트",
    category: "Blue",
  },
  {
    name: "Purple",
    key: "purple",
    description: "AI/ML 관련",
    category: "Purple",
  },
  {
    name: "Pink",
    key: "pink",
    description: "특별 기능/하이라이트",
    category: "Pink",
  },
  {
    name: "Indigo",
    key: "indigo",
    description: "빅데이터/엔지니어링",
    category: "Indigo",
  },
  {
    name: "Amber",
    key: "amber",
    description: "경고(주의)",
    category: "Amber",
  },
  {
    name: "Orange",
    key: "orange",
    description: "에너지/활력",
    category: "Orange",
  },
  {
    name: "Red",
    key: "red",
    description: "오류/위험",
    category: "Red",
  },
];

function ColorCard({
  name,
  colorKey,
  description,
  category,
}: {
  name: string;
  colorKey: string;
  description: string;
  category: string;
}) {
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const copyToClipboard = (text: string, variant: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClass(`${colorKey}-${variant}`);
    setTimeout(() => setCopiedClass(null), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Badge variant="outline" className="mt-2">
              {category}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {/* Default */}
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-md border shadow-sm bg-fmai-${colorKey}`}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Default</div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-muted-foreground">
                  bg-fmai-{colorKey}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(`bg-fmai-${colorKey}`, "default")
                  }
                >
                  {copiedClass === `${colorKey}-default` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Light */}
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-md border shadow-sm bg-fmai-${colorKey}-light`}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Light</div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-muted-foreground">
                  bg-fmai-{colorKey}-light
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(`bg-fmai-${colorKey}-light`, "light")
                  }
                >
                  {copiedClass === `${colorKey}-light` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Dark */}
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-md border shadow-sm bg-fmai-${colorKey}-dark`}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Dark</div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-muted-foreground">
                  bg-fmai-{colorKey}-dark
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(`bg-fmai-${colorKey}-dark`, "dark")
                  }
                >
                  {copiedClass === `${colorKey}-dark` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tailwind 클래스 예시 */}
        <div className="mt-4 rounded-md bg-muted p-3">
          <div className="text-xs font-medium text-muted-foreground">
            Tailwind 클래스
          </div>
          <div className="mt-1 space-y-1">
            <code className="text-xs">
              bg-fmai-{colorKey} text-fmai-{colorKey}
            </code>
            <br />
            <code className="text-xs">
              bg-fmai-{colorKey}-light text-fmai-{colorKey}-dark
            </code>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ColorPalette() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-fmai-gradient mb-2">FMAI 색상 팔레트</h1>
        <p className="text-lg text-muted-foreground">
          퓨처모빌리티AI 브랜드 색상 시스템 - 모든 색상은 Default, Light, Dark
          변형을 제공합니다
        </p>
      </div>

      {/* 그라디언트 유틸리티 데모 */}
      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">그라디언트 유틸리티</h2>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium">텍스트 그라디언트</div>
            <h3 className="text-fmai-gradient text-3xl font-bold">
              FUTURE MOBILITY AI
            </h3>
            <code className="mt-2 block text-xs text-muted-foreground">
              className=&quot;text-fmai-gradient&quot;
            </code>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">배경 그라디언트</div>
            <div className="bg-fmai-gradient h-20 w-full rounded-md" />
            <code className="mt-2 block text-xs text-muted-foreground">
              className=&quot;bg-fmai-gradient&quot;
            </code>
          </div>
        </div>
      </Card>

      {/* 색상 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {colorInfo.map((color) => (
          <ColorCard
            key={color.key}
            name={color.name}
            colorKey={color.key}
            description={color.description}
            category={color.category}
          />
        ))}
      </div>

      {/* 사용 예시 섹션 */}
      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">사용 예시</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-2 text-sm font-medium">Primary 버튼</div>
            <Button className="w-full bg-fmai-primary hover:bg-fmai-primary-dark">
              시작하기
            </Button>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Secondary 버튼</div>
            <Button className="w-full bg-fmai-secondary hover:bg-fmai-secondary-dark">
              더 알아보기
            </Button>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Accent 버튼</div>
            <Button className="w-full bg-fmai-accent hover:bg-fmai-accent-dark">
              문의하기
            </Button>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Info 배지</div>
            <Badge className="bg-fmai-info/10 text-fmai-info-light">정보</Badge>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Amber 경고</div>
            <Badge className="bg-fmai-amber/10 text-fmai-amber-light">
              경고
            </Badge>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Red 에러</div>
            <Badge className="bg-fmai-red/10 text-fmai-red-light">오류</Badge>
          </div>
        </div>
      </Card>

      {/* 투명도 예시 */}
      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">투명도 활용</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {[10, 20, 30, 50, 100].map((opacity) => (
            <div key={opacity} className="text-center">
              <div
                className={`mb-2 h-20 rounded-md border bg-fmai-primary/${opacity}`}
              />
              <code className="text-xs text-muted-foreground">
                bg-fmai-primary/{opacity}
              </code>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
