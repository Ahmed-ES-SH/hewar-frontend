"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { useLocale } from "@/app/_hooks/useLocale";
import { useTranslation } from "@/app/_hooks/useTranslation";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";

export function ContactForm({ disabled = false }) {
  const translations = useTranslation("contact");

  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await instance.post(`/add-contact-message`, formData);
      if (response.status == 201) {
        setFormData({ name: "", email: "", phone_number: "", message: "" });
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا غير متوقع اثناء ارسال الرسالة الرجاء المحاولة لاحقا .";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = locale === "ar";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white h-full flex-1 rounded-2xl border border-gray-200 p-8 shadow-sm ${
        disabled ? "grayscale-100" : ""
      }`}
    >
      <div className="space-y-4">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          name="name"
          placeholder={translations.form.name}
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 ltr:text-left rtl:text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          name="email"
          placeholder={translations.form.email}
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 ltr:text-left rtl:text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="tel"
          name="phone_number"
          placeholder={translations.form.phone}
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-4 py-3 ltr:text-left rtl:text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          name="message"
          placeholder={translations.form.message}
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 ltr:text-left rtl:text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <FiSend size={18} />
            {translations.form.submit}
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
