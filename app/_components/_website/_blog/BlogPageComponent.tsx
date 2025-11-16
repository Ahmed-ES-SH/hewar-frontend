"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/app/_hooks/useLocale";
import { BlogCard } from "./BlogCard";
import { BlogSidebar } from "./BlogSidebar";
import HeroBanner from "../../_global/_heroBanner/HeroBanner";
import { ArticleType } from "../../_dashboard/_articles/types";
import { useSearchParams } from "next/navigation";
import { CiNoWaitingSign } from "react-icons/ci";
import { ImSpinner8 } from "react-icons/im";
import PaginationCompoennt from "../../_global/Pagination";
import { instance } from "@/app/_helpers/axios";
import CategoryHeader from "../_news/CategoryHeader";
import { Category } from "../../_dashboard/_ProjectPage/type";

interface props {
  articles: ArticleType[];
  categories: Category[];
  tags: Tag[];
  categoryTitle?: string;
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export default function BlogPageComponent({
  categories,
  articles: initialArticles,
  tags,
  categoryTitle,
  pagination: initialPagination,
}: props) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(`query`); // string | null

  // state initialized from SSR props
  const [articles, setArticles] = useState<ArticleType[]>(
    initialArticles ?? []
  );
  const [currentPage, setCurrentPage] = useState(
    initialPagination?.current_page ?? 1
  );
  const [lastPage, setLastPage] = useState(initialPagination?.last_page ?? 1);
  const [loading, setLoading] = useState(false);

  // optional: keep refs to initial data for quick restore if needed
  const initialArticlesRef = useRef(initialArticles ?? []);
  const initialPaginationRef = useRef(
    initialPagination ?? { current_page: 1, last_page: 1 }
  );

  // fetcher
  const fetchData = async (page: number, query: string | null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (page > 1) params.append("page", String(page));
      if (query) params.append("query", query);

      const response = await instance.get(
        `/public-articles?${params.toString()}`
      );

      if (response.status === 200) {
        setArticles(response.data.data);
        setCurrentPage(response.data.pagination.current_page);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 1) Only run search fetch if there is an actual query value
  // ---------------------------
  useEffect(() => {
    // do nothing when search param absent or empty (preserve SSR data)
    if (!searchQuery || searchQuery.trim() === "") {
      // if user cleared query and we want to restore initial SSR page & data:
      // restore initial only if different (optional)
      if (
        currentPage !== initialPaginationRef.current.current_page ||
        articles !== initialArticlesRef.current
      ) {
        setArticles(initialArticlesRef.current);
        setLastPage(initialPaginationRef.current.last_page);
        setCurrentPage(initialPaginationRef.current.current_page);
      }
      return;
    }

    // if there's a query -> reset to page 1 then fetch search results
    setCurrentPage(1);
    fetchData(1, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // ---------------------------
  // 2) Page change: only fetch if it's different from initial page OR there's an active search
  // ---------------------------
  useEffect(() => {
    const isInitialPage =
      currentPage === initialPaginationRef.current.current_page;
    const hasSearch = !!(searchQuery && searchQuery.trim() !== "");

    // If no search and we are on initial page -> keep SSR data, no fetch
    if (!hasSearch && isInitialPage) {
      // ensure state matches initial SSR (safe guard)
      setArticles(initialArticlesRef.current);
      setLastPage(initialPaginationRef.current.last_page);
      return;
    }

    // otherwise fetch (either search active, or navigating to a different page)
    fetchData(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // page change handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage && !loading) {
      setCurrentPage(newPage);
    }
  };

  // ... rendering (kept same) ...
  const renderLoadingUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        <ImSpinner8 className="w-12 h-12" />
      </motion.div>
      <p className="text-lg text-muted-foreground">
        {locale === "en" ? "Loading articles..." : "جاري تحميل المقالات..."}
      </p>
    </motion.div>
  );

  const renderContent = () => {
    // إذا كان التحميل جارياً ولا توجد مقالات حالية، نعرض واجهة التحميل الكاملة
    if (loading && articles.length === 0) {
      return renderLoadingUI();
    }

    // إذا لم يكن هناك تحميل وليس هناك مقالات، نعرض رسالة عدم العثور
    if (!articles || articles.length == 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-[80vh] text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <CiNoWaitingSign className="lg:size-32 size-20 text-foreground" />
            <p className="text-lg text-muted-foreground mb-2">
              {locale === "en"
                ? "No articles found"
                : "لم يتم العثور على مقالات"}
            </p>
            <p className="text-sm text-muted-foreground">
              {locale === "en"
                ? "Try adjusting your filters"
                : "حاول تعديل المرشحات الخاصة بك"}
            </p>
          </div>
        </motion.div>
      );
    }

    // إذا كان هناك مقالات، نعرضها مع إمكانية وجود مؤشر تحميل (إذا كان التحميل جارياً) دون حجب القائمة
    return (
      <>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ImSpinner8 className="w-4 h-4 text-blue-600" />
              </motion.div>
              <span className="text-blue-600 text-sm">
                {locale === "en" ? "Updating..." : "جاري التحديث..."}
              </span>
            </div>
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BlogCard article={article} index={index} />
            </motion.div>
          ))}
        </div>

        <PaginationCompoennt
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  console.log(articles);

  return (
    <main className="min-h-screen bg-background">
      <HeroBanner imageSrc="/website/slide1.jpg" />
      <div className="c-container mx-auto px-4 py-12">
        {categoryTitle && (
          <CategoryHeader
            targetPage="blog"
            categoryTitle={categoryTitle ?? ""}
          />
        )}
        <div
          className={`grid grid-cols-1 lg:grid-cols-4 relative h-full gap-8 ${
            locale === "ar" ? "lg:grid-flow-dense" : ""
          }`}
        >
          <div className={`lg:col-span-1 lg:sticky lg:top-24 lg:left-0`}>
            <BlogSidebar
              recentArticles={articles.slice(0, 4) ?? []}
              categories={categories}
              tags={tags}
            />
          </div>

          <div className="lg:col-span-3 min-h-screen">{renderContent()}</div>
        </div>
      </div>
    </main>
  );
}
