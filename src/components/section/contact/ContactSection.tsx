"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "전화 상담",
      detail: "02-1234-5678",
      sub: "평일 09:00 - 18:00",
      color: "from-fmai-info to-fmai-secondary",
    },
    {
      icon: Mail,
      title: "이메일",
      detail: "contact@vehicledata.com",
      sub: "24시간 이내 응답",
      color: "from-fmai-primary to-fmai-accent",
    },
    {
      icon: MapPin,
      title: "본사 위치",
      detail: "서울시 강남구 테헤란로 123",
      sub: "데이터센터 빌딩 10층",
      color: "from-fmai-purple to-fmai-pink",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <Badge
              variant="outline"
              className="max-w-[100px] border-fmai-primary/30 bg-fmai-primary/10 px-4 py-2 text-fmai-primary-light"
            >
              Contact Us
            </Badge>
            <h1 className="flex flex-col gap-1 tracking-tight">
              <span>함께 만들어갈</span>
              <span className="text-fmai-gradient">미래를 논의하세요</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              차량 데이터 플랫폼에 대해 궁금하신 점이 있으시면 언제든지
              연락주세요. 친절하게 상담해드립니다.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${info.color} rounded-2xl opacity-0 blur transition duration-500 group-hover:opacity-50`}
                    />
                    <div className="relative flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl transition-all hover:border-slate-700">
                      <div
                        className={`h-12 w-12 flex-shrink-0 bg-gradient-to-br ${info.color} flex items-center justify-center rounded-xl`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-white">{info.title}</div>
                        <div className="text-slate-300">{info.detail}</div>
                        <div className="text-sm text-slate-500">{info.sub}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fmai-primary to-fmai-secondary opacity-10 blur-xl transition-opacity group-hover:opacity-20" />
            {/* Form Card */}
            <div className="relative flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 backdrop-blur-xl">
              <h3 className="text-3xl text-white">문의하기</h3>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-400">
                      이름
                    </Label>
                    <Input
                      id="name"
                      placeholder="홍길동"
                      className="border-slate-800 bg-slate-700 text-white placeholder:text-slate-300 focus:border-fmai-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-400">
                      회사명
                    </Label>
                    <Input
                      id="company"
                      placeholder="회사명"
                      className="border-slate-800 bg-slate-700 text-white placeholder:text-slate-300 focus:border-fmai-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-400">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    className="border-slate-800 bg-slate-700 text-white placeholder:text-slate-300 focus:border-fmai-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-400">
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01012345678"
                    className="border-slate-800 bg-slate-700 text-white placeholder:text-slate-300 focus:border-fmai-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-400">
                    문의 내용
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="문의하실 내용을 입력해주세요"
                    rows={5}
                    className="resize-none border-slate-800 bg-slate-700 text-white placeholder:text-slate-300 focus:border-fmai-primary"
                  />
                </div>

                <Button
                  onClick={() => alert("현재 개발중입니다.")}
                  type="button"
                  className="group flex w-full items-center justify-center bg-gradient-to-r from-fmai-primary to-fmai-accent py-6 text-white shadow-lg shadow-fmai-primary/50 hover:from-fmai-primary-dark hover:to-fmai-accent-dark"
                >
                  <p className="text-lg">문의 보내기</p>
                  <Send className="mt-1 h-10 w-10" />
                </Button>

                <p className="text-center text-sm text-slate-300">
                  제출하신 정보는 안전하게 보호되며 상담 목적으로만 사용됩니다.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
