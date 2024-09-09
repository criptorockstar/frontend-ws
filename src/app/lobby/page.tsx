"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as fonts from "@/components/fonts"
import { useRouter } from "next/navigation";
import LobbyUI from "@/components/lobby-ui";

function Dashboard() {
  const router = useRouter();
  const [oponent, setOponent] = useState<any>({
    "username": "",
    "avatar": "",
  });

  // Modal
  const [open, setOpen] = React.useState(false);
  const [entry, setEntry] = React.useState(false);
  const [onQueue, setOnQueue] = React.useState(false);
  const [errors, setErrors] = React.useState({
    "coins": "",
    "queue": "",
    "playing": ""
  });

  // Websockets
  useEffect(() => {
  }, []);

  const onDuelHandler = () => {
    setOpen(true);
  }

  const onAccept = async () => {
  };

  const onCancel = () => {
    setOpen(false)
    setErrors({
      coins: "",
      queue: "",
      playing: ""
    });
    setEntry(false)
  };

  const onDismiss = () => {
    console.log("dismiss")
  }

  return (
    <React.Fragment>
      <div
        style={{ height: "calc(90vh - 100px)" }}
        className="flex flex-wrap justify-center items-center"
      >
        <div className="flex flex-col items-center pb-2">
          {/* Cuadrado 1 */}
          <div
            onClick={onDuelHandler}
            className="relative w-[180px] h-[135px] xl:w-[240px] xl:h-[180px] mb-[50px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100"
          >
            <Image
              src="/duel.svg"
              alt=""
              width={100}
              height={100}
              className="mt-[-130px] absolute xl:mt-[-160px]"
            />
            <div className="mt-5 flex justify-center">
              <p
                className={`text-white text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
              >
                DUELO
              </p>
            </div>
            <div className="flex justify-center items-center">
              <p
                className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
              >
                Juega un duelo contra otros jugadores por monedas
              </p>
            </div>
          </div>

          {/* Cuadrado 2 */}
          <div className="relative w-[180px] h-[135px] xl:w-[240px] xl:h-[180px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100">
            <Image
              src="/tournament.svg"
              alt=""
              width={100}
              height={100}
              className="mt-[-130px] absolute xl:mt-[-160px]"
            />
            <div className="mt-5 flex justify-center">
              <p
                className={`text-white font-angkor text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
              >
                TORNEOS
              </p>
            </div>
            <div className="flex justify-center items-center">
              <p
                className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
              >
                Pon a prueba tus habilidades en los torneos semanales.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center ml-10 pb-2">
          {/* Cuadrado 3 */}
          <div
            className="relative w-[180px] h-[135px] xl:w-[240px] xl:h-[180px] mb-[50px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100"
          >
            <Image
              src="/room.svg"
              alt=""
              width={100}
              height={100}
              className="mt-[-130px] absolute xl:mt-[-160px]"
            />
            <div className="mt-5 flex justify-center">
              <p
                className={`text-white font-angkor text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
              >
                CREAR SALA
              </p>
            </div>
            <div className="flex justify-center items-center">
              <p
                className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
              >
                Crea una sala para competir por la victoria con amigos
              </p>
            </div>
          </div>

          {/* Cuadrado 4 */}
          <div className="relative w-[180px] h-[135px] xl:w-[240px] xl:h-[180px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100">
            <Image
              src="/join.svg"
              alt=""
              width={100}
              height={100}
              className="mt-[-130px] absolute xl:mt-[-160px]"
            />
            <div className="mt-5 flex justify-center">
              <p
                className={`text-white font-angkor text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
              >
                UNIRSE
              </p>
            </div>
            <div className="flex justify-center items-center">
              <p
                className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
              >
                Únete a una partida amistosa ya creada por otra persona
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
