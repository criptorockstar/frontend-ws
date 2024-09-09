"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { images, fonts } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const DuelModeConfirm = ({
  bet,
  onCancel,
  onConfirm,
  loading,
}: any) => {
  return (
    <React.Fragment>
      <div className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1">
        <div className="flex justify-center items-center w-full">
          <Image src={images.coinsheader} alt="coin" width={120} height={120} className="mt-[-70px]" />
        </div>
      </div>

      <div className={`${fonts.angkor.className} flex flex-col items-center justify-center gap-3 px-6 py-2`}>
        <div className="font-bold text-white flex flex-row">
          <p className="mr-[10px]">La apuesta fijada es:</p>
          {bet}
          <span className="mt-[3px] ml-[4px]"><Image src={images.coin} alt="coin" width={20} height={20} /></span>
        </div>
        <p className="text-center font-bold text-white">¿Desea continuar?</p>
      </div>

      {!loading && (
        <div className="relative flex flex-row gap-2 px-6 py-4 justify-center">
          <Button onClick={onCancel} color="danger" className="pr-6">
            <div className="flex flex-row items-center">
              <FontAwesomeIcon icon={faTimesCircle} size="2x" className="text-red-500 mr-1" />
              <span className={`${fonts.angkor.className}`}>Cancelar</span>
            </div>
          </Button>

          <Button onClick={onConfirm} color="primary" className="pr-6">
            <FontAwesomeIcon icon={faThumbsUp} size="2x" className="text-green-500 mr-1" />
            <span className={`${fonts.angkor.className}`}>Aceptar</span>
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default DuelModeConfirm;
