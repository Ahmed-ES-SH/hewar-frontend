"use client";

import { useLocale } from "@/app/_hooks/useLocale";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import HelpStats from "./HelpStats";
import { TextType } from "@/app/_components/_dashboard/_homePage/_aboutSectionDash/AboutSectionDash";
import Img from "@/app/_components/_global/Img";
import { useState } from "react";
import VideoPopup from "../_heroSection/VideoPopup";

export interface State {
  title: TextType;
  value: string;
}
interface props {
  data: {
    texts: {
      title: TextType;
      description: TextType;
    };

    stats: State[];
    image_path: string;
    video_path: string;
  };
}

export default function HelpSection({ data }: props) {
  const locale = useLocale();
  const t = useTranslation("helpSection");

  const [videoPopup, setVideoPopup] = useState(false);

  const { texts, stats, image_path, video_path } = data;

  console.log(video_path);
  console.log(data);

  return (
    <section className="bg-primary-color text-white relative overflow-hidden py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
        {/* Left side - Text */}
        <motion.div
          initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            {texts.title[locale]}
          </h2>
          <p className="text-gray-200 max-w-md">{texts.description[locale]}</p>

          {/* Stats */}
          <HelpStats stats={stats} />
        </motion.div>

        {/* Right side - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Img
            src={image_path ?? "/website/video-thumb1-1-2-1.png"}
            errorSrc="/website/video-thumb1-1-2-1.png"
            alt="Needy People"
            width={700}
            height={500}
            className="rounded-2xl object-cover w-full"
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVideoPopup(true)}
              className="w-16 h-16 bg-white text-[#1E6B63] rounded-full flex items-center justify-center shadow-lg"
            >
              <FaPlay className="text-2xl ml-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative brush style */}
      <div className="absolute left-0 top-0 w-32 h-64 bg-[url('/images/brush-left.png')] bg-contain bg-no-repeat opacity-80" />
      <div className="absolute right-0 bottom-0 w-32 h-64 bg-[url('/images/brush-right.png')] bg-contain bg-no-repeat opacity-80" />

      <VideoPopup
        isOpen={videoPopup}
        videoUrl={video_path}
        onClose={() => setVideoPopup(false)}
      />
    </section>
  );
}
