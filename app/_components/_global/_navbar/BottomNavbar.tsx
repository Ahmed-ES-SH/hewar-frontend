"use client";
import LocaleLink from "../LocaleLink";
import { useLocale } from "@/app/_hooks/useLocale";
import { usePathname } from "next/navigation";
import { IoMdHeart } from "react-icons/io";
import { useAppSelector } from "@/app/redux/hooks";
import { links } from "@/app/constants/_website/navbar";
import { toast } from "sonner";
import MobileDropLinks from "./MobileDropLinks";
import LanguageBtn from "./LanguageBtn";
import Img from "../Img";

interface props {
  hideWhitePart: boolean;
}

export default function BottomNavbar({ hideWhitePart }: props) {
  const locale = useLocale();
  const pathName = usePathname();
  const { logoSrc, navText } = useAppSelector((state) => state.variables);

  const donateNow = () => {
    toast.warning("عفوا ستكون هذة الميزة متاحه قريبا انشاء الله .");
  };

  return (
    <div
      className={`md:c-container overflow-hidden w-full rounded-full  md:absolute ${
        !hideWhitePart ? "md:top-[95%]" : "md:top-1/2"
      } md:left-1/2 md:-translate-x-1/2 flex items-center justify-between gap-2`}
    >
      <div className="flex items-center justify-between md:bg-primary-color lg:py-4 flex-1/2 rounded-full gap-4 md:p-4">
        <div className="flex items-center gap-2 md:hidden">
          {/* mobail button */}
          <MobileDropLinks />
          {/* logo small screen */}
          <LocaleLink className="md:hidden" href="/">
            <Img src={logoSrc ?? "/logo.png"} className="w-14 md:hidden" />
          </LocaleLink>
        </div>

        {/* current links desktop */}
        <div className="md:flex  hidden items-center self-start gap-4">
          {links.map((link, index) => {
            const isActive = link.href !== "/" && pathName.includes(link.href);
            return (
              <LocaleLink
                className={`flex items-center whitespace-nowrap max-md:text-sm hover:text-text-primary duration-300 gap-2 ${
                  isActive ? "text-text-primary" : "text-white"
                } `}
                key={index}
                href={link.href}
              >
                <link.icon className="size-5" />
                <p>{link.label[locale]}</p>
              </LocaleLink>
            );
          })}
        </div>
        {/* message */}
        <p className="text-white hidden   2xl:block whitespace-nowrap">
          {navText[locale] ?? ""}
        </p>
      </div>
      <div className="flex items-center shrink-0 gap-2">
        {/* button */}
        <button
          onClick={donateNow}
          className="relative hidden lg:flex whitespace-nowrap max-md:text-sm group overflow-hidden bg-transparent hover:bg-primary duration-200 text-white py-2 md:py-4 px-4 md:px-8 rounded-full  items-center justify-center"
        >
          <div className="flex items-center gap-2 relative order-1">
            <IoMdHeart />
            <p className="">{locale == "en" ? "Donate Now" : "تبرع الأن"}</p>
          </div>
          <span className="order-2 w-full h-full  group-hover:h-0 duration-300 absolute top-0 left-0 bg-light-primary-color"></span>
        </button>

        {/* language toggle */}
        <LanguageBtn />
      </div>
    </div>
  );
}
