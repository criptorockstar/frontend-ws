"use client";

import React from "react";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid h-screen overflow-auto space-y-0">
      <div className="bg-goat absolute inset-0 z-0"></div>
      <div className="flex flex-col h-screen relative">
        {/* UI content */}
        <div className="relative z-10">
          <div className="flex justify-between w-full mt-5">
            <div className="mt-[5px] mb-4"></div>
            <div></div>
          </div>
          {/* Dynamic content */}
          <div className="flex items-center justify-center h-full">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
