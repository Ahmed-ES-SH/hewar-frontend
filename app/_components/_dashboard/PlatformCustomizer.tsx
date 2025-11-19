"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiImage, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { VscLoading } from "react-icons/vsc";
import { instance } from "@/app/_helpers/axios";
import { getImageSrc, ImageType } from "@/app/_helpers/GlobalHelpers";
import { toast } from "sonner";
import Img from "../_global/Img";
import EditNavTextPopup from "./EditNavTextPopup";

const PlatformCustomizer: React.FC = () => {
  const [logo, setLogo] = useState<ImageType | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#3b9797");
  const [secondaryColor, setSecondaryColor] = useState<string>("#4a9782");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [navText, setNavText] = useState({ en: "", ar: "" });
  const [open, setOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogo(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  const handleSecondaryColorChange = (color: string) => {
    setSecondaryColor(color);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      setUpdateLoading(true);
      const formData = new FormData();
      if (logo instanceof File) formData.append("column_1", logo);
      formData.append("column_2", primaryColor);
      formData.append("column_3", secondaryColor);
      formData.append("column_4", JSON.stringify(navText));

      const response = await instance.post(
        `/update-variables-data?id=5&limit=4`,
        formData
      );
      if (response.status == 200) {
        toast.success("تم تحديث البيانات المحدده بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطا غير متوقع اثناء تحديث البيانات .";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomizeData = async () => {
      try {
        const response = await instance.get(`/variables-data?id=5&limit=5`);
        if (response.status == 200) {
          const data = response.data.data;
          setLogo(data.column_1);
          setPrimaryColor(data.column_2);
          setSecondaryColor(data.column_3);
          setNavText(data.column_4 ?? { en: "", ar: "" });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomizeData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6  max-w-5xl mx-auto"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-right">
        تخصيص المنصة
      </h2>

      {/* منطقة تحميل اللوجو */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
          شعار المنصة
        </label>

        <div className="flex flex-col items-center justify-center">
          {logo ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative group"
            >
              <Img
                src={getImageSrc(logo)}
                alt="شعار المنصة"
                className="w-32 h-32 object-contain rounded-lg border-2 border-gray-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={handleLogoRemove}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  size="sm"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerFileInput}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <FiImage className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center">
                انقر لتحميل الشعار
              </span>
            </motion.div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />

          <Button
            onClick={triggerFileInput}
            variant="outline"
            className="mt-4 flex items-center gap-2"
          >
            <FiUpload className="w-4 h-4" />
            {logo ? "تغيير الشعار" : "تحميل الشعار"}
          </Button>
        </div>
      </div>

      {/* اختيار الألوان */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            اللون الأساسي
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            />
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="w-12 h-12 cursor-pointer rounded-lg border-0 bg-transparent"
            />
            <span className="text-sm text-gray-600 flex-1 text-right">
              {primaryColor}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            اللون الثانوي
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              style={{ backgroundColor: secondaryColor }}
            />
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => handleSecondaryColorChange(e.target.value)}
              className="w-12 h-12 cursor-pointer rounded-lg border-0 bg-transparent"
            />
            <span className="text-sm text-gray-600 flex-1 text-right">
              {secondaryColor}
            </span>
          </div>
        </div>
      </div>

      {/* معاينة التصميم */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3 text-right">
          معاينة التصميم
        </h3>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: logo ? "transparent" : primaryColor }}
          >
            {logo && (
              <img
                src={logo}
                alt="معاينة"
                className="w-full h-full object-contain rounded"
              />
            )}
          </div>
          <div className="flex-1">
            <div
              className="h-3 rounded-full mb-1"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="h-2 rounded-full w-3/4"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 w-fit  text-white flex items-center justify-center py-2 lg:px-12 px-3 mt-12 rounded"
        >
          {updateLoading ? (
            <VscLoading className="size-6 animate-spin" />
          ) : (
            " حفظ"
          )}
        </button>
        <button
          onClick={() => setOpen(true)}
          className="text-white flex items-center justify-center py-2 lg:px-12 px-3 mt-12 rounded bg-green-500 hover:bg-green-700"
        >
          تعديل النص فى شريط التنقل
        </button>
      </div>

      <EditNavTextPopup
        isOpen={open}
        initialValue={navText}
        onClose={() => setOpen(false)}
        onSave={(value) => setNavText(value)}
      />
    </motion.div>
  );
};

export default PlatformCustomizer;
