"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaFolder,
  FaCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  icon_name: string;
  bg_color: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  categories: Category[];
  selectedStatus: string[];
  selectedCategories: number[];
  onStatusChange: (status: string[]) => void;
  onCategoryChange: (categoryIds: number[]) => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

const ProjectsSidebar = ({
  categories,
  selectedStatus,
  selectedCategories,
  onStatusChange,
  onCategoryChange,
  onSearch,
  searchTerm,
}: SidebarProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  const statusOptions = [
    { value: "draft", label: "مسودة", color: "bg-gray-400" },
    { value: "pending", label: "في انتظار المراجعة", color: "bg-yellow-400" },
    { value: "approved", label: "تمت الموافقة", color: "bg-blue-400" },
    { value: "in_progress", label: "قيد التنفيذ", color: "bg-orange-400" },
    { value: "completed", label: "مكتمل", color: "bg-green-400" },
    { value: "rejected", label: "مرفوض", color: "bg-red-400" },
    { value: "canceled", label: "ملغي", color: "bg-gray-600" },
  ];

  const handleStatusToggle = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];
    onStatusChange(newStatus);
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };

  const handleSelectAllStatus = () => {
    onStatusChange(statusOptions.map((option) => option.value));
  };

  const handleClearAllStatus = () => {
    onStatusChange([]);
  };

  const handleSelectAllCategories = () => {
    onCategoryChange(categories.map((cat) => cat.id));
  };

  const handleClearAllCategories = () => {
    onCategoryChange([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 max-md:w-full  shadow-md border rounded-xl  bg-white border-r border-gray-200 h-screen flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">تصفية المشاريع</h2>
        <p className="text-sm text-gray-600">
          استخدم الفلاتر للبحث في المشاريع
        </p>
      </div>

      {/* Search Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              <span>حالة المشروع</span>
              {isStatusOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 max-h-[250px] overflow-y-auto"
                >
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllStatus}
                      className="text-xs h-7"
                    >
                      اختر الكل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllStatus}
                      className="text-xs h-7"
                    >
                      إلغاء الكل
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <motion.label
                        key={status.value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes(status.value)}
                          onChange={() => handleStatusToggle(status.value)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <FaCircle className={`text-xs ${status.color}`} />
                        <span className="text-sm text-gray-700 flex-1">
                          {status.label}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          {selectedStatus.includes(status.value) ? "محدد" : ""}
                        </Badge>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              <span>الأقسام</span>
              {isCategoriesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 max-h-[250px] overflow-y-auto"
                >
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllCategories}
                      className="text-xs h-7"
                    >
                      اختر الكل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllCategories}
                      className="text-xs h-7"
                    >
                      إلغاء الكل
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {categories.map((category) => (
                      <motion.label
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: category.bg_color }}
                        >
                          <FaFolder />
                        </div>
                        <span className="text-sm text-gray-700 flex-1">
                          {category.title_ar}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          {selectedCategories.includes(category.id)
                            ? "محدد"
                            : ""}
                        </Badge>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>

      {/* Selected Filters Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm">
            الفلاتر المحددة:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedStatus.length > 0 && (
              <Badge variant="default" className="text-xs">
                {selectedStatus.length} حالة
              </Badge>
            )}
            {selectedCategories.length > 0 && (
              <Badge variant="default" className="text-xs">
                {selectedCategories.length} قسم
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="default" className="text-xs">
                بحث: {searchTerm}
              </Badge>
            )}
            {selectedStatus.length === 0 &&
              selectedCategories.length === 0 &&
              !searchTerm && (
                <span className="text-xs text-gray-500">
                  لا توجد فلاتر محددة
                </span>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsSidebar;
