"use client";

import React from "react";
// import CanvasBoard from "@/components/CanvasBoard";
import dynamic from "next/dynamic";

const CanvasBoard = dynamic(() => import("../../components/CanvasBoard"), {
  ssr: false, // <- disables server-side rendering
});

const page = () => {
  return (
    <div>
      <CanvasBoard />
    </div>
  );
};

export default page;
