import { IoLogoTiktok } from "react-icons/io5";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaSnapchat,
  FaEnvelope,
} from "react-icons/fa";
import { TbBrandOffice } from "react-icons/tb";

export const addUserinputs = [
  {
    name: "image",
    type: "file",
    fildType: "user-image",
    label: { ar: "صورة المستخدم", en: "" },
  },
  {
    name: "name",
    type: "text",
    fildType: "short-text",
    label: { ar: "الإسم", en: "" },
    placeholder: "أدخل إسم الحساب الجديد",
  },
  {
    name: "email",
    type: "email",
    fildType: "short-text",
    label: { ar: "البريد الإلكترونى", en: "" },
    placeholder: "أدخل البريد الإلكترونى للحساب الجديد",
  },
  {
    name: "password",
    type: "password",
    fildType: "short-text",
    label: { ar: "كلمة السر", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
  },
  {
    name: "role",
    type: "",
    fildType: "select-type",
    label: { ar: "نوع الحساب", en: "" },
    placeholder: "",
    selectItems: [{ name: "admin" }, { name: "user" }],
  },
];

export const Categoryinputs = [
  {
    name: "image",
    type: "file",
    fildType: "normal-image",
    label: { ar: "صورة المستخدم", en: "" },
  },
  {
    name: "title_ar",
    type: "text",
    fildType: "short-text",
    label: { ar: "عنوان القسم بالعربية", en: "" },
    placeholder: "أدخل عنوان القسم بالعربية  ",
  },
  {
    name: "title_en",
    type: "text",
    fildType: "short-text",
    label: { ar: "عنوان القسم بالانجليزية", en: "" },
    placeholder: "أدخل عنوان القسم بالانجليزية  ",
  },
];

export const UpdateUserinputs = [
  {
    name: "image",
    type: "file",
    fildType: "user-image",
    label: { ar: "صورة المستخدم", en: "" },
  },
  {
    name: "name",
    type: "text",
    fildType: "short-text",
    label: { ar: "الإسم", en: "" },
    placeholder: "أدخل إسم الحساب الجديد",
  },
  {
    name: "email",
    type: "email",
    fildType: "short-text",
    label: { ar: "البريد الإلكترونى", en: "" },
    placeholder: "أدخل البريد الإلكترونى للحساب الجديد",
  },

  {
    name: "role",
    type: "",
    fildType: "select-type",
    label: { ar: "نوع الحساب", en: "" },
    selectItems: [
      { name: "أدمن (مسؤول الموقع)", value: "admin" },
      { name: "مستخدم", value: "user" },
    ],
  },
];

export const socialContactInfoInputs = [
  {
    name: "whatsapp_number",
    label: "رقم الواتساب",
    icon: <FaWhatsapp className="text-green-500 text-xl" />,
    placeholder: "WhatsApp Number",
    type: "text",
  },
  {
    name: "gmail_account",
    label: "حساب Gmail",
    icon: <FaEnvelope className="text-red-500 text-xl" />,
    placeholder: "Gmail Account",
    type: "email",
  },
  {
    name: "official_email",
    label: "البريد الرسمي",
    icon: <TbBrandOffice className="text-red-500 text-xl" />,
    placeholder: "Official Email",
    type: "email",
  },
  {
    name: "facebook_account",
    label: "رابط حساب فيسبوك",
    icon: <FaFacebook className="text-blue-700 text-xl" />,
    placeholder: "Facebook Account URL",
    type: "text",
  },
  {
    name: "x_account",
    label: "رابط حساب X",
    icon: <FaTwitter className="text-blue-400 text-xl" />,
    placeholder: "X (Twitter) Account URL",
    type: "text",
  },
  {
    name: "youtube_account",
    label: "رابط قناة يوتيوب",
    icon: <FaYoutube className="text-red-600 text-xl" />,
    placeholder: "YouTube Account URL",
    type: "text",
  },
  {
    name: "instgram_account",
    label: "رابط حساب إنستغرام",
    icon: <FaInstagram className="text-pink-500 text-xl" />,
    placeholder: "Instagram Account URL",
    type: "text",
  },
  {
    name: "snapchat_account",
    label: "رابط حساب سناب شات",
    icon: <FaSnapchat className="text-yellow-500 text-xl" />,
    placeholder: "Snapchat Account URL",
    type: "text",
  },
  {
    name: "tiktok_account",
    label: "رابط حساب تيك توك",
    icon: <IoLogoTiktok className="text-black text-xl" />,
    placeholder: "TikTok Account URL",
    type: "text",
  },
];

export const addCategoryinputs = [
  {
    name: "image",
    type: "file",
    fildType: "normal-image",
    label: { ar: "صورة القسم", en: "" },
  },
  {
    name: "icon_name",
    type: "non-input",
    fildType: "icon-fild",
    label: { ar: "حدد  أيقونة القسم", en: "" },
  },
  {
    name: "title_en",
    type: "text",
    fildType: "short-text",
    label: { ar: "العنوان (EN)", en: "" },
    placeholder: "أدخل عنوان القسم الجديد بالانجلزية",
  },
  {
    name: "title_ar",
    type: "text",
    fildType: "short-text",
    label: { ar: "العنوان (AR)", en: "" },
    placeholder: "أدخل عنوان القسم الجديد بالعربية",
  },
  {
    name: "bg_color",
    type: "color",
    fildType: "color-fild",
    label: { ar: "حدد لون خلفية القسم", en: "" },
    placeholder: "",
  },
];
