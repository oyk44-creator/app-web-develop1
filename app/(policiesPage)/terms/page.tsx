import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "이용 약관 | Future Mobility AI",
  description:
    "Future Mobility AI 플랫폼 이용 약관입니다. 서비스 이용 시 적용되는 권리와 의무를 안내합니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <h1 className="mb-4">이용 약관</h1>
        <p className="text-lg text-muted-foreground">
          최종 수정일: 2025년 1월 16일
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>제1조 (목적)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              본 약관은 퓨처모빌리티AI(이하 &ldquo;회사&rdquo;)가 제공하는 차량
              데이터 분석 플랫폼 서비스(이하 &ldquo;서비스&rdquo;)의 이용과
              관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 서비스
              이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제2조 (정의)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">
                본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
              </h3>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    &ldquo;서비스&rdquo;
                  </strong>
                  란 회사가 제공하는 OBD·AI 기반 차량 데이터 수집, 분석, 예측 및
                  관련된 모든 부가 서비스를 의미합니다.
                </li>
                <li>
                  <strong className="text-foreground">
                    &ldquo;이용자&rdquo;
                  </strong>
                  란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 개인 또는
                  법인을 의미합니다.
                </li>
                <li>
                  <strong className="text-foreground">
                    &ldquo;계정&rdquo;
                  </strong>
                  이란 서비스 이용을 위해 이용자가 설정한 고유 식별정보(이메일,
                  ID 등)를 의미합니다.
                </li>
                <li>
                  <strong className="text-foreground">
                    &ldquo;차량 데이터&rdquo;
                  </strong>
                  란 OBD-II, CAN 버스 등을 통해 수집되는 차량 상태, 주행, 배터리
                  정보 등을 의미합니다.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제3조 (약관의 효력 및 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
              <li>
                본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
                공지함으로써 효력이 발생합니다.
              </li>
              <li>
                회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본
                약관을 변경할 수 있으며, 변경된 약관은 시행일로부터 7일 전에
                공지합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고
                이용계약을 해지할 수 있습니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제4조 (서비스의 제공 및 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>차량 OBD·CAN 데이터 실시간 수집 및 저장</li>
              <li>AI 기반 배터리 상태 분석 및 위험도 예측</li>
              <li>차량 데이터 시각화 대시보드</li>
              <li>데이터 기반 리포트 및 인사이트 제공</li>
              <li>
                기타 회사가 추가 개발하거나 제휴 계약 등을 통해 제공하는 서비스
              </li>
            </ul>
            <Separator className="my-4" />
            <p className="leading-relaxed text-muted-foreground">
              회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부
              또는 일부를 변경할 수 있으며, 변경 시 사전에 공지합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제5조 (서비스 이용계약의 성립)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
              <li>
                이용계약은 이용자가 본 약관에 동의하고 회원가입을 신청한 후,
                회사가 이를 승낙함으로써 성립합니다.
              </li>
              <li>
                회사는 다음 각 호에 해당하는 경우 승낙을 거부하거나 유보할 수
                있습니다:
                <ul className="list-circle ml-6 mt-2 space-y-1">
                  <li>실명이 아니거나 타인의 정보를 사용한 경우</li>
                  <li>허위 정보를 기재하거나 필수 정보를 누락한 경우</li>
                  <li>기술적 장애로 인해 서비스 제공이 불가능한 경우</li>
                  <li>
                    관련 법령을 위반하거나 사회 질서를 해칠 우려가 있는 경우
                  </li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제6조 (이용자의 의무)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>허위 정보 등록 또는 타인의 정보 도용</li>
              <li>회사가 게시한 정보의 무단 변경</li>
              <li>회사의 저작권, 제3자의 저작권 등 권리를 침해하는 행위</li>
              <li>서비스 운영을 방해하거나 시스템에 부정 접근하는 행위</li>
              <li>
                수집된 차량 데이터를 회사의 승인 없이 제3자에게 제공하거나
                상업적으로 이용하는 행위
              </li>
              <li>기타 관련 법령에 위배되거나 사회 질서에 반하는 행위</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제7조 (회사의 의무)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
              <li>
                회사는 관련 법령과 본 약관을 준수하며, 안정적이고 지속적인
                서비스 제공을 위해 최선을 다합니다.
              </li>
              <li>
                회사는 이용자의 개인정보 보호를 위해 개인정보 처리방침을
                수립하고 이를 준수합니다.
              </li>
              <li>
                회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나
                불만이 정당하다고 인정되는 경우 이를 처리하여야 합니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제8조 (서비스 이용 제한)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을
              방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을
              제한할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제9조 (면책 조항)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
              <li>
                회사는 천재지변, 전쟁, 시스템 장애 등 불가항력으로 인해 서비스를
                제공할 수 없는 경우 책임이 면제됩니다.
              </li>
              <li>
                회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을
                지지 않습니다.
              </li>
              <li>
                회사는 이용자가 서비스를 이용하여 얻은 정보 또는 자료의 신뢰도나
                정확성에 대해서는 보증하지 않습니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제10조 (분쟁 해결 및 관할법원)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
              <li>본 약관은 대한민국 법령에 의해 규정되고 이행됩니다.</li>
              <li>
                서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는
                회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>본 약관은 2025년 1월 16일부터 시행됩니다.</p>
          <p className="mt-2">
            문의사항이 있으시면{" "}
            <a href="/contact" className="text-primary underline">
              고객센터
            </a>
            로 연락 주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
