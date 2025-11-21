"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import useFetchData from "@/app/_hooks/useFetchData";
import LoadingSpin from "@/app/_components/_global/LoadingSpin";
import { socialContactInfoInputs } from "@/app/constants/_dashboard/Inputs";
import { FaMapLocation } from "react-icons/fa6";
import { Location } from "@/app/_components/_dashboard/_CenterBranches/types";
import MapSelector from "@/app/_components/_global/MapSelector";

interface dataType {
  id: number;
  facebook_account: string | null;
  instgram_account: string | null;
  snapchat_account: string | null;
  tiktok_account: string | null;
  x_account: string | null; // Twitter (X)
  youtube_account: string | null;
  gmail_account: string | null;
  official_email: string | null;
  whatsapp_number: string | null;
  address: string | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export default function EditSocialContactInfo() {
  const { loading, data } = useFetchData<dataType>(
    "/social-contact-info",
    false
  );

  const [accounts, setAccounts] = useState<Partial<dataType>>({});
  const [updateloading, setUpdateloading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccounts((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ تحقق إذا تم تعديل القيم فعلاً
    const hasChanged = Object.keys(accounts).some(
      (key) => (accounts as any)[key] !== (data as any)[key]
    );

    if (!hasChanged) {
      toast.error("يجب تعديل حقل واحد على الأقل قبل الحفظ.");
      return;
    }

    setUpdateloading(true);
    try {
      const formData = new FormData();
      Object.entries(accounts).forEach(([key, value]) => {
        if (key == "location") return;
        formData.append(key, value as string);
      });

      if (accounts.location)
        formData.append("location", JSON.stringify(accounts.location));

      const response = await instance.post(
        "/update-social-contact-info",
        formData
      );
      if (response.status === 200) {
        toast.success("تم تعديل روابط التواصل بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      const errors = error?.response?.data?.errors;

      // ✅ أول مفتاح
      const firstKey = Object.keys(errors)[0];

      // ✅ أول قيمة (هتكون Array غالبًا)
      const firstValue = errors[firstKey];

      // ✅ أول رسالة عربية
      const firstMessageAr = firstValue[0]["ar"];

      toast.error(firstMessageAr);
    } finally {
      setUpdateloading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setAccounts(data);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  console.log(accounts);

  return (
    <div
      style={{ direction: "rtl" }}
      className="w-full min-h-[90vh]  my-3 flex items-center justify-center"
    >
      <div className="w-5xl h-fit  p-6 bg-white shadow-2xl border border-gray-300 rounded-lg">
        <motion.div
          style={{ direction: "rtl" }}
          className="text-center w-full mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">تعديل روابط التواصل الإجتماعى</h2>
          <p className="text-gray-600">
            قم بتحديث حسابات الوسائط الاجتماعية المرتبطة بموقعك.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          {socialContactInfoInputs.map((input, index) => (
            <div key={index} className="flex flex-col gap-3 items-start w-full">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
                {input.icon}
                <label className="mb-1 text-sm font-medium text-gray-700">
                  {input.label}
                </label>
              </div>

              <input
                type={input.type}
                name={input.name}
                value={accounts[input.name as keyof typeof data] || ""}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                className="input-style w-full"
              />
            </div>
          ))}

          <div className="flex items-center gap-2 pb-2 border-b border-gray-300 w-fit">
            <FaMapLocation className="text-green-400 size-6" />
            <p>نص العنوان</p>
          </div>
          <input
            type="text"
            name="address"
            onChange={handleInputChange}
            value={accounts?.address ?? ""}
            className="input-style"
          />

          <div className="text-center mt-6">
            <div className="flex items-center w-fit mx-auto gap-3">
              <motion.button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-bold w-fit mx-auto flex items-center justify-center rounded-lg hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {updateloading ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  "حفظ التغييرات"
                )}
              </motion.button>
              {/* <motion.button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-6 py-2 bg-green-600 text-white font-bold w-fit mx-auto flex items-center justify-center rounded-lg hover:bg-green-700 transition duration-300"
              >
                تعديل العنوان
              </motion.button> */}
            </div>
          </div>
        </form>
      </div>

      <MapSelector
        initialLocation={location ?? null}
        onClose={() => setShowMap(false)}
        setLocation={setLocation}
        showMap={showMap}
        locale="en"
      />
    </div>
  );
}
