"use client"

import React from "react"
import Image from "next/image"
import { useMediaQuery } from "@/components/use-media-query"

interface Card {
  suit: string;
  number: number;
  image: string;
  created_at: string;
}

interface GameCard {
  image: any;
}

function Game() {
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [showOverlay, setShowOverlay] = React.useState(false);

  const user = useAppSelector((state: RootState) => state.user);
  const game = useAppSelector((state: RootState) => state.game);

  const oponent_1 = game.oponents[0]
  const oponent_1_cards = game.oponent_cards ?? 0;
  const player_cards = game.hand_cards as Card[];
  const game_card: any = game.game_card;
  const played_cards = game.played_cards;

  const defaultAvatar = "http://127.0.0.1:5000/images/avatar/default.png";

  const getCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return "transform rotate-[-10deg] mt-[-4px] hover:mt-[-8px]";
      case 1:
        return "transform rotate-[-0deg] mx-[10px] mt-[-10px] hover:mt-[-14px] ";
      case 2:
        return "transform rotate-[10deg] mt-[-4px] hover:mt-[-8px]";
      default:
        return "";
    }
  };

  const getOponentCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return "transform rotate-[-10deg] mt-[-4px]";
      case 1:
        return "transform rotate-[-0deg] mx-[10px] mt-[-10px]";
      case 2:
        return "transform rotate-[10deg] mt-[-4px]";
      default:
        return "";
    }
  };

  const handleConection = async () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    socket?.emit("deal", { room: game.room });
  }

  const { getCards } = useGame();

  const handleDeal = async () => {
    try {
      await getCards();
    } catch (error: any) {
      console.log(error.response.data)
    }
  }

  React.useEffect(() => {
    socket?.connect();

    socket?.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket?.emit("join_room", { room: game.room });
    });

    socket?.on("welcome", () => {
      handleConection();
    });

    socket?.on("card_played", (data) => {
      dispatch(setPlayedCardsState(data))
    });

    socket?.on("game_ready", () => {
      handleDeal();
    });

    return () => {
    };
  }, []);

  // Función para manejar el clic en una carta
  const handleCardClick = (card: Card) => {
    socket?.emit("play_card", card, { room: game.room });
  };

  return (
    <React.Fragment>
      <div className="relative">
        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="text-white text-2xl">Empieza el juego</div>
          </div>
        )}
        {/* Área de la Mesa */}
        <div
          className="flex justify-center items-center w-full fixed top-[130px] left-0"
          style={{ height: 'calc(100vh - 220px)' }}
        >
          <div className={`${isDesktop ? 'bg-table' : 'bg-tablev'} w-full h-full`} />
        </div>

        {/* Contenido sobre la Mesa */}
        <div
          className="z-10 relative text-white flex flex-col justify-between h-full"
          style={{ height: 'calc(100vh - 160px)' }}
        >

          {/* Oponente */}
          <div className="flex justify-center">
            <div>
              <div className="mt-[-40px]">
                <div className="relative w-[100px] h-[90px] mt-8 flex justify-center items-center">
                  <div className="absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]" />
                  <Image src={oponent_1?.avatar} alt="avatar" width={70} height={70} className="absolute z-10" />
                  <div className="absolute z-20">
                    <Image src={images.overlay} alt="overlay" width={120} height={120} />
                  </div>
                </div>
                <div className="text-center text-white truncate max-w-[100px]">
                  @{oponent_1?.username}
                </div>
              </div>
            </div>

            <div className="flex flex-row ml-3">
              {Array.from({ length: oponent_1_cards }, (_, index) => (
                <div key={index} className={`${getOponentCardStyle(index)}`}>
                  <Image src={images.card_back} alt={`Carta ${index + 1}`} width={70} height={70} />
                </div>
              ))}

            </div>
          </div>

          {/* Elemento Central */}
          <div className="flex justify-center">
            <div>
              <div className="text-center text-white">
                <div className="flex flex-row">
                  <div>
                    <Image src={images.card_back} width={60} height={60} alt="" />
                  </div>

                  <div>
                    {game_card ? (
                      <Image src={game_card.image} alt="Carta del Juego" width={60} height={70} />
                    ) : (
                      <Image src={images.card_back} alt="Carta Oculta" width={60} height={70} />
                    )}
                  </div>
                </div>
              </div>


              {/*played cards*/}
              <div className="flex flex-row">
                {played_cards && played_cards.map((card: any, index: any) => (
                  <div key={index}>
                    <Image src={card.image} alt="" width={60} height={70} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Player */}
          <div className="flex justify-center mb-4">
            <div>
              <div className="">
                <div className="relative w-[100px] h-[90px] flex justify-center items-center">
                  <div className="absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]" />
                  <Image src={user?.avatar || defaultAvatar} alt="avatar" width={70} height={70} className="absolute z-10" />
                  <div className="absolute z-20">
                    <Image src={images.overlay} alt="overlay" width={120} height={120} />
                  </div>
                </div>
                <div className="text-center text-white truncate max-w-[100px]">
                  @{user.username}
                </div>
              </div>
            </div>

            <div className="flex flex-row ml-3">
              {player_cards && player_cards.map((card, index) => (
                <div
                  key={index}
                  className={`${getCardStyle(index)} cursor-pointer`}
                  onClick={() => handleCardClick(card)} // Añadido onClick para manejar el clic en la carta
                >
                  <Image src={card.image} width={70} height={70} alt={`Carta ${index + 1}`} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Game
