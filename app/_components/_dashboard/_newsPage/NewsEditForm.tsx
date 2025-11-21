"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSave, FiTag, FiCalendar, FiBarChart2 } from "react-icons/fi";
import { ImageUpload } from "../_ProjectPage/ImageUpload";
import { ArticleType } from "../_articles/types";
import { Category } from "../_ProjectPage/type";
import KeywordsInput from "./KeywordsInput";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

interface NewsEditFormProps {
  newsData: ArticleType;
  categories: Category[];
}

// مكون الإدخال الأساسي
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full border border-gray-300 rounded-lg shadow-sm p-3 ${
          Icon ? "pl-10" : "pl-3"
        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  </div>
);

// مكون Textarea
const TextareaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// مكون Select
const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      required={required}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// المكون الرئيسي لتعديل المقال
const NewsEditForm = ({ newsData, categories }: NewsEditFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState<ArticleType>(newsData);
  const [keywords, setKeywords] = useState<string[]>(newsData.meta_keywords);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key == "image" ||
          key == "scheduled_for" ||
          key == "meta_keywords"
        ) {
          return;
        }

        if (typeof value === "boolean") {
          updatedData.append(key, value ? "1" : "0");
          return;
        }

        updatedData.append(key, value as any);
      });

      if ((formData.image as any) instanceof File)
        updatedData.append("image", formData.image);

      if (formData.scheduled_for)
        updatedData.append("scheduled_for", formData.scheduled_for);

      if (keywords && keywords.length > 0) {
        updatedData.append("meta_keywords", JSON.stringify(keywords));
      }

      const response = await instance.post(
        `/update-news/${newsData.id}`,
        updatedData
      );
      if (response.status == 200) {
        toast.success("تم تحديث بيانات المقال بنجاح .");
        router.push(`/en/dashboard/news`);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطا اثناء محاولة تحديث بيانات المقال الرجاء المحاولة لاحقا .";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof ArticleType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (imageData: string) => {
    setFormData({ ...formData, image: imageData });
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: "" });
  };

  const statusOptions = [
    { value: "draft", label: "مسودة" },
    { value: "published", label: "منشور" },
    { value: "scheduled", label: "مجدول" },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.title_ar,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[90%] my-12 mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">تعديل المقال</h2>
        <button
          onClick={handleSave}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <VscLoading className="animate-spin" />
          ) : (
            <div className="flex items-center gap-1">
              <FiSave className="ml-2" />
              حفظ التغييرات
            </div>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-4">
          {/* المعلومات الأساسية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              المعلومات الأساسية
            </h3>

            <InputField
              label="عنوان المقال"
              value={formData.title}
              onChange={(value) => updateField("title", value)}
              placeholder="أدخل عنوان المقال..."
              required
            />

            <InputField
              label="الرابط (Slug)"
              value={formData.slug}
              onChange={(value) => updateField("slug", value)}
              placeholder="رابط-المقال..."
            />

            <TextareaField
              label="المحتوى"
              value={formData.content}
              onChange={(value) => updateField("content", value)}
              placeholder="اكتب محتوى المقال هنا..."
              rows={8}
              required
            />

            <TextareaField
              label="الملخص"
              value={formData.excerpt}
              onChange={(value) => updateField("excerpt", value)}
              placeholder="ملخص قصير عن المقال..."
              rows={3}
            />
          </motion.div>

          {/* تحسين محركات البحث */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBarChart2 className="ml-2" />
              تحسين محركات البحث (SEO)
            </h3>

            <InputField
              label="Meta Title"
              value={formData.meta_title}
              onChange={(value) => updateField("meta_title", value)}
              placeholder="عنوان الصفحة لمحركات البحث..."
            />

            <TextareaField
              label="Meta Description"
              value={formData.meta_description}
              onChange={(value) => updateField("meta_description", value)}
              placeholder="وصف الصفحة لمحركات البحث..."
              rows={3}
            />
            <KeywordsInput
              keywords={keywords}
              setKeywords={setKeywords}
              label="الكلمات المفتاحية"
              placeholder="أدخل كلمة مفتاحية ثم اضغط Enter..."
            />
          </motion.div>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-4">
          {/* الإعدادات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              الإعدادات
            </h3>

            <SelectField
              label="الحالة"
              value={formData.status}
              onChange={(value) => updateField("status", value)}
              options={statusOptions}
            />

            <SelectField
              label="الفئة"
              value={formData.category_id}
              onChange={(value) => updateField("category_id", parseInt(value))}
              options={categoryOptions}
            />

            <InputField
              label="الترتيب"
              value={formData.order.toString()}
              onChange={(value) => updateField("order", parseInt(value) || 0)}
              type="number"
              icon={FiTag}
            />

            <ImageUpload
              imageUrl={formData.image}
              label="صورة المقال"
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
            />
          </motion.div>

          {/* التواريخ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiCalendar className="ml-2" />
              التواريخ
            </h3>

            <InputField
              label="تاريخ النشر"
              value={formData.published_at.slice(0, 16)}
              onChange={(value) => updateField("created_at", value)}
              type="datetime-local"
            />

            {formData.scheduled_for && (
              <InputField
                label="الجدولة (اختياري)"
                value={
                  formData.scheduled_for
                    ? formData.scheduled_for.slice(0, 16)
                    : ""
                }
                onChange={(value) =>
                  updateField("scheduled_for", value || null)
                }
                type="datetime-local"
              />
            )}
          </motion.div>

          {/* الإحصائيات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              الإحصائيات
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="font-bold text-blue-600">
                  {formData.view_count}
                </div>
                <div className="text-gray-600">المشاهدات</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="font-bold text-green-600">
                  {formData.share_count}
                </div>
                <div className="text-gray-600">المشاركات</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="font-bold text-red-600">
                  {formData.like_count}
                </div>
                <div className="text-gray-600">الإعجابات</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="font-bold text-purple-600">
                  {formData.tags.length}
                </div>
                <div className="text-gray-600">الوسوم</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsEditForm;
