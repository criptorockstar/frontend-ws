'use client'

import React, { use, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import * as fonts from '@/components/fonts'
import { useRouter } from 'next/navigation'
import LobbyUI from '@/components/lobby-ui'
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'

function Dashboard() {
  const router = useRouter()
  const isRunning = useRef(false)

  useEffect(() => {
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

      // if (data.room_name) {
      //     setTimeout(() => {
      //         window.location.href = `/pericon/match/${data.room_name}/`
      //     }, 2000)
      // }
    }

    // Catch errors
    socket.onclose = function (e) {
      console.log('Connection closed.')
    }

    socket.onerror = function (e) {
      console.log('Error connecting to the server.')
    }
  }, [])

  return (
    <React.Fragment>
      <div
        style={{ height: 'calc(90vh - 100px)' }}
        className='flex flex-wrap justify-center items-center'
      >
        <div className='flex flex-col items-center pb-2'>
          {/* Cuadrado 1 */}
          <div className='relative w-md h-auto pt-24 px-10 py-8 mb-[50px] backdrop-blur-xl bg-primary-200 rounded-[10px] border-secondary border-[3px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-100'>
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
          </div>
        </div>
        <LobbyUI />
      </div>
    </React.Fragment>
  )
}

export default Dashboard
