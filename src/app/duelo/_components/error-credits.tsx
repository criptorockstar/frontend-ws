"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { images, fonts } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorCredits = ({
  onClear
}: any) => {
  return (
    <React.Fragment>
      <div className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1">
        <div className="flex justify-center items-center w-full">
          <Image src={images.coinsheader} alt="coin" width={120} height={120} className="mt-[-70px] filter grayscale" />
        </div>
      </div>

      <div className={`${fonts.bowlbyOneSC.className} flex flex-col items-center justify-center gap-3 px-6 py-2`}>
        <div className="font-bold text-white flex flex-row">
          <p>No tienes suficientes créditos</p>
        </div>
      </div>

      <div className="relative flex flex-row gap-2 px-6 py-4 justify-center">
        <Button onClick={onClear} color="danger" className="pr-6">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={faTimesCircle} size="2x" className="text-red-500 mr-1" />
            <span className={`${fonts.angkor.className}`}>Cancelar</span>
          </div>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ErrorCredits
