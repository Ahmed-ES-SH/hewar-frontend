"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useLocale } from "@/app/_hooks/useLocale";
import { links } from "@/app/constants/_website/navbar";
import LocaleLink from "../LocaleLink";

export default function MobileDropLinks() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        className="rounded-md text-stone-700 hover:bg-stone-100 transition"
      >
        {isOpen ? (
          <IoMdClose className="size-8 pt-2" />
        ) : (
          <IoMdMenu className="size-8 pt-2" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute w-full left-0  top-full bg-white shadow-lg rounded-b-2xl border border-stone-100 overflow-hidden z-99"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="flex flex-col divide-y divide-stone-100">
              {links.map(({ icon: Icon, href, label }) => {
                const isActive = pathname === href;
                return (
                  <motion.li
                    key={href}
                    variants={itemVariants}
                    whileHover={{ x: 6 }}
                    className={`flex items-center gap-3 px-5 py-4 text-stone-700 ${
                      isActive
                        ? "bg-stone-100 font-semibold"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    <LocaleLink
                      href={href}
                      className="flex items-center gap-3 w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="text-lg" />
                      <span>{label[locale]}</span>
                    </LocaleLink>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
