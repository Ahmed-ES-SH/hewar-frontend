"use client";
import React from "react";
import HeroBanner from "../../_global/_heroBanner/HeroBanner";
import { directionMap } from "@/app/constants/_website/Global";
import { useLocale } from "@/app/_hooks/useLocale";
import CenterBranch from "./CenterBranch";

export interface CenterBranchType {
  id: number;
  title: string;
  email: string;
  phone: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}

interface props {
  data: CenterBranchType[];
}

export default function CenterBranchesComponent({ data }: props) {
  const locale = useLocale();

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen flex flex-col gap-12"
    >
      {/* Header */}
      <HeroBanner imageSrc="/website/slide2.jpg" />

      {/* Main Content */}
      {data &&
        Array.isArray(data) &&
        data.length > 0 &&
        data.map((branch, index) => (
          <CenterBranch branch={branch} key={`branch-${index}`} />
        ))}
    </div>
  );
}
