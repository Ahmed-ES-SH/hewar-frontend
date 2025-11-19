"use client";
import { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import LoadingPage from "../_global/LoadingPage";
import { useAppDispatch } from "@/app/redux/hooks";
import { setLogoSrc, setNavText } from "@/app/redux/slices/variablesSlice";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const res = await instance.get("/variables-data?id=5&limit=5"); // استبدل بالـ API الفعلي
        const data = res.data.data;
        if (data) {
          dispatch(setLogoSrc(data.column_1));
          dispatch(setNavText(data.column_4));
          setLogo(data.column_1);
          document.documentElement.style.setProperty(
            "--primary-color",
            data.column_2
          );
          document.documentElement.style.setProperty(
            "--light-primary-color",
            data.column_3
          );
        }
      } catch (err) {
        console.error("Failed to load primary color", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColor();
  }, []);

  if (loading) return <LoadingPage logo={logo} />;

  return <>{children}</>;
}
