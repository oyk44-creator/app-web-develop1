"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const textColor =
    "bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="flex flex-col gap-6 px-4 py-16 text-center sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-center gap-3">
          <Play className="h-8 w-8 text-emerald-500" />
          <h2 className={textColor}>서비스 소개</h2>
        </div>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg">
          Future Mobility AI가 어떻게 차량 데이터를 분석하고<br></br>
          <strong className="ml-1 text-primary">
            안전한 모빌리티 환경을 구축
          </strong>
          하는지 영상으로 확인해보세요.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto w-full max-w-7xl"
      >
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
          <video
            ref={videoRef}
            controls
            muted
            className="h-auto w-full"
            poster="/images/screenshot/dashboard.png"
          >
            <source src="/video/hero-video.mp4" type="video/mp4" />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
        </div>
      </motion.div>
    </section>
  );
}
