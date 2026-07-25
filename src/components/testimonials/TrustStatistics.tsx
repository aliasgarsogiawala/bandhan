"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Award, Calendar, MapPin, Smile, ShieldCheck } from "lucide-react";
import { trustStats, TrustStat } from "@/data/testimonialData";

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

    let start = 0;
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const isFloat = value % 1 !== 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * easedProgress;

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
    <span ref={ref} className="font-heading font-extrabold text-3xl sm:text-4xl text-gold">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export const TrustStatistics: React.FC = () => {
  return (
    <div className="w-full py-8 mb-12">
      {/* Top trust badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs sm:text-sm font-medium tracking-wide">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>Bandhan Tours Trust Guarantee • 100% Authentic Customer Reviews</span>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {trustStats.map((stat, idx) => {
          const IconComponent = iconMap[stat.icon] || Users;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold/40 p-5 rounded-2xl flex flex-col items-center text-center transition-all shadow-lg hover:shadow-gold/10 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-slate-950 transition-colors duration-300 text-gold">
                <IconComponent className="w-6 h-6" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <h3 className="font-semibold text-white text-sm mt-1">{stat.label}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{stat.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustStatistics;
