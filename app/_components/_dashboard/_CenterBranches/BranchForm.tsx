"use client";
import React, { useState } from "react";
import { MapModal } from "./MapModal";
import { FiMapPin } from "react-icons/fi";
import { Branch, Location } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  initial?: Partial<Branch>;
  onCancel: () => void;
  formLoading: boolean;
  onSubmit: (payload: {
    title: string;
    email: string;
    phone: string;
    location: Location;
  }) => Promise<void> | void;
};

export const BranchForm: React.FC<Props> = ({
  initial = {},
  onCancel,
  onSubmit,
  formLoading,
}) => {
  const [title, setTitle] = useState(initial.title ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [location, setLocation] = useState<Location>(
    initial.location ?? { lat: 34.8021, lng: 38.9968, address: "سوريا" }
  );
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email";
    if (!phone) e.phone = "Phone is required";
    if (!location?.address) e.location = "Pick location";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ title, email, phone, location });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الخاص بالفرع
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="الاسم الخاص بالفرع ..."
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الرسمى
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="branch@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="01000000001"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الموقع
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                readOnly
                value={location.address || `${location.lat}, ${location.lng}`}
                className={errors.location ? "border-red-500" : ""}
                placeholder="Select location on map"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMap(true)}
              className="whitespace-nowrap"
            >
              <FiMapPin className="inline mr-2" /> Pick on map
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading
              ? "حفظ..."
              : initial.id
              ? "تحديث بيانات الفرع"
              : "انشاء فرع"}
          </Button>
        </div>
      </form>

      {/* Map Modal - Only renders when showMap is true */}
      <div className="fixed">
        <MapModal
          show={showMap}
          onClose={() => setShowMap(false)}
          location={location}
          setLocation={handleLocationChange}
        />
      </div>
    </>
  );
};
