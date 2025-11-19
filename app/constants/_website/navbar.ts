import { FaBlog, FaHome } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { SiCloudflareworkers } from "react-icons/si";
import { SlOrganization } from "react-icons/sl";
import { IoNewspaperOutline } from "react-icons/io5";

export const links = [
  {
    icon: FaHome,
    href: "/",
    label: { en: "Home", ar: "الرئيسية" },
  },
  {
    icon: IoIosInformationCircleOutline,
    href: "/about",
    label: { en: "About", ar: "عن المركز" },
  },
  {
    icon: SiCloudflareworkers,
    href: "/ourwork",
    label: { en: "our Work", ar: "أعمالنا" },
  },
  {
    icon: FaBlog,
    href: "/blog",
    label: { en: "Blog", ar: "المدونة" },
  },
  {
    icon: IoNewspaperOutline,
    href: "/news",
    label: { en: "News", ar: "الأخبار" },
  },
  {
    icon: SlOrganization,
    href: "/centerbranches",
    label: { en: "Center branches", ar: "فروع المركز" },
  },
];
