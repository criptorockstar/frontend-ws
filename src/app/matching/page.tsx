"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import * as fonts from "@/components/fonts"
import { useRouter } from "next/navigation";
import LobbyUI from "@/components/lobby-ui";

function Dashboard() {

  useEffect(() => {

  }, []);
  
  return (
    <React.Fragment>
      <div
        style={{ height: "calc(90vh - 100px)" }}
        className="flex flex-wrap justify-center items-center"
      >
        <div className="flex flex-col items-center pb-2">
          {/* Cuadrado 1 */}
          <div
            className="relative w-md h-auto pt-24 px-10 py-8 mb-[50px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100"
          >
            <Image
              src="/spinner.svg"
              alt=""
              width={100}
              height={100}
              className="mt-[-130px]"
            />
            <div className="mt-5 flex justify-center">
              <p
                className={`text-white text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
              >
                Buscando jugadores
              </p>
            </div>
            <div className="flex justify-center items-center">
              <p
                className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
              >
                Espere un momento mientras buscamos jugadores para una partida...
              </p>
            </div>
          </div>
        </div>
        <LobbyUI />
      </div>

    </React.Fragment >
  );
}

export default Dashboard;
