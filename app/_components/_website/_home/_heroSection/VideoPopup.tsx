"use client";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

interface VideoPopupProps {
  videoUrl: string | null;
  onClose: () => void;
  // نصوص يمكن تخصيصها، نضع افتراضيات بالإنجليزية
  closeText?: string;
  errorMessage?: string;
  isOpen: boolean;
}

export default function VideoPopup({
  videoUrl,
  onClose,
  isOpen,
  closeText = "Close",
  errorMessage = "Invalid video URL",
}: VideoPopupProps) {
  // دالة لتحديد نوع الفيديو
  const getVideoType = (url: string | null) => {
    if (!url) return "invalid";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }

    // تحقق من امتدادات الفيديو الشائعة
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
    if (videoExtensions.some((ext) => url.toLowerCase().includes(ext))) {
      return "direct";
    }

    return "invalid";
  };

  const videoType = getVideoType(videoUrl);

  // استخراج معرف فيديو اليوتيوب
  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const youtubeVideoId =
    videoType === "youtube" && videoUrl ? getYoutubeVideoId(videoUrl) : null;

  // ✅ استخدم Portal فقط إذا كان الـ DOM جاهز (لمنع مشاكل SSR)
  if (typeof window === "undefined") return null;
  const portalTarget = document.body;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md  flex items-center justify-center z-9999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-4 max-w-3xl w-full mx-4 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="absolute text-red-400 top-2 right-2  hover:text-red-700 transition-colors"
              aria-label={closeText}
            >
              <FaTimes size={24} />
            </button>

            {/* محتوى الفيديو */}
            <div className="w-full aspect-video">
              {videoType === "youtube" && youtubeVideoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&enablejsapi=1`}
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                ></iframe>
              )}

              {videoType === "direct" && (
                <video
                  src={videoUrl ?? "/noImage.png"}
                  controls
                  className="w-full h-full rounded"
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {videoType === "invalid" && (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">{errorMessage}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, portalTarget);
}
