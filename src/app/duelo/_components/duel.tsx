"use client";

import React from "react"
import Duelmode from "./duelmode";
import DuelModeConfirm from "./duelmodeconfirm"
import MatchSingle from "./match-single"
import MatchDouble from "./match-double"
import MatchTriple from "./match-triple"
import ErrorQueue from "./error-queue"
import ErrorCredits from "./error-credits"
import { socket } from "@/socket";
import Cookies from "js-cookie";

import {
  RootState,
  useAppSelector,
} from "@/store";
import { useQueue, usePlayer } from "@/store/hooks";

const Duel = ({
  open,
  duelToggle,
}: any) => {

  //Async functions

  const handleChallengers = (data: any) => {
    setOponent(prevChallengers => {
      const newChallengers = data.challengers;

      // Filtrar los nuevos challengers que aún no están en el array actual
      const challengersToAdd = newChallengers.filter(
        (newChallenger: any) =>
          !prevChallengers.some(
            (challenger: any) => challenger.username === newChallenger.username
          )
      );

      // Filtrar los challengers que deben ser removidos
      const challengersToRemove = prevChallengers.filter(
        (prevChallenger: any) =>
          !newChallengers.some(
            (challenger: any) => challenger.username === prevChallenger.username
          )
      );

      // Si no hay cambios, retorna el array actual
      if (challengersToAdd.length === 0 && challengersToRemove.length === 0) {
        return prevChallengers;
      }

      // Actualizar el array con los nuevos challengers
      return [...prevChallengers, ...challengersToAdd].filter(
        challenger => !challengersToRemove.includes(challenger)
      );
    });
  };

  //Websockets
  React.useEffect(() => {
    socket?.connect();

    socket?.on("connect", () => {
      console.log("conecction")
    });

    socket?.on("disconnect", () => {
      handleDisconnect();
    })

    socket?.on("new_challenger", (data) => {
      handleChallengers(data);
    });

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('new_challenger');
    };
  });
  //\Websockets

  const handleDisconnect = () => {
    onDismiss();
  };

  // Hooks
  const { joinQueue, leaveQueue, loading } = useQueue();
  const { getProfile } = usePlayer();

  //Store
  const user = useAppSelector((state: RootState) => state.user);
  //\Store

  //States
  const [duelMode, setDuelMode] = React.useState<{ mode: string; credits: string } | null>(null);
  const [onQueue, setOnQueue] = React.useState(false);
  const [errors, setErrors] = React.useState<{ credits: string; queue: string; playing: string; } | null>(null);

  // Game related states
  const [oponent, setOponent] = React.useState<{ username: string; avatar: string }[]>([]);
  //\States

  //Functions
  const onDuelmode = (mode: any, credits: any) => {
    setDuelMode({ mode, credits });
  }

  // Confirmation
  const onCancel = () => {
    setDuelMode(null);
  };

  const onConfirm = async () => {
    try {
      // Join player in Queue
      await joinQueue(duelMode?.mode, duelMode?.credits);
      // Reload player data on store
      await getProfile();
      // Set queue state to true
      setOnQueue(true);

      // retrieve access token from cookie
      // const token = Cookies.get("access_token");
      // emit matchmaking event with cookie param
      // socket?.emit("matchmaking", { token })
    } catch (errors: any) {
      await getProfile();
      const {
        credits = "",
        queue = "",
        playing = ""
      } = errors.response?.data?.errors || {};
      setErrors({ credits, queue, playing });
    }


  };
  //\Confirmation

  //Dismiss
  const onDismiss = async () => {
    try {
      // Emit remove_from_queue event
      socket?.emit("remove_from_queue");
      // Disconnect the WebSocket
      socket?.disconnect();
      // Leave the queue
      await leaveQueue();
      // Reload player profile
      await getProfile();
      // Clear duel mode and queue state
      setDuelMode(null);
      setOnQueue(false);
    } catch (errors: any) {
      console.log(errors.response.data)
    }
  };
  //\Dismiss

  const onClear = () => {
    setDuelMode(null);
    setOnQueue(false);
    setErrors(null);
  };

  //\Functions

  return (
    <React.Fragment>
      <div className={`
        fixed inset-0 flex justify-center items-center
        transition-colors
        ${open ? "visible bg-black/40" : "invisible"}
      `}>
        <div className={`
        text-white transition-all
          flex flex-col relative z-50 w-full box-border outline-none 
          mx-1 my-1 sm:mx-6 sm:my-16 max-w-md rounded-large 
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
          ${!duelMode ? "bg-[transparent]" : "bg-[#9d6727] shadow-small"}
        `}
        >
          {/*Choose duel mode and bets*/}
          {!duelMode && (
            <Duelmode onMode={onDuelmode} duelToggle={duelToggle} />
          )}

          {/*Accept*/}
          {duelMode && !onQueue && !errors && (
            <DuelModeConfirm bet={duelMode.credits} onCancel={onCancel} onConfirm={onConfirm} loading={loading} />
          )}

          {/*Errors*/}
          {errors?.queue && (
            <ErrorQueue onClear={onClear} />
          )}

          {errors?.credits && (
            <ErrorCredits onClear={onClear} />
          )}
          {/*\Errors*/}

          {/*1 vs 1*/}
          {onQueue && duelMode?.mode === "1 vs 1" && (
            <MatchSingle player={user} oponent={oponent} onDismiss={onDismiss} />
          )}

          {/*2 vs 2*/}
          {onQueue && duelMode?.mode === "2 vs 2" && (
            <MatchDouble player={user} oponents={oponent} onDismiss={onDismiss} />
          )}

          {/*3 vs 3*/}
          {onQueue && duelMode?.mode === "3 vs 3" && (
            <MatchTriple player={user} oponents={oponent} onDismiss={onDismiss} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Duel
