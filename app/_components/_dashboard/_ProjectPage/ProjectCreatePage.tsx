"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Category, Project } from "./type";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import FormRightSide from "./FormRightSide";
import FormLeftSide from "./FormLeftSide";
import { useRouter } from "next/navigation";

interface props {
  categories: Category[];
}

export default function ProjectCreatePage({ categories }: props) {
  const router = useRouter();
  const [project, setProject] = useState<Partial<Project>>({
    id: 0,
    title: "",
    description: "",
    target_amount: "",
    location: null,
    metadata: [],
    deletedImages: [],
    images: [],
    status: "pending",
    category_id: "",
    order: 0,
    created_by: 2,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [location, setLocation] = useState<Project["location"] | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (project.title && !project.title.trim()) {
      newErrors.title = "عنوان المشروع مطلوب";
    }

    if (project.description && !project.description.trim()) {
      newErrors.description = "وصف المشروع مطلوب";
    }

    if (!project.target_amount || parseFloat(project.target_amount) <= 0) {
      newErrors.target_amount = "المبلغ المستهدف يجب أن يكون أكبر من الصفر";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(project).forEach(([key, value]) => {
        // تجاهل الحقول غير المهمة
        if (["deletedImages", "metadata"].includes(key)) return;

        if (value === null || value === undefined) return;

        if (key == "image") return;

        // تحويل Boolean إلى 1/0
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
          return;
        }

        // التعامل مع الصور
        if (key === "images" && Array.isArray(value)) {
          value.forEach((img: any) => {
            if (img instanceof File) {
              formData.append("images[]", img);
            } else if ("file" in img && img.file instanceof File) {
              formData.append("images[]", img.file);
            }
          });
          return;
        }

        // تحويل object مثل location إلى JSON
        if (typeof value === "object" && !Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          return;
        }

        formData.append(key, value as any);
      });

      if (project.metadata && project.metadata.length > 0)
        formData.append("metadata", JSON.stringify(project.metadata));

      if (location) formData.append("location", JSON.stringify(location));

      if ((project?.image as any) instanceof File)
        formData.append("image", project.image as any);

      // إرسال POST لإنشاء مشروع جديد
      const response = await instance.post("/add-project", formData);

      if (response.status === 201) {
        toast.success("تم إنشاء المشروع بنجاح ✅");
        setProject(response.data.data);
        router.push(`/en/dashboard/projects`);
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إنشاء المشروع"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  console.log(project);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="c-container">
        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إضافة مشروع جديد
          </h1>
          <p className="text-gray-600">قم بإدخال معلومات المشروع الجديد</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* العمود الأيمن */}
            <FormRightSide
              setProject={setProject as any}
              project={project as Project}
              errors={errors}
              setErrors={setErrors}
              location={location}
              setLocation={setLocation}
            />

            {/* العمود الأيسر - الإعدادات */}
            <FormLeftSide
              setProject={setProject as any}
              project={project as Project}
              errors={errors}
              setErrors={setErrors}
              isSubmitting={isSubmitting}
              categories={categories}
              type="create"
            />
          </motion.div>
        </form>
      </div>
    </div>
  );
}
