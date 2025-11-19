"use client";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import Img from "./Img";
import NewsletterSection from "./_footer/NewsletterSection";
import CopyrightFooter from "./_footer/CopyrightFooter";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import useFetchData from "@/app/_hooks/useFetchData";
import LocaleLink from "./LocaleLink";
import { useLocale } from "@/app/_hooks/useLocale";

interface Link {
  id: number;
  link_title_ar: string;
  link_title_en: string;
  link_url: string;
  list_id: number;
  created_at: string;
  updated_at: string;
}

interface List {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  links: Link[];
}

interface props {
  socialData: {
    gmail_account: string;
    location: Location;
    whatsapp_number: string;
    facebook_account: string;
    x_account: string;
    youtube_account: string;
    instgram_account: string;
    snapchat_account: string;
    tiktok_account: string;
    linked_account: string;
  };
}

export default function Footer({ socialData }: props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslation("footer");

  const { data } = useFetchData<List[]>("/all-lists", false); // data contains the lists with links
  const { logoSrc } = useAppSelector((state) => state.variables);

  if (pathname.includes("/dashboard") || pathname.includes("/login")) {
    return null;
  }

  return (
    <footer className="bg-light-primary-color text-white">
      <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start py-4 container mx-auto">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Img src={logoSrc ?? "/logo.png"} className="w-16" />
          <p className="text-gray-300 leading-relaxed">{t.tagline}</p>
        </motion.div>
        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Dynamic Lists from data */}
          {data &&
            data.map((list: any, index: number) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="space-y-4"
              >
                <ul className="space-y-2">
                  {list.links.map((link: any) => (
                    <li key={link.id}>
                      <LocaleLink
                        href={link.link_url ?? "#"}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {/* استخدم اللغة الحالية */}
                        {locale === "ar"
                          ? link.link_title_ar
                          : link.link_title_en ?? ""}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">{t.contact.title}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-400" />
                <span className="text-white">
                  {socialData?.whatsapp_number ?? "+163-3854-7896"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400" />
                <div className="space-y-1">
                  <div className="text-white">
                    {socialData?.gmail_account ?? "info@bonat.com"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <CopyrightFooter />
    </footer>
  );
}
