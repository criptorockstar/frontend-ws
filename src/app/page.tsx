"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as fonts from "@/components/fonts";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <React.Fragment>
      <div className="absolute inset-6 bg-diablo mix-blend-soft-light opacity-20 z-[-1]"></div>

      <div className="flex flex-col items-center justify-center pb-2 relative z-10">
        <Image
          src="/goat.svg"
          width={230}
          height={230}
          alt=""
          className="w-[230px] h-[230px] xl:w-[350px] xl:h-[250px]"
        />
        <Image
          src="/brand.svg"
          alt=""
          width={130}
          height={130}
          className="w-[220px] xl:w-[280px] h-auto"
        />

        <div className="pt-2">
          <p className={`${fonts.angkor.className} text-white font-bowly text-[20px] leading-[22px] w-[320px] text-center`}>
            ¡Es hora de poner las cartas sobre la mesa!
          </p>
        </div>

        <div className="pt-6">
          <Button
            type="button"
            onClick={() => router.push("/lobby")}
            className={`${fonts.bowlbyOneSC.className} z-30 xl:w-[200px]  bg-gradient-to-tr from-yellow-950 to-yellow-700 px-6 text-white shadow-lg w-[120px] lg:w-[150px] rounded-xl`}>
            <span className="animate-blink">Jugar</span>
          </Button>
        </div>

        <div>
          <p className={`${fonts.angkor.className} text-white text-center mt-12 md:mt-6 text-[22px]`}>
            Redes sociales
          </p>

          <div className="flex justify-center mt-4">
            <div className="mx-4 md:mx-6 hover:cursor-pointer z-10">
              <Image width={40} height={40} src="/instagram.svg" alt="Instagram" />
            </div>

            <div className="mx-4 md:mx-6 hover:cursor-pointer z-10">
              <Image width={40} height={40} src="/facebook.svg" alt="Facebook" />
            </div>

            <div className="mx-4 md:mx-6 hover:cursor-pointer z-10">
              <Image width={40} height={40} src="/telegram.svg" alt="Telegram" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
