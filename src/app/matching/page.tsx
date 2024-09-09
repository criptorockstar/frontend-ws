'use client'

import React, { use, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as fonts from '@/components/fonts'
import { useDispatch, useSelector } from 'react-redux'
import { setUserState } from '@/store/slices/userSlice'
import { RootState } from '@/store/store'

import Image from 'next/image'
import LobbyUI from '@/components/lobby-ui'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

function Dashboard() {
  const router = useRouter()
  const isRunning = useRef(false)

  // Redux data
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  // Component state
  const [username, setUsername] = useState('')
  const [usernameSaved, setUsernameSaved] = useState(false)

  // Connext to game room and set username
  useEffect(() => {

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

    // Save username in redux
    if (username && usernameSaved) {
      dispatch(setUserState({ username }))


      // Run only once
      if (isRunning.current) {
        return
      }

      // Connect to the websocket
      const WS_HOST = process.env.NEXT_PUBLIC_WS_HOST
      const wsEndpoint = `${WS_HOST}/matchmaker/`
      const socket = new WebSocket(wsEndpoint)
      isRunning.current = true

      // Open connection
      socket.onopen = function (e) {
        // Show message when connection is open
        console.log('Connected to the server. Waiting for players...')
      }

      // Redirect to the match page when a room is created
      socket.onmessage = function (e) {
        const data = JSON.parse(e.data)
        const roomName = data['room_name']

        Swal.fire({
          title: 'Jugadores encontrados',
          text: 'Serás redirigido a la partida',
          icon: 'success',
          confirmButtonText: 'Ir a la partida',
        }).then((result: any) => {
          if (result.isConfirmed) {
            // Redirect to the match page with router
            const page = `/duelo/${roomName}/`
            router.push(page)
          }
        })
      }

      // Catch errors
      socket.onclose = function (e) {
        console.log('Connection closed.')
      }

      socket.onerror = function (e) {
        showError(
          'No se pudo conectar al servidor. Intente de nuevo más tarde.'
        )
      }

      socket.onclose = function (e) {
        showError(
          'Se ha perdido la conexión con el servidor. Intente de nuevo más tarde.'
        )
      }
    }
  }, [username, usernameSaved])

  useEffect(() => {}, [])

  return (
    <React.Fragment>
      <div
        style={{ height: 'calc(90vh - 100px)' }}
        className='flex flex-wrap justify-center items-center'
      >
        <div className='flex flex-col items-center pb-2'>
          {/* Cuadrado 1 */}
          <div className='relative w-md h-auto pt-24 px-10 py-8 mb-[50px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100'>
            {username && usernameSaved ? (
              // Loading spinner
              <>
                <Image
                  src='/spinner.svg'
                  alt=''
                  width={100}
                  height={100}
                  className='mt-[-130px]'
                />
                <div className='mt-5 flex justify-center'>
                  <p
                    className={`text-white text-[17px] xl:text-[22px] ${fonts.bowlbyOneSC.className}`}
                  >
                    Buscando jugadores
                  </p>
                </div>
                <div className='flex justify-center items-center'>
                  <p
                    className={`text-white text-left text-[12px] xl:text-[16px] ${fonts.almarai.className} pr-[4px] text-center`}
                  >
                    Espere un momento mientras buscamos jugadores para una
                    partida...
                  </p>
                </div>
              </>
            ) : (
              // Username input
              <>
                <Input
                  type='text'
                  placeholder='Nombre de usuario'
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className={`
                    text-white
                    placeholder:opacity-80
                  `}
                />
                <Button
                  variant='default'
                  size='default'
                  className={`
                  text-black
                    bg-yellow hover:bg-yellow
                    my-4 
                    px-6
                    py-2
                    text-lg 
                    opacity-100 hover:opacity-80
                    scale-100 hover:scale-95
                    duration-150
                    transition
                    rounded-xl
                    font-bold
                  `}
                  onClick={() => setUsernameSaved(true)}
                >
                  Buscar partida
                </Button>
              </>
            )}
          </div>
        </div>
        <LobbyUI />
      </div>
    </React.Fragment>
  )
}

export default Dashboard
