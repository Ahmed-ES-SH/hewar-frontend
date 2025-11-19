"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { useTranslation } from "@/app/_hooks/useTranslation";
import SlideCard from "./SlideCard";
import "swiper/css";
import "swiper/css/effect-fade";

// Slide type
export interface Slide {
  id: number;
  title_en: string;
  title_ar: string;
  subTitle_en: string;
  subTitle_ar: string;
  link_video: string;
  image: string;
  video_path: string | null;
  created_at: string; // يمكن استخدام Date إذا كنت تقوم بالتحويل
  updated_at: string; // يمكن استخدام Date إذا كنت تقوم بالتحويل
}

interface props {
  slides: Slide[];
}

export default function HeroSwiper({ slides }: props) {
  const t = useTranslation("hero");
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        onMouseEnter={() => swiperRef.current?.autoplay.stop()}
        onMouseLeave={() => swiperRef.current?.autoplay.start()}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        effect="fade"
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <SlideCard
              index={index}
              slide={slide}
              t={t}
              key={`slide-${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
