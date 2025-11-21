"use client";
import React from "react";
import { motion } from "framer-motion";
import { ContactInfoCard } from "../_contactus/ContactInfoCard";
import { MapSection } from "../_contactus/MapSection";
import { FiHelpCircle, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { CenterBranchType } from "./CenterBranchesComponent";
import { truncateContent } from "@/app/_helpers/GlobalHelpers";
import { MdOutlineTitle } from "react-icons/md";

interface props {
  branch: CenterBranchType;
}

export default function CenterBranch({ branch }: props) {
  const translations = useTranslation("contact");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="c-container  mx-auto py-20 border-t px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full">
          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start w-full pb-4  gap-4">
              {/* Contact Info Cards */}
              <div className="space-y-6 flex-1">
                <ContactInfoCard
                  icon={<MdOutlineTitle size={24} />}
                  title={translations.branchName || "اسم الفرع"}
                  value={branch.title}
                  delay={0}
                />

                <ContactInfoCard
                  icon={<FiMapPin size={24} />}
                  title={translations.address}
                  value={truncateContent(branch.location.address ?? "", 40)}
                  delay={0}
                />
                <ContactInfoCard
                  icon={<FiPhone size={24} />}
                  title={translations.phone}
                  value={branch.phone ?? ""}
                  delay={0.1}
                />
                <ContactInfoCard
                  icon={<FiMail size={24} />}
                  title={translations.email}
                  value={branch.email ?? ""}
                  delay={0.2}
                />
                <ContactInfoCard
                  icon={<FiHelpCircle size={24} />}
                  title={translations.haveQuestions}
                  value={translations.haveQuestionsDesc}
                  delay={0.3}
                />
              </div>

              {/* Map */}
              <MapSection location={branch.location ?? null} />
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
