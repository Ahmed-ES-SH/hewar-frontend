"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiVideo,
  FiImage,
  FiUpload,
  FiYoutube,
  FiEdit3,
} from "react-icons/fi";

// أنواع البيانات
interface VideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setVideoData: any;
  imgSrc?: string | File | null;
  videoPath?: string | File | null;
}

// مكون لعرض الصورة المصغرة
const ThumbnailSection = ({
  imgSrc,
  onThumbnailChange,
  onThumbnailRemove,
}: {
  imgSrc: string | File | null;
  onThumbnailChange: (file: File) => void;
  onThumbnailRemove: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onThumbnailChange(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        الصورة المصغرة للفيديو
      </label>

      {imgSrc ? (
        <div className="relative group">
          <img
            src={
              typeof imgSrc === "string" ? imgSrc : URL.createObjectURL(imgSrc)
            }
            alt="صورة مصغرة"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white p-2 rounded-full shadow-lg mx-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <FiEdit3 className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={onThumbnailRemove}
              className="bg-white p-2 rounded-full shadow-lg mx-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <FiX className="text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiImage className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-sm text-gray-600">انقر لاختيار صورة مصغرة</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF حتى 10MB</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

// مكون لإدخال رابط يوتيوب
const YouTubeInput = ({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (url: string) => void;
  onClear: () => void;
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(inputValue);
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        رابط فيديو يوتيوب
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FiYoutube className="text-gray-400" />
          </div>
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            إزالة
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <FiUpload className="text-sm" />
          حفظ
        </button>
      </form>
      {inputValue && !isYouTubeUrl(inputValue) && (
        <p className="text-sm text-red-600 mt-1">يرجى إدخال رابط يوتيوب صالح</p>
      )}
    </div>
  );
};

// مكون لتحميل الفيديو المحلي
const LocalVideoUpload = ({
  videoFile,
  onVideoChange,
  onVideoRemove,
}: {
  videoFile: File | null;
  onVideoChange: (file: File) => void;
  onVideoRemove: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onVideoChange(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        فيديو محلي
      </label>

      {videoFile ? (
        <div className="relative group">
          <video
            controls
            className="w-full h-48 object-contain rounded-lg border border-gray-300 bg-black"
          >
            <source
              src={URL.createObjectURL(videoFile)}
              type={videoFile.type}
            />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white p-2 rounded-full shadow-lg mx-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <FiEdit3 className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={onVideoRemove}
              className="bg-white p-2 rounded-full shadow-lg mx-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <FiX className="text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiVideo className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-sm text-gray-600">انقر لرفع فيديو</p>
          <p className="text-xs text-gray-500 mt-1">MP4, WebM, OGG حتى 100MB</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </div>
  );
};

// المكون الرئيسي
const VideoPopup = ({
  isOpen,
  onClose,
  setVideoData,
  imgSrc = null,
  videoPath = null,
}: VideoPopupProps) => {
  const [thumbnail, setThumbnail] = useState<string | File | null>(imgSrc);
  const [video, setVideo] = useState<string | File | null>(videoPath);
  const [activeTab, setActiveTab] = useState<"youtube" | "upload">("youtube");

  // إعادة تعيين الحالة عند فتح الـ popup
  useEffect(() => {
    if (isOpen) {
      setThumbnail(imgSrc);
      setVideo(videoPath);
      setActiveTab(
        videoPath &&
          typeof videoPath === "string" &&
          (videoPath.includes("youtube.com") || videoPath.includes("youtu.be"))
          ? "youtube"
          : "upload"
      );
    }
  }, [isOpen, imgSrc, videoPath]);

  const handleThumbnailChange = (file: File) => {
    setThumbnail(file);
  };

  const handleThumbnailRemove = () => {
    setThumbnail(null);
  };

  const handleYouTubeUrlChange = (url: string) => {
    setVideo(url);
  };

  const handleYouTubeUrlClear = () => {
    setVideo(null);
  };

  const handleVideoUpload = (file: File) => {
    setVideo(file);
  };

  const handleVideoRemove = () => {
    setVideo(null);
  };

  const handleSave = () => {
    setVideoData({
      imgSrc: thumbnail,
      videoPath: video,
    });
    onClose();
  };

  const isFormValid = () => {
    return thumbnail !== null && video !== null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-99999"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {imgSrc || videoPath ? "تعديل الفيديو" : "إضافة فيديو جديد"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FiX className="text-gray-500 text-xl" />
              </button>
            </div>

            {/* المحتوى */}
            <div className="p-6 overflow-y-auto max-h-[calc(88vh-140px)]">
              {/* قسم الصورة المصغرة */}
              <ThumbnailSection
                imgSrc={thumbnail}
                onThumbnailChange={handleThumbnailChange}
                onThumbnailRemove={handleThumbnailRemove}
              />

              {/* قسم الفيديو */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفيديو
                </label>

                {/* أزرار التبويب */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-center font-medium ${
                      activeTab === "youtube"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    } transition-colors duration-200`}
                    onClick={() => setActiveTab("youtube")}
                  >
                    <FiYoutube className="inline-block ml-1" />
                    يوتيوب
                  </button>
                </div>

                {/* محتوى التبويب النشط */}
                {activeTab === "youtube" ? (
                  <YouTubeInput
                    value={typeof video === "string" ? video : ""}
                    onChange={handleYouTubeUrlChange}
                    onClear={handleYouTubeUrlClear}
                  />
                ) : (
                  <LocalVideoUpload
                    videoFile={video instanceof File ? video : null}
                    onVideoChange={handleVideoUpload}
                    onVideoRemove={handleVideoRemove}
                  />
                )}
              </div>

              {/* معاينة */}
              {(thumbnail || video) && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    معاينة
                  </h3>

                  {thumbnail && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        الصورة المصغرة:
                      </p>
                      <img
                        src={
                          typeof thumbnail === "string"
                            ? thumbnail
                            : URL.createObjectURL(thumbnail)
                        }
                        alt="معاينة الصورة المصغرة"
                        className="h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  {video && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">الفيديو:</p>
                      {typeof video === "string" ? (
                        // عرض فيديو يوتيوب
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(
                              video
                            )}`}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        // عرض فيديو محلي
                        <video
                          controls
                          className="w-full h-48 object-contain rounded-lg border border-gray-300 bg-black"
                        >
                          <source
                            src={URL.createObjectURL(video)}
                            type={video.type}
                          />
                          متصفحك لا يدعم تشغيل الفيديو
                        </video>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* الفوتر */}
            <div className="flex justify-between items-center p-6  border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                  isFormValid()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                حفظ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// دالة مساعدة لاستخراج معرف فيديو يوتيوب من الرابط
function getYouTubeId(url: string): string {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
}

export default VideoPopup;
