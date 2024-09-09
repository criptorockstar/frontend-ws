'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useMediaQuery } from '@/components/use-media-query'
import { RootState, useAppSelector } from '@/store/store'
import { useParams } from 'next/navigation'

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
  // Get roomName from the URL
  const { roomName } = useParams()

  // State manager for first render
  const isRunning = useRef(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showOverlay, setShowOverlay] = React.useState(false)

  const user = useAppSelector((state: RootState) => state.user)

  const [oponent, setOponent] = React.useState<Oponent>({
    username: '',
    avatar: '',
  })
  const [oponentCards, setOponentCards] = React.useState<number>(0)

  const [tableCards, setTableCards] = React.useState<Card[]>([])
  const [vida, setVida] = React.useState<Card>()

  const [playerCards, setPlayerCards] = React.useState<Card[]>([])

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

  // Función para manejar el clic en una carta
  const handleCardClick = (card: Card) => {}

  // Load users data when the component is mounted
  useEffect(() => {
    // Run only once
    if (isRunning.current) {
      return
    }

    const WS_HOST = process.env.NEXT_PUBLIC_WS_HOST
    const wsEndpoint = `${WS_HOST}/match/${roomName}/`

    const matchSocket = new WebSocket(wsEndpoint)

    // send username to the server after connection is open
    matchSocket.onopen = function (e) {
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
      console.log(data)

      if (data.type === 'usernames') {
        // Set oponent username
        const usernames = data.value
        for (const username of usernames) {
          if (username !== user.username) {
            setOponent({ username, avatar: '/avatar.png' })
          }
        }
      }
    }

    // dummy data
    setOponent({ username: 'Oponente', avatar: '/avatar.png' })
    setOponentCards(3)

    setPlayerCards([
      { suit: 'cups', number: 1, image: '/cards/1_cups.png' },
      { suit: 'cups', number: 2, image: '/cards/2_cups.png' },
      { suit: 'cups', number: 3, image: '/cards/3_cups.png' },
    ])
  }, [])

  return (
    <React.Fragment>
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
            className={`${isDesktop ? 'bg-table' : 'bg-tablev'} w-full h-full`}
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
              <div className='text-center text-white'>
                <div className='flex flex-row'>
                  <div>
                    <Image
                      src='/card_back.png'
                      width={60}
                      height={60}
                      alt=''
                    />
                  </div>

                  <div>
                    {vida ? (
                      <Image
                        src={vida.image}
                        alt='Carta del Juego'
                        width={60}
                        height={70}
                      />
                    ) : (
                      <Image
                        src='/card_back.png'
                        alt='Carta Oculta'
                        width={60}
                        height={70}
                      />
                    )}
                  </div>
                </div>
              </div>

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
    </React.Fragment>
  )
}
