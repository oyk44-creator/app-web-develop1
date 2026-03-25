"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = "bg-primary",
  gradient = "from-emerald-500 to-teal-500",
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 + delay }}
      className="group relative"
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 blur transition duration-500 group-hover:opacity-40`}
      />
      <Card className="relative rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all hover:border-slate-700">
        <CardContent className="p-8">
          <div className="mb-4">
            <div
              className={`inline-flex h-14 w-14 bg-gradient-to-br ${gradient} items-center justify-center rounded-2xl shadow-lg`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
          <p className="mb-2 text-sm text-slate-400">{title}</p>
          <h3
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-semibold text-transparent`}
          >
            {value}
            {unit && (
              <span className="ml-1 text-xl text-slate-400">{unit}</span>
            )}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  );
}
