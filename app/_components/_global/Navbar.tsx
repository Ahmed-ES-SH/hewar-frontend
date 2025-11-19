"use client";

import { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/app/_hooks/useLocale";
import { useAppSelector } from "@/app/redux/hooks";
import { Location } from "../_dashboard/_CenterBranches/types";
import { TextType } from "../_dashboard/_homePage/_aboutSectionDash/AboutSectionDash";
import BottomNavbar from "./_navbar/BottomNavbar";
import NavDiv from "./_navbar/NavDiv";
import LocaleLink from "./LocaleLink";
import Img from "./Img";

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

interface itemType {
  title: TextType;
  value: string;
}

interface socialIcon {
  icon: any;
  href: string;
}

export default function Navbar({ socialData }: props) {
  const { logoSrc } = useAppSelector((state) => state.variables);
  const locale = useLocale();
  const [hideWhitePart, setHideWhitePart] = useState(false);
  const [currentDetailes, setCurrentDetailes] = useState<itemType[]>([]);
  const [socialIcons, setSocialIcons] = useState<socialIcon[]>([]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) setHideWhitePart(true);
      else setHideWhitePart(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (socialData) {
      setCurrentDetailes([
        {
          title: {
            en: "Locate Address:",
            ar: "العنوان:",
          },
          value: socialData?.location?.address,
        },
        {
          title: {
            en: "Call us any time:",
            ar: "اتصل بنا في أي وقت:",
          },
          value: socialData?.whatsapp_number,
        },
        {
          title: {
            en: "Email us any time:",
            ar: "راسلنا في أي وقت:",
          },
          value: socialData?.gmail_account,
        },
      ]);

      setSocialIcons([
        {
          icon: FaFacebook,
          href: socialData.facebook_account,
        },
        {
          icon: FaYoutube,
          href: socialData.youtube_account,
        },
        {
          icon: FaLinkedin,
          href: socialData.linked_account,
        },
        {
          icon: FaTiktok,
          href: socialData.tiktok_account,
        },
      ]);
    } else {
      setCurrentDetailes([
        {
          title: {
            en: "Locate Address:",
            ar: "العنوان:",
          },
          value: "Damascus, Syria - Al-Mazzeh",
        },
        {
          title: {
            en: "Call us any time:",
            ar: "اتصل بنا في أي وقت:",
          },
          value: "+963 944 123 456",
        },
        {
          title: {
            en: "Email us any time:",
            ar: "راسلنا في أي وقت:",
          },
          value: "info@hewar-peace.org",
        },
      ]);

      setSocialIcons([
        {
          icon: FaFacebook,
          href: "#",
        },
        {
          icon: FaYoutube,
          href: "#",
        },
        {
          icon: FaLinkedin,
          href: "#",
        },
        {
          icon: FaTiktok,
          href: "#",
        },
      ]);
    }
  }, [socialData]);

  return (
    <NavDiv>
      <div
        className={`w-full h-full ${
          hideWhitePart ? "md:bg-transparent bg-white" : "bg-white"
        }`}
      >
        <div className="c-container relative mx-auto flex flex-col items-center justify-center">
          {/* Animate presence for smooth hide/show */}
          <AnimatePresence>
            {!hideWhitePart && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className=" items-center justify-between mx-auto py-2 w-fit hidden lg:flex lg:w-full"
              >
                {/* logo */}
                <LocaleLink href="/">
                  <Img
                    src={logoSrc ?? "/logo.png"}
                    className="w-16 hidden lg:block"
                  />
                </LocaleLink>

                {/* current details */}
                <div className="md:flex hidden items-center gap-4">
                  {currentDetailes.map((item, index) => (
                    <div
                      key={`nav-${index}`}
                      className="flex flex-col items-start gap-2 ltr:not-last:border-r rtl:not-last:border-l ltr:pr-8 rtl:pl-8 border-gray-300"
                    >
                      <p className="text-gray-600 text-sm">
                        {item.title[locale]}
                      </p>
                      <h3 className="font-semibold text-xl xl:text-2xl">
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* social icons */}
                <div className="items-center gap-3 hidden xl:flex">
                  {socialIcons.map((item, index) => (
                    <a
                      key={`social-icon-${index}`}
                      target="_blank"
                      href={item.href}
                      className="lg:size-12 size-8 text-primary-color cursor-pointer hover:bg-primary-color hover:text-white duration-300 rounded-full border border-gray-200 flex items-center justify-center"
                    >
                      <item.icon className="size-6" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* bottom navbar */}
          <BottomNavbar hideWhitePart={hideWhitePart} />
        </div>
      </div>
    </NavDiv>
  );
}
