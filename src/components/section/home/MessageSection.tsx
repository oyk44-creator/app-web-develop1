"use client";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
export default function MessageSection() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-4">
          <ShieldCheck className="h-20 w-20 text-blue-400 sm:h-28 sm:w-28" />
          <h2 className="w-2/3 text-center text-3xl font-bold leading-snug text-primary sm:text-5xl md:leading-normal">
            We Make Every Drive Predictable and Reliable
          </h2>
          <p className="text-lg text-muted-foreground sm:text-2xl">
            우리는 차량의 상태를 예측하고,
          </p>
          <p className="text-lg text-muted-foreground sm:text-2xl">
            언제나 신뢰할 수 있는 주행을 만듭니다.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
