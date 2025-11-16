"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiHelpCircle } from "react-icons/fi";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { useLocale } from "@/app/_hooks/useLocale";
import { directionMap } from "@/app/constants/_website/Global";
import { ContactInfoCard } from "./ContactInfoCard";
import { IllustrationSection } from "./IllustrationSection";
import { MapSection } from "./MapSection";
import { ContactForm } from "./ContactForm";
import Img from "../../_global/Img";
import HeroBanner from "../../_global/_heroBanner/HeroBanner";

export default function ContactPageComponent() {
  const locale = useLocale();
  const translations = useTranslation("contact");
  const isRTL = locale === "ar";

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
    <div dir={directionMap[locale]} className="min-h-screen">
      {/* Header */}
      <HeroBanner imageSrc="/website/slide2.jpg" />

      {/* Main Content */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="c-container mx-auto  pt-20 lg:mb-40 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full">
          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start w-full pb-4  gap-4">
              {/* Contact Info Cards */}
              <div className="space-y-6 flex-1">
                <ContactInfoCard
                  icon={<FiMapPin size={24} />}
                  title={translations.address}
                  value={translations.addressValue}
                  delay={0}
                />
                <ContactInfoCard
                  icon={<FiPhone size={24} />}
                  title={translations.phone}
                  value={translations.phoneValue}
                  delay={0.1}
                />
                <ContactInfoCard
                  icon={<FiMail size={24} />}
                  title={translations.email}
                  value={translations.emailValue}
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
            </div>

            <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start w-full relative gap-4">
              {/* Contact Form */}
              <ContactForm />
              <div className="flex-1" />
              <div className="lg:w-[750px] w-full lg:absolute lg:top-0 rtl:lg:-left-[5%] ltr:lg:-right-[2%]">
                <Img src="/website/contact-1.png" className="w-[900px]" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
