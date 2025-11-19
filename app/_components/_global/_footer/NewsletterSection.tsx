"use client";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function NewsletterSection() {
  const t = useTranslation("footer");
  return (
    <>
      <div className="border-b-black/10 w-fit ml-auto border-b">
        <div className=" px-4 py-12">
          <div className="grid grid-cols-1  gap-8 items-center">
            <div className="space-y-4">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold"
              >
                {t.newsletter.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-300"
              >
                {t.newsletter.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  className="px-4 py-3 duration-300 bg-white  placeholder:text-black placeholder:opacity-20 focus:placeholder:text-white text-white border border-primary-color rounded-lg focus:outline-none focus:bg-white focus:text-black focus:ring-2 focus:ring-[#8ABB6C] flex-1"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#8ABB6C] hover:bg-[#5ABB6D] px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {t.newsletter.button}
                  <FaArrowRight className="text-sm" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
