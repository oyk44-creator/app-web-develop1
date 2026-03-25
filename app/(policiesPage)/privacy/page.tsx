import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | Future Mobility AI",
  description:
    "Future Mobility AI의 개인정보 처리방침입니다. 이용자의 개인정보를 어떻게 수집, 이용, 보관, 파기하는지 안내합니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <h1 className="mb-4">개인정보 처리방침</h1>
        <div className="flex items-center gap-2">
          <p className="text-lg text-muted-foreground">
            최종 수정일: 2025년 1월 16일
          </p>
          <Badge variant="secondary">시행일: 2025.01.16</Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>제1조 (개인정보의 처리 목적)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              퓨처모빌리티AI(&ldquo;회사&rdquo;)는 다음의 목적을 위하여
              개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
              용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">1. 서비스 제공</h3>
              <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>회원 가입 및 관리, 본인 식별·인증</li>
                <li>차량 데이터 수집, 분석, 모니터링 서비스 제공</li>
                <li>AI 기반 배터리 위험도 예측 및 알림 전송</li>
                <li>맞춤형 서비스 제공 및 서비스 품질 개선</li>
              </ul>

              <h3 className="mt-4 font-semibold text-foreground">
                2. 고객 지원
              </h3>
              <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>문의사항 접수 및 답변 제공</li>
                <li>불만 처리 및 분쟁 조정</li>
                <li>공지사항 전달 및 서비스 개선 안내</li>
              </ul>

              <h3 className="mt-4 font-semibold text-foreground">
                3. 마케팅 및 광고 활용
              </h3>
              <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>신규 서비스 개발 및 맞춤형 서비스 제공</li>
                <li>이벤트 및 광고성 정보 제공 (동의 시)</li>
                <li>서비스 이용 통계 및 인구통계학적 특성 분석</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제2조 (처리하는 개인정보의 항목)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  1. 필수 항목
                </h3>
                <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>이름, 이메일 주소, 비밀번호</li>
                  <li>휴대전화번호, 회사명(법인 이용자의 경우)</li>
                  <li>차량 정보 (차량번호, 제조사, 모델명, 연식)</li>
                  <li>OBD·CAN 데이터 (배터리 상태, 주행 정보, 센서 데이터)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  2. 선택 항목
                </h3>
                <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>프로필 사진, 주소</li>
                  <li>마케팅 수신 동의 여부</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  3. 자동 수집 항목
                </h3>
                <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>IP 주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
                  <li>기기 정보 (OS, 브라우저 종류 및 버전)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제3조 (개인정보의 처리 및 보유 기간)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground">
                  회원 가입 및 관리
                </h3>
                <p className="text-sm text-muted-foreground">
                  회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이
                  진행 중인 경우 해당 기간 종료 시까지)
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground">
                  차량 데이터 분석 서비스 제공
                </h3>
                <p className="text-sm text-muted-foreground">
                  서비스 종료 시 또는 회원 탈퇴 후 3개월
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground">
                  전자상거래법에 따른 보관
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자 불만 또는 분쟁 처리 기록: 3년</li>
                  <li>표시·광고에 관한 기록: 6개월</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제4조 (개인정보의 제3자 제공)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
              <li>
                통계작성, 학술연구 또는 시장조사를 위하여 특정 개인을 식별할 수
                없는 형태로 제공하는 경우
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제5조 (개인정보 처리의 위탁)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
              외부 전문업체에 위탁하여 운영하고 있습니다:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-2 text-left">위탁받는 자</th>
                    <th className="border p-2 text-left">위탁 업무 내용</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="border p-2">AWS(Amazon Web Services)</td>
                    <td className="border p-2">클라우드 서버 및 데이터 저장</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Supabase</td>
                    <td className="border p-2">데이터베이스 관리 및 인증</td>
                  </tr>
                  <tr>
                    <td className="border p-2">(주)카카오</td>
                    <td className="border p-2">알림톡 발송</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              ※ 위탁 계약 시 개인정보 보호를 위해 위탁업무 수행 목적 외 개인정보
              처리 금지, 기술적·관리적 보호조치, 재위탁 제한 등을 명확히
              규정하고 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제6조 (정보주체의 권리·의무 및 행사방법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              정보주체(이용자)는 언제든지 다음 각 호의 개인정보 보호 관련 권리를
              행사할 수 있습니다:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
              <li>개인정보 수집·이용·제공 동의 철회</li>
            </ul>
            <Separator className="my-4" />
            <p className="leading-relaxed text-muted-foreground">
              권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여
              하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-semibold">문의처</p>
              <p className="text-sm text-muted-foreground">
                이메일: privacy@futuremobility-ai.com
              </p>
              <p className="text-sm text-muted-foreground">
                전화: 02-1234-5678
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제7조 (개인정보의 파기)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">파기 절차</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 내부
                  방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">파기 방법</h3>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <li>• 전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                  <li>• 종이 문서: 분쇄기로 분쇄하거나 소각</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제8조 (개인정보의 안전성 확보 조치)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold text-foreground">
                  관리적 조치
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 내부관리계획 수립·시행</li>
                  <li>• 정기적 직원 교육</li>
                  <li>• 개인정보 취급자 최소화</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold text-foreground">
                  기술적 조치
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 개인정보 암호화 (AES-256)</li>
                  <li>• 해킹 등 대비 기술적 대책</li>
                  <li>• 접근 통제 시스템 운영</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold text-foreground">
                  물리적 조치
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 전산실·자료보관실 통제</li>
                  <li>• 출입 통제 및 기록 관리</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold text-foreground">
                  법적 조치
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 개인정보 처리 방침 공개</li>
                  <li>• 개인정보보호 책임자 지정</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제9조 (개인정보 보호책임자)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="space-y-4 rounded-lg bg-muted/50 p-6">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  개인정보 보호책임자
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>성명: 홍길동</li>
                  <li>직책: 최고개인정보책임자(CPO)</li>
                  <li>이메일: cpo@futuremobility-ai.com</li>
                  <li>전화: 02-1234-5678</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  개인정보 보호담당부서
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>부서명: 개인정보보호팀</li>
                  <li>이메일: privacy@futuremobility-ai.com</li>
                  <li>전화: 02-1234-5679</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제10조 (권익침해 구제방법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여
              개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
              분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">개인정보분쟁조정위원회</p>
                <p className="text-muted-foreground">
                  전화: (국번없이) 1833-6972
                </p>
                <p className="text-muted-foreground">
                  홈페이지: www.kopico.go.kr
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">개인정보침해신고센터</p>
                <p className="text-muted-foreground">전화: (국번없이) 118</p>
                <p className="text-muted-foreground">
                  홈페이지: privacy.kisa.or.kr
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">대검찰청 사이버범죄수사단</p>
                <p className="text-muted-foreground">전화: 02-3480-3573</p>
                <p className="text-muted-foreground">홈페이지: www.spo.go.kr</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">경찰청 사이버안전국</p>
                <p className="text-muted-foreground">전화: (국번없이) 182</p>
                <p className="text-muted-foreground">
                  홈페이지: cyberbureau.police.go.kr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제11조 (개인정보 처리방침의 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              이 개인정보 처리방침은 2025년 1월 16일부터 적용되며, 법령 및
              방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p className="font-semibold">
            본 방침은 2025년 1월 16일부터 시행됩니다.
          </p>
          <p>
            개인정보 관련 문의사항이 있으시면{" "}
            <a
              href="mailto:privacy@futuremobility-ai.com"
              className="text-primary underline"
            >
              privacy@futuremobility-ai.com
            </a>
            으로 연락 주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
