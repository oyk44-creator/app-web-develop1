import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "법적 고지 | Future Mobility AI",
  description:
    "Future Mobility AI의 법적 고지사항입니다. 저작권, 면책사항, 라이선스 정보를 안내합니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">법적 고지</h1>
        <p className="text-lg text-muted-foreground">
          최종 수정일: 2025년 1월 16일
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>중요 공지</AlertTitle>
        <AlertDescription>
          본 페이지의 내용은 Future Mobility AI 플랫폼 이용과 관련된 법적 권리
          및 의무를 설명합니다. 서비스를 이용하시기 전에 반드시 숙지하시기
          바랍니다.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>제1조 (저작권 및 지적재산권)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-foreground">1. 회사의 저작권</h3>
            <p className="leading-relaxed text-muted-foreground">
              퓨처모빌리티AI(&ldquo;회사&rdquo;)가 제공하는 모든 콘텐츠(텍스트,
              이미지, 로고, 소프트웨어, 데이터베이스, UI/UX 디자인 등)에 대한
              저작권 및 지적재산권은 회사에 귀속됩니다.
            </p>

            <h3 className="mt-4 font-semibold text-foreground">2. 이용 제한</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                회사의 사전 서면 승인 없이 서비스 내 콘텐츠를 복제, 전송, 배포,
                방송, 2차 저작물 작성 등의 방법으로 이용할 수 없습니다.
              </li>
              <li>
                상업적 목적으로 회사의 콘텐츠를 사용하는 경우 반드시 사전 허가를
                받아야 합니다.
              </li>
              <li>
                서비스 이용 중 생성된 분석 리포트 및 인사이트는 해당 이용자만
                사용할 수 있으며, 제3자에게 판매하거나 양도할 수 없습니다.
              </li>
            </ul>

            <h3 className="mt-4 font-semibold text-foreground">
              3. 이용자의 콘텐츠
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              이용자가 서비스에 게시한 게시물(문의사항, 피드백 등)에 대한
              저작권은 이용자에게 있으나, 회사는 서비스 개선, 마케팅, 홍보
              목적으로 해당 콘텐츠를 무상으로 사용할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제2조 (면책 사항)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-foreground">
              1. 서비스 제공의 면책
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                회사는 천재지변, 전쟁, 테러, 해킹, DDOS 공격, 시스템 장애, 통신
                장애 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을
                지지 않습니다.
              </li>
              <li>
                회사는 이용자의 귀책사유(단말기 오류, 네트워크 불안정, 잘못된
                데이터 입력 등)로 인한 서비스 이용 장애에 대해 책임을 지지
                않습니다.
              </li>
              <li>
                회사는 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한
                규정이 없는 한 책임을 지지 않습니다.
              </li>
            </ul>

            <h3 className="mt-4 font-semibold text-foreground">
              2. 데이터 정확성의 면책
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              회사가 제공하는 차량 데이터 분석 결과, AI 예측 결과, 배터리 위험도
              평가 등은 참고 목적으로 제공되며, 그 정확성이나 완전성을 보장하지
              않습니다. 최종 의사결정은 이용자의 책임하에 이루어져야 하며,
              회사는 이로 인한 손해에 대해 책임을 지지 않습니다.
            </p>

            <h3 className="mt-4 font-semibold text-foreground">
              3. 제3자 서비스 및 링크
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              회사는 서비스 내에서 제3자가 제공하는 외부 링크나 광고에 대해
              책임을 지지 않습니다. 해당 외부 사이트 이용 시 발생하는 손해는
              해당 사이트 운영자와 이용자 간의 책임으로 귀속됩니다.
            </p>

            <h3 className="mt-4 font-semibold text-foreground">
              4. 손해배상의 한계
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              회사의 고의 또는 중대한 과실이 없는 한, 회사가 부담하는 손해배상
              책임은 이용자가 회사에 지급한 최근 1년간의 서비스 이용료 총액을
              한도로 합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제3조 (오픈소스 라이선스)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              본 서비스는 다음과 같은 오픈소스 소프트웨어를 사용하고 있습니다:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-2 text-left">라이브러리</th>
                    <th className="border p-2 text-left">라이선스</th>
                    <th className="border p-2 text-left">저작권자</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="border p-2">React</td>
                    <td className="border p-2">MIT License</td>
                    <td className="border p-2">Meta Platforms, Inc.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Next.js</td>
                    <td className="border p-2">MIT License</td>
                    <td className="border p-2">Vercel, Inc.</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Tailwind CSS</td>
                    <td className="border p-2">MIT License</td>
                    <td className="border p-2">Tailwind Labs</td>
                  </tr>
                  <tr>
                    <td className="border p-2">shadcn/ui</td>
                    <td className="border p-2">MIT License</td>
                    <td className="border p-2">shadcn</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Chart.js</td>
                    <td className="border p-2">MIT License</td>
                    <td className="border p-2">Chart.js Contributors</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Supabase</td>
                    <td className="border p-2">Apache 2.0</td>
                    <td className="border p-2">Supabase, Inc.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              ※ 각 오픈소스 라이선스의 전문은 해당 프로젝트의 공식 저장소에서
              확인하실 수 있습니다.
            </p>
            <Separator className="my-4" />
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-semibold">MIT License 요약</p>
              <p className="text-sm text-muted-foreground">
                해당 소프트웨어 및 관련 문서 파일(이하
                &ldquo;소프트웨어&rdquo;)의 사본을 취득하는 모든 사람에게 무료로
                소프트웨어를 제한 없이 다룰 수 있는 권한을 부여합니다. 단,
                저작권 고지문과 본 허가 고지문을 소프트웨어의 모든 사본 또는
                중요 부분에 포함해야 합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제4조 (상표 및 로고 사용)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              &ldquo;Future Mobility AI&rdquo;, 회사 로고, 서비스명 등은 회사의
              등록 상표 또는 상표입니다. 회사의 사전 서면 동의 없이 이를 사용,
              복제, 배포할 수 없습니다.
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>로고 및 상표를 변형하거나 왜곡하여 사용할 수 없습니다.</li>
              <li>
                회사와의 제휴, 후원, 승인 관계를 암시하는 방식으로 사용할 수
                없습니다.
              </li>
              <li>
                상업적 목적으로 사용하려면 반드시 회사의 사전 허가를 받아야
                합니다.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제5조 (분쟁 해결 및 준거법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-foreground">1. 준거법</h3>
            <p className="leading-relaxed text-muted-foreground">
              본 법적 고지 및 서비스 이용과 관련한 모든 분쟁은 대한민국 법률에
              따라 해석되고 적용됩니다.
            </p>

            <h3 className="mt-4 font-semibold text-foreground">2. 관할법원</h3>
            <p className="leading-relaxed text-muted-foreground">
              회사와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의
              관할법원에 제기합니다. 다만, 제소 당시 이용자의 주소 또는 거소가
              분명하지 않거나 외국 거주자의 경우에는 회사의 본사 소재지를
              관할하는 법원을 합의관할로 합니다.
            </p>

            <h3 className="mt-4 font-semibold text-foreground">3. 분쟁 조정</h3>
            <p className="leading-relaxed text-muted-foreground">
              소송 제기 전에 한국소비자원, 공정거래위원회 등 관련 분쟁조정기구를
              통한 조정을 시도할 것을 권장합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제6조 (데이터 보안 및 책임)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 이용자의 차량 데이터 및 개인정보 보호를 위해 업계 표준
              수준의 보안 조치를 취하고 있습니다. 그러나 인터넷을 통한 데이터
              전송의 완벽한 보안은 보장할 수 없으므로, 이용자는 자신의 계정
              정보(비밀번호 등)를 안전하게 관리할 책임이 있습니다.
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>비밀번호는 정기적으로 변경하고 타인과 공유하지 마십시오.</li>
              <li>
                공용 컴퓨터나 공용 Wi-Fi 이용 시 로그인 정보가 노출되지 않도록
                주의하십시오.
              </li>
              <li>의심스러운 활동이 발견되면 즉시 회사에 신고하십시오.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제7조 (통지 및 연락)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사가 이용자에게 통지를 하는 경우, 등록된 이메일 주소, 서비스 내
              알림, 공지사항 게시 등의 방법을 사용합니다. 이용자는 정확한 연락처
              정보를 유지할 책임이 있습니다.
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-semibold">회사 연락처</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>이메일: legal@futuremobility-ai.com</li>
                <li>전화: 02-1234-5678</li>
                <li>주소: 서울특별시 강남구 테헤란로 123, 모빌리티타워 10층</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제8조 (법적 고지의 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 필요한 경우 본 법적 고지를 변경할 수 있으며, 변경 사항은
              서비스 내 공지사항을 통해 게시합니다. 중요한 변경의 경우 최소 7일
              전에 사전 공지하며, 변경 후에도 서비스를 계속 이용하는 경우 변경
              사항에 동의한 것으로 간주합니다.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p className="font-semibold">
            본 법적 고지는 2025년 1월 16일부터 시행됩니다.
          </p>
          <p>
            법적 고지 관련 문의사항이 있으시면{" "}
            <a
              href="mailto:legal@futuremobility-ai.com"
              className="text-primary underline"
            >
              legal@futuremobility-ai.com
            </a>
            으로 연락 주시기 바랍니다.
          </p>
          <p className="mt-4 text-xs">
            © 2025 퓨처모빌리티AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
