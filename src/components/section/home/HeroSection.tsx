import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden py-16">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div className="mx-auto">
              <Image
                src="/images/logo/퓨처모빌리티AI_nospace.png"
                alt={"Logo"}
                width={400}
                height={400}
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-fmai-gradient mx-auto max-w-5xl text-balance text-center">
              <span className="block">FUTURE</span>
              <span className="block">MOBILITY AI</span>
            </h1>
            <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
              <span className="block">
                차량 데이터는 기업의 자산이 아닌 사람의 안전 자산입니다.
              </span>
              <span className="block">
                데이터로 모빌리티의 미래를 만듭니다.
              </span>
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pb-12 pt-3">
              <Button size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  시작하기 <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground">
                배터리 안전, 데이터로 증명합니다
              </div>
            </div>
          </div>
          {/* <Image
            src="/images/screenshot/dashboard.png"
            alt="Future Mobility AI Dashboard"
            width={1200}
            height={800}
            className="mx-auto h-full max-h-[524px] w-full max-w-5xl rounded-2xl object-cover"
            priority
          /> */}
        </div>
      </div>
    </section>
  );
}
