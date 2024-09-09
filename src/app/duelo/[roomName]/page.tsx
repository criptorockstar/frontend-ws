'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/components/use-media-query'
import { RootState, useAppSelector } from '@/store/store'
import { useParams } from 'next/navigation'
import { table } from 'console'

import Image from 'next/image'
import Timer from "@/components/timer"
import Stone from "@/components/stone-meter"

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

// Types
interface Card {
  suit: string
  number: number
  image: string
}

interface Oponent {
  username: string
  avatar: string
}

interface GameCard {
  image: any
}

export default function Duel() {
  const [matchSocket, setMatchSocket] = useState<WebSocket | null>(null)

  const router = useRouter()

  // Get roomName from the URL
  const { roomName } = useParams()

  // Game state
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [points, setPoints] = React.useState<number>(0)

  // Players
  const user = useAppSelector((state: RootState) => state.user)
  const [oponent, setOponent] = React.useState<Oponent>({
  username: '',
    avatar: '',
  })
  
  // Cards
  const [tableCards, setTableCards] = React.useState<Card[]>([])
  const [playerCards, setPlayerCards] = React.useState<Card[]>([])
  const [oponentCards, setOponentCards] = React.useState<number>(0)

  // Styles for cards
  const playerCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'transform rotate-[-10deg] mt-[-4px] hover:mt-[-8px]'
      case 1:
        return 'transform rotate-[-0deg] mx-[10px] mt-[-10px] hover:mt-[-14px] '
      case 2:
        return 'transform rotate-[10deg] mt-[-4px] hover:mt-[-8px]'
      default:
        return ''
    }
  }

  const oponentCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'transform rotate-[-10deg] mt-[-4px]'
      case 1:
        return 'transform rotate-[-0deg] mx-[10px] mt-[-10px]'
      case 2:
        return 'transform rotate-[10deg] mt-[-4px]'
      default:
        return ''
    }
  }

  // Event handlers

  const handleCardClick = (card: Card) => {
    // Submit card to ws when clicked
    const cardStr = `${card.number} ${card.suit}`
    if (matchSocket) {
      matchSocket.send(
        JSON.stringify({
          type: 'use card',
          value: cardStr,
        })
      )
    }
  }

  // Lifecycle

  useEffect(() => {
    // App setup

    // Setup WS
    const WS_HOST = process.env.NEXT_PUBLIC_WS_HOST
    const wsEndpoint = `${WS_HOST}/match/${roomName}/`
    const newSocket = new WebSocket(wsEndpoint)
    setMatchSocket(newSocket)

    // dummy data
    setOponent({ username: 'Oponente', avatar: '/avatar.png' })
    setOponentCards(3)
  }, [])

  useEffect(() => {
    // Websocket setup

    // Get card data fvrom text like: '1 hearts'
    function getCardData(card: string): Card {
      const cardParts = card.split(' ')
      const cardNumber = parseInt(cardParts[0])
      const cardSuit = cardParts[1]
      const cardImage = `/cards/${cardNumber}_${cardSuit}.png`
      return { suit: cardSuit, number: cardNumber, image: cardImage }
    }

    // Show error with sweetalert
    function showError(message: string) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Ir a la pantalla de inicio',
      }).then((result: any) => {
        if (result.isConfirmed) {
          // Redirect to the match page with router
          const page = `/`
          router.push(page)
        }
      })
    }

    function showWinner(winner: string) {
      let mainText = "¡Ganaste la ronda!"
      if (winner === "draw") {
        mainText = "¡Empate!"
      } else if (winner !== user.username) {
        mainText = "¡Perdiste la ronda!"
      }

      Swal.fire({
        title: mainText,
        icon: winner === user.username ? 'success' : 'warning',
        confirmButtonText: 'Siguiente ronda',
      }).then((result: any) => {
        if (result.isConfirmed) {
          // Redirect to the match page with router
          const page = `/`
          router.push(page)
        }
      })
    }

    // send username to the server after connection is open
    if (matchSocket) {
      matchSocket.onopen = function (e) {
        // Send username only once
        matchSocket.send(
          JSON.stringify({
            type: 'username',
            value: user.username,
          })
        )
      }

      // Get messages from the server
      matchSocket.onmessage = function (e) {
        const data = JSON.parse(e.data)
        // console.log(data)

        if (data.type === 'usernames') {
          // Set oponent username
          const usernames = data.value
          for (const username of usernames) {
            if (username !== user.username) {
              setOponent({ username, avatar: '/avatar.png' })
            }
          }
        } else if (data.type === 'round cards') {
          // // Delete old cards
          // setPlayerCards([])

          // render user cards
          const roundCards = data.value
          for (const card of roundCards) {
            const cardData = getCardData(card)
            setPlayerCards((prev) => [
              ...prev,
              {
                suit: cardData.suit,
                number: cardData.number,
                image: cardData.image,
              },
            ])
          }
        } else if (data.type === 'middle card') {
          const middileCard = data.value
          const cardData = getCardData(middileCard)
          setTableCards((prev) => [
            {
              suit: cardData.suit,
              number: cardData.number,
              image: cardData.image,
            },
          ])
        } else if (data.type === 'error') {
          // Render errores with sweetalert
          showError(data.value)
        } else if (data.type === 'round played cards') {
          for (const cardItem of data.value) {
            const player = cardItem.player
            const card = cardItem.card

            // Render cards in board
            const cardData = getCardData(card)
            setTableCards((prev) => [
              ...prev,
              {
                suit: cardData.suit,
                number: cardData.number,
                image: cardData.image,
              },
            ])

            console.log({ player, card })

            if (player === user.username) {
              // Remove card from player
              setPlayerCards((prevPlayerCards) => {
                // Filter out the card to be removed
                const newPlayerCards = prevPlayerCards.filter(
                  (playerCard) => playerCard.image !== cardData.image
                )
                console.log({ newPlayerCards })
                return newPlayerCards
              })
            } else {
              // Reduce oponent cards
              setOponentCards((prev) => prev - 1)
            }
          }
        } else if (data.type === 'round winner') {
          setTimeout(() => {
            // Reset table cards
            setTableCards([])

            // Show winner with alert
            showWinner(data.value)
          }, 1500)
        } else if (data.type === 'points') {
          // Update player points
          for (const pointsData of data.value) {
            if (pointsData.player === user.username) {
              setPoints(pointsData.points)
            }
          }
        }
      }

      matchSocket.onclose = function (e) {
        showError('Se perdió la conexión con el servidor')
      }
    }
  }, [matchSocket])

  // Monitoring
  useEffect(() => {
    console.log({ tableCards })
  }, [tableCards])

  useEffect(() => {
    console.log({ playerCards })
  }, [playerCards])

  return (
    <main className='grid h-screen overflow-auto space-y-0'>
      <div className='bg-goat absolute inset-0 z-0'></div>
      <div className='flex flex-col h-screen relative'>
        {/* UI content */}
        <div className='relative z-10'>
          <div className='flex justify-between w-full mt-5'>
            <div className='mt-[5px] mb-4'>
              <Timer timer={'30:00'} />
            </div>
            <div>
              <Stone stones={points} />
            </div>
          </div>
          {/* Dynamic content */}
          <div className='flex items-center justify-center h-full'>
            <div className='relative'>
              {showOverlay && (
                <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
                  <div className='text-white text-2xl'>Empieza el juego</div>
                </div>
              )}
              {/* Área de la Mesa */}
              <div
                className='flex justify-center items-center w-full fixed top-[130px] left-0'
                style={{ height: 'calc(100vh - 220px)' }}
              >
                <div
                  className={`${
                    isDesktop ? 'bg-table' : 'bg-tablev'
                  } w-full h-full`}
                />
              </div>

              {/* Contenido sobre la Mesa */}
              <div
                className='z-10 relative text-white flex flex-col justify-between h-full'
                style={{ height: 'calc(100vh - 160px)' }}
              >
                {/* Oponente */}
                <div className='flex justify-center'>
                  <div>
                    <div className='mt-[-40px]'>
                      <div className='relative w-[100px] h-[90px] mt-8 flex justify-center items-center'>
                        <div className='absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]' />
                        <Image
                          src={oponent.avatar}
                          alt='avatar'
                          width={70}
                          height={70}
                          className='absolute z-10'
                        />
                        <div className='absolute z-20'>
                          <Image
                            src='/overlay.png'
                            alt='overlay'
                            width={120}
                            height={120}
                          />
                        </div>
                      </div>
                      <div className='text-center text-white truncate max-w-[100px]'>
                        @{oponent.username}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-row ml-3'>
                    {Array.from({ length: oponentCards }, (_, index) => (
                      <div
                        key={index}
                        className={`${oponentCardStyle(index)}`}
                      >
                        <Image
                          src='/card_back.png'
                          alt={`Carta ${index + 1}`}
                          width={70}
                          height={70}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elemento Central */}
                <div className='flex justify-center'>
                  <div>
                    {/* <div className='text-center text-white'>
                <div className='flex flex-row'>
                  <div>
                    <Image
                      src='/card_back.png'
                      width={60}
                      height={60}
                      alt=''
                    />
                  </div>
                </div>
              </div> */}

                    {/*table cards*/}
                    <div className='flex flex-row'>
                      {tableCards &&
                        tableCards.map((card: any, index: any) => (
                          <div key={index}>
                            <Image
                              src={card.image}
                              alt=''
                              width={60}
                              height={70}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Player */}
                <div className='flex justify-center mb-4'>
                  <div>
                    <div className=''>
                      <div className='relative w-[100px] h-[90px] flex justify-center items-center'>
                        <div className='absolute inset-0 bg-white z-0 w-[82px] h-[90px] ml-[10px]' />
                        <Image
                          src={'/avatar.png'}
                          alt='avatar'
                          width={70}
                          height={70}
                          className='absolute z-10'
                        />
                        <div className='absolute z-20'>
                          <Image
                            src='/overlay.png'
                            alt='overlay'
                            width={120}
                            height={120}
                          />
                        </div>
                      </div>
                      <div className='text-center text-white truncate max-w-[100px]'>
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-row ml-3'>
                    {playerCards &&
                      playerCards.map((card, index) => (
                        <div
                          key={index}
                          className={`${playerCardStyle(index)} cursor-pointer`}
                          onClick={() => handleCardClick(card)} // Añadido onClick para manejar el clic en la carta
                        >
                          <Image
                            src={card.image}
                            width={70}
                            height={70}
                            alt={`Carta ${index + 1}`}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
