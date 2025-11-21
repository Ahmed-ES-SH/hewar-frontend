import HelpSectionDash from "@/app/_components/_dashboard/_homePage/_helpSection/HelpSectionDash";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function HelpDashSection() {
  const data = await FetchData(`/variables-data?id=3&limit=5`, false);

  const { column_1, column_2, column_3, column_4 } = await data;

  return (
    <HelpSectionDash
      headData={column_1}
      stats={column_2}
      imageSrc={column_3}
      VideoSrc={column_4}
    />
  );
}
