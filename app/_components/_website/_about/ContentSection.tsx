// ====== Reusable Section Component ======
"use client";
import { motion } from "framer-motion";
import Img from "../../_global/Img";

interface AboutSectionProps {
  title: string;
  desc: string;
  image: string;
  reverse?: boolean;
}

// ===== Motion Variants =====
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function AboutContentSection({
  title,
  desc,
  image,
  reverse = false,
}: AboutSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className={`flex ${
        reverse ? "flex-row" : "flex-row-reverse"
      } max-lg:flex-col max-lg:items-start gap-12 items-center pb-3  mb-24`}
    >
      {/* Image */}
      <motion.div
        variants={reverse ? slideInRight : slideInLeft}
        className="rounded-2xl  relative w-full lg:w-1/2"
      >
        <div className="w-full  max-h-[550px] max-lg:h-auto z-6 relative bg-white rounded-xl p-4 border-gray-200 shadow">
          <Img
            src={image ?? "/noImage.png"}
            errorSrc="/noImage.png"
            alt={title}
            className="w-full h-[530px] max-lg:h-auto object-cover rounded-xl"
          />
        </div>
        <div className="w-full h-full bg-primary-color border border-primary-color shadow absolute lg:-top-12 -top-4 rounded-xl z-4 ltr:-left-4 rtl:-right-4"></div>
      </motion.div>

      {/* Text */}
      <motion.div
        variants={reverse ? slideInLeft : slideInRight}
        className="space-y-4 w-full lg:w-1/2"
      >
        <h2 className="lg:text-4xl text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{desc}</p>
      </motion.div>
    </motion.section>
  );
}
