"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface EditNavTextPopupProps {
  isOpen: boolean;
  initialValue: { en: string; ar: string };
  onClose: () => void;
  onSave: (value: { en: string; ar: string }) => void;
}

export default function EditNavTextPopup({
  isOpen,
  initialValue,
  onClose,
  onSave,
}: EditNavTextPopupProps) {
  const [form, setForm] = useState(initialValue);

  // Sync form when popup opens
  useEffect(() => {
    if (isOpen) setForm(initialValue);
  }, [isOpen, initialValue]);

  const handleInput = (key: "en" | "ar", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (typeof window === "undefined") return null;
  const portalTarget = document.body;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-999999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-5xl p-6 shadow-xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6">
              تعديل النص
            </h2>

            {/* Arabic Input */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">النص العربي</label>
              <textarea
                value={form.ar}
                onChange={(e) => handleInput("ar", e.target.value)}
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>

            {/* English Input */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">النص الإنجليزي</label>
              <textarea
                value={form.en}
                onChange={(e) => handleInput("en", e.target.value)}
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                حفظ
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, portalTarget);
}
