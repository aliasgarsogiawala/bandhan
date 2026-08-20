"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Award, Calendar, MapPin, Smile } from "lucide-react";
import { trustStats } from "@/data/testimonialData";

const iconMap = {
  users: Users,
  award: Award,
  calendar: Calendar,
  map: MapPin,
  smile: Smile,
};

interface CounterProps {
  value: number;
  suffix: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({ value, suffix, prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = value * easedProgress;

      if (frame >= totalFrames) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formattedValue = value % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export const TrustStatistics: React.FC = () => {
  return (
    <div className="mb-8 w-full">
      <div className="grid grid-cols-2 overflow-hidden rounded-[8px] border border-white/[0.1] bg-white/[0.045] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] md:grid-cols-3 lg:grid-cols-5">
        {trustStats.map((stat, idx) => {
          const IconComponent = iconMap[stat.icon] || Users;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="group relative flex min-h-24 flex-col items-center justify-center border-b border-r border-white/[0.08] px-4 py-4 text-center last:border-r-0 lg:border-b-0"
            >
              <div className="mb-2 flex items-center gap-2 text-gold">
                <IconComponent className="h-4 w-4" aria-hidden="true" />
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                {stat.label}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustStatistics;
