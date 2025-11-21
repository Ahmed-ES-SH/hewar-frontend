"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSave, FiImage, FiTag, FiEye } from "react-icons/fi";
import ArticlePublishing from "./ArticlePublishing";
import { ArticleFormData } from "../_articles/types";
import { Category } from "../_ProjectPage/type";
import LoadingSpinner from "./LoadingSpinner";
import ArticleBasicInfo from "./ArticleBasicInfo";
import ArticleContent from "./ArticleContent";
import ArticleSEO from "./ArticleSEO";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useRouter } from "next/navigation";

interface CreateArticlePageProps {
  categories: Category[];
  type: "news" | "article";
}

export default function CreateArticlePage({
  categories,
  type,
}: CreateArticlePageProps) {
  const router = useRouter();

  const typeBadge = {
    news: {
      label: "خبر",
      className: "bg-red-100 text-red-700 border border-red-300",
    },
    article: {
      label: "مقال",
      className: "bg-green-100 text-green-700 border border-green-300",
    },
  };

  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category_id: "",
    status: "draft",
    scheduled_for: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: [],
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "content" | "seo" | "publishing"
  >("basic");

  const handleCreate = async () => {
    try {
      setLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "image" ||
          key === "scheduled_for" ||
          key === "meta_keywords"
        ) {
          return;
        }

        if (typeof value === "boolean") {
          data.append(key, value ? "1" : "0");
          return;
        }

        data.append(key, value as any);
      });

      data.append("author_id", "2");

      if ((formData.image as any) instanceof File) {
        data.append("image", formData.image);
      }

      if (formData.scheduled_for) {
        data.append("scheduled_for", formData.scheduled_for);
      }

      if (formData.meta_keywords && formData.meta_keywords.length > 0) {
        data.append("meta_keywords", JSON.stringify(formData.meta_keywords));
      }

      const endPoint = type == "article" ? "/add-article" : "/add-news";
      const direct =
        type == "article" ? `/en/dashboard/articles` : `/en/dashboard/news`;

      const response = await instance.post(endPoint, data);

      if (response.status === 200 || response.status === 201) {
        toast.success("تم إضافة المقال بنجاح ✅");
        router.push(direct);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطأ أثناء محاولة إضافة المقال. الرجاء المحاولة لاحقًا.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ArticleFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tabs = [
    { id: "basic", label: "المعلومات الأساسية", icon: FiTag },
    { id: "content", label: "المحتوى", icon: FiEye },
    { id: "seo", label: "تحسين محركات البحث", icon: FiImage },
    { id: "publishing", label: "إعدادات النشر", icon: FiSave },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {type === "news" ? "إضافة خبر جديد" : "إضافة مقال جديد"}
                </h1>

                {/* Badge */}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${typeBadge[type].className}`}
                >
                  {typeBadge[type].label}
                </span>
              </div>
              <p className="text-gray-600">قم بإدخال تفاصيل المقال الجديد.</p>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{loading ? "جاري الحفظ..." : "حفظ المقال"}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <nav className="gap-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm">
              {activeTab === "basic" && (
                <ArticleBasicInfo
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  updateFormData={updateFormData}
                />
              )}

              {activeTab === "content" && (
                <ArticleContent
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}

              {activeTab === "seo" && (
                <ArticleSEO
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}

              {activeTab === "publishing" && (
                <ArticlePublishing
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
