"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiX, FiTrash2, FiUpload, FiVideo } from "react-icons/fi";
import { createPortal } from "react-dom";
import { Slice } from "./types";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";

interface ModelProps {
  setSlices: Dispatch<SetStateAction<Slice[]>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSliceModal({
  setSlices,
  isOpen,
  onClose,
}: ModelProps) {
  const [formData, setFormData] = useState<Partial<Slice>>({});
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 🧩 التعامل مع الإدخال النصي
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🧩 إدخال رابط الفيديو (YouTube)
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, link_video: url });
    setVideoPreview(url);
  };

  // 🧩 تحميل ملف الفيديو
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setFormData({ ...formData, link_video: url });
    }
  };

  // 🧩 تحميل الصورة
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData({ ...formData, image: url });
    }
  };

  // 🗑️ حذف الفيديو
  const handleDeleteVideo = () => {
    setVideoPreview("");
    setVideoFile(null);
    setFormData({ ...formData, link_video: "" });
  };

  // 🗑️ حذف الصورة
  const handleDeleteImage = () => {
    setImagePreview("");
    setImageFile(null);
    setFormData({ ...formData, image: "" });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const buildFormData = () => {
    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      // تجاهل الحقول الفارغة أو ملفات الصورة/الفيديو
      if (!value || ["image", "video_path"].includes(key)) return;

      // إذا كان videoFile موجود كـ File، تجاهل link_video
      if (videoFile instanceof File && key === "link_video") return;

      fd.append(key, value as any);
    });

    if (imageFile instanceof File) fd.append("image", imageFile);
    if (videoFile instanceof File) fd.append("video_path", videoFile);

    return fd;
  };

  // 🚀 إرسال البيانات
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newData = buildFormData();

      const response = await instance.post(`/slices`, newData);
      if (response.status === 201) {
        const newSlice = response.data.data;
        toast.success("تم إضافة الشريحة بنجاح.");
        setSlices((prev) => [newSlice, ...prev]);
        onClose();
        setFormData({});
        setImageFile(null);
        setVideoFile(null);
        setImagePreview("");
        setVideoPreview("");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "حدث خطأ أثناء إضافة الشريحة.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (typeof window === "undefined") return null;
  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-999999"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] hidden-scrollbar overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الرأس */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                إضافة شريحة جديدة
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="إغلاق"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* المحتوى */}
            <div className="p-6 space-y-6">
              {/* العناوين */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان بالعربية
                  </label>
                  <input
                    type="text"
                    name="title_ar"
                    value={formData.title_ar || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان بالإنجليزية
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* العناوين الفرعية */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان الفرعي بالعربية
                  </label>
                  <textarea
                    name="subTitle_ar"
                    value={formData.subTitle_ar || ""}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان الفرعي بالإنجليزية
                  </label>
                  <textarea
                    name="subTitle_en"
                    value={formData.subTitle_en || ""}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>
              </div>

              {/* الفيديو */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    الفيديو
                  </label>
                  {videoPreview && (
                    <button
                      type="button"
                      onClick={handleDeleteVideo}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <FiTrash2 size={16} /> حذف الفيديو
                    </button>
                  )}
                </div>

                {videoPreview ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    {videoPreview.includes("youtube.com") ||
                    videoPreview.includes("youtu.be") ? (
                      <iframe
                        src={getYouTubeEmbedUrl(videoPreview)}
                        className="w-full h-full"
                        allowFullScreen
                        title="Video Preview"
                      />
                    ) : (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="url"
                      placeholder="رابط YouTube"
                      onChange={handleVideoUrlChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* الصورة */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    صورة الغلاف
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <FiTrash2 size={16} /> حذف الصورة
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <FiUpload className="text-gray-400" size={32} />
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block">
                        اضغط لاختيار صورة
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, GIF (MAX. 5MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* الأزرار */}
              <div className="flex max-md:flex-col gap-3 mt-6 pb-2 sticky bottom-0 bg-white pt-4 border-t">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  إلغاء
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-medium disabled:bg-blue-200"
                >
                  {isLoading ? (
                    <VscLoading className="text-blue-500 animate-spin lg:size-6" />
                  ) : (
                    <>
                      <FiSave size={18} /> إضافة الشريحة
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
