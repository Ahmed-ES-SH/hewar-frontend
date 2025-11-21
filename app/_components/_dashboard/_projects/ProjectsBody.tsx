"use client";
import React, { useEffect, useState } from "react";
import ProjectCard, { ProjectType } from "./_projectCard/ProjectCard";
import ProjectsSidebar from "./ProjectsSidebar";
import { toast } from "sonner";
import PaginationCompoennt from "../../_global/Pagination";
import LoadingSpin from "../../_global/LoadingSpin";
import { instance } from "@/app/_helpers/axios";
import { Category } from "../_ProjectPage/type";

interface Props {
  data: ProjectType[];
  categories: Category[];
  pagination: {
    current_Page: number | string;
    last_Page: number | string;
  };
}

export default function ProjectsBody({ data, pagination, categories }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>(data ?? []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(pagination?.current_Page) || 1
  );
  const [lastPage, setLastPage] = useState(Number(pagination?.last_Page) || 1);
  const [useServerData, setUseServerData] = useState(true);

  // 🧭 التعامل مع تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      setUseServerData(false);
    }
  };

  // 🧠 جلب المشاريع من API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      scrollTo(0, 0);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        query: searchTerm,
        status: selectedStatus.join(","),
        categories: selectedCategories.join(","),
      });

      const response = await instance.get(`/projects?${params.toString()}`);
      if (response.status === 200) {
        setProjects(response.data.data);
        setCurrentPage(response.data.pagination.current_page);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error: any) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ المنطق الذكي للجلب:
   * - عند التغيير في البحث → تأخير نصف ثانية.
   * - عند التغيير في الفلاتر أو الصفحة → جلب فوري.
   */
  useEffect(() => {
    if (useServerData) return;

    let debounceTimer: NodeJS.Timeout | null = null;

    // إذا تغيّر البحث فقط → ننتظر نصف ثانية
    if (searchTerm) {
      debounceTimer = setTimeout(() => {
        fetchProjects();
      }, 500);
    } else {
      // أي تغيير آخر يتم فوراً
      fetchProjects();
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [
    searchTerm,
    selectedStatus,
    selectedCategories,
    currentPage,
    useServerData,
  ]);

  return (
    <div className="w-full flex items-start max-md:flex-col-reverse gap-3">
      <div className="lg:flex-1/2 max-lg:w-full">
        {projects && projects.length > 0 ? (
          <div className="min-h-screen  w-full">
            {loading ? (
              <LoadingSpin />
            ) : (
              <div className="w-full">
                <div className="grid xl:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project, index) => (
                    <ProjectCard
                      project={project}
                      key={`project-${index}`}
                      onDelete={() => {}}
                    />
                  ))}
                </div>

                {lastPage > 1 && (
                  <PaginationCompoennt
                    currentPage={currentPage}
                    totalPages={lastPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            لا توجد مشاريع متاحة حالياً
          </div>
        )}
      </div>

      <ProjectsSidebar
        categories={categories ?? []}
        selectedStatus={selectedStatus}
        selectedCategories={selectedCategories}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setUseServerData(false);
        }}
        onCategoryChange={(val) => {
          setSelectedCategories(val);
          setUseServerData(false);
        }}
        onSearch={(val) => {
          setSearchTerm(val);
          setUseServerData(false);
        }}
        searchTerm={searchTerm}
      />
    </div>
  );
}
