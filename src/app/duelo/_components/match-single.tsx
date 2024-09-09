"use client";

import React from "react";
import { Button, Divider } from "@nextui-org/react";
import Image from "next/image";
import { images, fonts } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import BeatLoader from "react-spinners/BeatLoader"

const MatchSingle = ({
  player,
  oponent,
  onDismiss,
}: any) => {
  console.log(oponent)
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center w-full relative">
        <div className={`
            w-[200px] mt-[-6px] h-[80px] 
            flex flex-col items-center justify-center p-4 z-20 
            relative
          `}>
          <div className={`text-white mt-2 ${fonts.bowlbyOneSC.className} text-shadow text-[18px]`}>
            Duelo
          </div>
          <Divider className="my-1 w-full" />
          <div className={`${fonts.bowlbyOneSC.className}`}>
            1 vs 1
          </div>
        </div>
      </div>

      <div className={`${fonts.angkor.className} flex flex-col items-center justify-center gap-3 px-6 pb-3`}>
        <div className="relative flex justify-center">
          <div className="w-[300px] flex justify-between items-center">
            {/*Player*/}
            <div>
              <div className="relative w-[100px] h-[90px] mt-8 flex justify-center items-center">
                {/*Avatar*/}
                <div className="absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]"></div>
                <Image src={player?.avatar} alt="avatar" width={70} height={70} className="absolute z-10" />
                {/*\Avatar*/}

                {/*Overlay*/}
                <div className="absolute z-20">
                  <Image src={images.overlay} alt="overlay" width={120} height={120} />
                </div>
                {/*\Overlay*/}

                {/*Level bagde*/}
                <div className="absolute z-20 top-[-24px] left-[-14px]">
                  <Image src={images.begineerBadge} alt="overlay" width={50} height={50} />
                </div>
                {/*\Level badge*/}
              </div>

              {/*Username*/}
              <div className="text-center text-white truncate max-w-[100px]">
                @{player?.username}
              </div>
              {/*Username*/}
            </div>
            {/*\Player*/}

            {/* VS */}
            <div className={`
              absolute w-full h-[90px] mt-8 flex 
              justify-center items-center
              ${oponent[0]?.username ? 'vs-transition filter-none' : 'filter grayscale'}
            `}>
              <div className="flex justify-center items-center w-full h-full">
                <Image
                  width={68} height={121}
                  src={images.vs} alt=""
                  className={`${oponent[0]?.username ? 'opacity-100' : 'opacity-20'}`} />
              </div>
            </div>
            {/* \VS */}

            {/*Oponent*/}
            {oponent[0]?.username ? (
              <div>
                <div className="relative w-[100px] h-[90px] mt-8 flex justify-center items-center">
                  {/*Avatar*/}
                  <div className="absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]"></div>
                  <Image src={oponent[0]?.avatar} alt="avatar" width={70} height={70} className="absolute z-10" />
                  {/*\Avatar*/}

                  {/*Overlay*/}
                  <div className="absolute z-20">
                    <Image src={images.overlay} alt="overlay" width={120} height={120} />
                  </div>
                  {/*\Overlay*/}

                  {/*Level bagde*/}
                  <div className="absolute z-20 top-[-24px] left-[-14px]">
                    <Image src={images.begineerBadge} alt="overlay" width={50} height={50} />
                  </div>
                  {/*\Level badge*/}
                </div>
                {/*Username*/}
                <div className="text-center text-white truncate max-w-[100px]">
                  @{oponent[0]?.username}
                </div>
                {/*Username*/}
              </div>
            ) :
              (
                <div>
                  <div className="relative w-[100px] h-[90px] mt-8 flex justify-center items-center"></div>
                  <div className="mt-[-80px] ml-[15px]">
                    <BeatLoader color="#ffffff" />
                  </div>
                </div>
              )}
            {/*\Oponent*/}
          </div>
        </div>
      </div>

      <div className="relative flex flex-row gap-2 px-6 py-4 justify-center">
        <Button onClick={onDismiss} className="bg-[transparent] hover:bg-red-500">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={faTimesCircle} size="2x" className="text-white mr-1" />
            <span className={`${fonts.angkor.className} text-white mt-[3px]`}>Cancelar</span>
          </div>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default MatchSingle;
