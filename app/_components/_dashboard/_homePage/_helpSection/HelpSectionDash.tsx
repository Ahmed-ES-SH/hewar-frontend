"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Img from "@/app/_components/_global/Img";
import { FaPlay } from "react-icons/fa";
import { TextType } from "../_aboutSectionDash/AboutSectionDash";
import { VscLoading } from "react-icons/vsc";
import EditTextPopup from "../../EditTextPopup";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import VideoPopup from "./VideoPopup";

interface StatType {
  value: string;
  title: TextType;
}

interface Props {
  stats: StatType[];
  headData: { title: TextType; description: TextType };
  imageSrc: string;
  VideoSrc: string;
}

type FieldType =
  | "head_title"
  | "head_description"
  | "stat_title"
  | "stat_value"
  | "";

export default function HelpSectionDash({
  stats,
  headData,
  imageSrc,
  VideoSrc,
}: Props) {
  const [localStats, setLocalStats] = useState<StatType[]>(stats ?? []);
  const [head, setHead] = useState(headData);
  const [loading, setLoading] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldType, setFieldType] = useState<FieldType>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [helpData, setHelpData] = useState({
    headData: headData,
    stats: stats,
  });
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [videoData, setVideoData] = useState<{
    imgSrc: string | File | null;
    videoPath: string | File | null;
  }>({
    imgSrc: imageSrc,
    videoPath: VideoSrc,
  });

  const [selected, setSelected] = useState<any>({
    ar: "",
    en: "",
    value: "",
  });

  /**
   * 🔄 تحديث البيانات الرئيسية باستمرار
   */
  useEffect(() => {
    setHelpData({
      headData: head,
      stats: localStats,
    });
  }, [head, localStats]);

  /**
   * فتح محرر نصوص
   */
  const handleOpenEditor = (type: FieldType, index: number | null = null) => {
    setFieldType(type);
    setActiveIndex(index);

    if (type === "head_title") {
      setSelected({ ar: head.title.ar, en: head.title.en });
    } else if (type === "head_description") {
      setSelected({ ar: head.description.ar, en: head.description.en });
    } else if (type === "stat_title" && index !== null) {
      setSelected({
        ar: localStats[index].title.ar,
        en: localStats[index].title.en,
      });
    } else if (type === "stat_value" && index !== null) {
      setSelected({
        value: localStats[index].value,
      });
    }

    setIsPopupOpen(true);
  };

  /**
   * إدخال بيانات popup
   */
  const handleInputChange = (name: string, value: string) => {
    setSelected((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * حقول popup
   */
  const inputs = useMemo(() => {
    if (!fieldType) return [];

    if (fieldType === "stat_value") {
      return [
        {
          name: "value",
          value: selected.value,
          label: "القيمة",
          type: "short-text",
        },
      ];
    }

    return ["ar", "en"].map((lang) => ({
      name: lang,
      value: selected[lang],
      label: `النص (${lang.toUpperCase()})`,
      type: "short-text",
    }));
  }, [fieldType, selected]);

  /**
   * حفظ التعديلات
   */
  const handleSaveChanges = () => {
    if (fieldType === "head_title") {
      setHead((prev) => ({
        ...prev,
        title: { ar: selected.ar, en: selected.en },
      }));
    } else if (fieldType === "head_description") {
      setHead((prev) => ({
        ...prev,
        description: { ar: selected.ar, en: selected.en },
      }));
    } else if (fieldType === "stat_title" && activeIndex !== null) {
      setLocalStats((prev) => {
        const clone = [...prev];
        clone[activeIndex].title = {
          ar: selected.ar,
          en: selected.en,
        };
        return clone;
      });
    } else if (fieldType === "stat_value" && activeIndex !== null) {
      setLocalStats((prev) => {
        const clone = [...prev];
        clone[activeIndex].value = selected.value;
        return clone;
      });
    }

    setIsPopupOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(`column_1`, JSON.stringify(helpData.headData));
      formData.append(`column_2`, JSON.stringify(helpData.stats));
      if (videoData.imgSrc instanceof File)
        formData.append(`column_3`, videoData.imgSrc);
      if (videoData.videoPath) formData.append(`column_4`, videoData.videoPath);
      const response = await instance.post(
        `/update-variables-data?id=3&limit=6`,
        formData
      );
      if (response.status == 200) {
        toast.success("تم تحديث بيانات القسم بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطا اثناء محاولة تحديث بيانات القسم الرجاء المحاولة لاحقا .";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected({ ar: "", en: "", value: "" });
  };

  return (
    <>
      <section className="bg-primary-color rounded-lg border border-gray-300 shadow-md mb-12 text-white relative overflow-hidden py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2
              onClick={() => handleOpenEditor("head_title")}
              className="text-3xl md:text-4xl font-bold cursor-pointer select-effect hover:bg-white hover:text-black duration-300"
            >
              {head.title.ar}
            </h2>

            <p
              onClick={() => handleOpenEditor("head_description")}
              className="text-gray-200 max-w-md cursor-pointer select-effect hover:bg-white hover:text-black duration-300"
            >
              {head.description.ar}
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8 max-w-md">
              {localStats.map((item, index) => (
                <div key={index}>
                  <p
                    onClick={() => handleOpenEditor("stat_value", index)}
                    className="text-2xl font-bold text-[#FBBF24] cursor-pointer select-effect hover:bg-white hover:text-black duration-300"
                  >
                    {item.value}
                  </p>

                  <p
                    onClick={() => handleOpenEditor("stat_title", index)}
                    className="text-sm text-gray-200 cursor-pointer select-effect hover:bg-white hover:text-black duration-300"
                  >
                    {item.title.ar}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative select-effect hover:bg-white rounded-lg"
            onClick={() => setIsVideoPopupOpen(true)}
          >
            <Img
              src={
                videoData.imgSrc instanceof File
                  ? URL.createObjectURL(videoData.imgSrc)
                  : videoData.imgSrc ?? "/website/video-thumb1-1-2-1.png"
              }
              alt="Needy People"
              className="rounded-2xl object-cover w-full"
              width={700}
              height={500}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white text-[#1E6B63] rounded-full flex items-center justify-center shadow-lg">
                <FaPlay className="text-2xl ml-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Save All */}
      <div className="pt-4">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="lg:px-12 px-6 py-3 mt-4 flex items-center justify-center rounded bg-green-500 hover:bg-green-700 duration-200 text-white shadow w-fit  mx-auto"
        >
          {loading ? <VscLoading className=" animate-spin" /> : "حفظ التعديلات"}
        </button>
      </div>

      {/* Popup */}
      <EditTextPopup
        loadingState={false}
        operationType="edit"
        onSave={handleSaveChanges}
        showPopup={isPopupOpen}
        onClose={handleClosePopup}
        inputs={inputs}
        onChange={handleInputChange as any}
      />

      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={() => setIsVideoPopupOpen(false)}
        setVideoData={setVideoData}
        imgSrc={videoData.imgSrc}
        videoPath={videoData.videoPath}
      />
    </>
  );
}
