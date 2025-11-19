"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/app/_hooks/useTranslation";

export default function CopyrightFooter() {
  const t = useTranslation("footer");

  return (
    <>
      <div className="border-t border-black/10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-2 text-white">
              <span>
                © Copyright {new Date().getFullYear()} {t.centerName},{" "}
                {t.copyright}
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white  transition-colors">
                {t.privacy}
              </a>
              <a href="#" className="text-white  transition-colors">
                {t.terms}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
