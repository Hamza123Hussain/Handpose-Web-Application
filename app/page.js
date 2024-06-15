'use client'
import Image from 'next/image'
import * as fp from 'fingerpose'
import Victory from '../public/VICTORY.png'
import Thumbsup from '../public/THUMBS.png'
import * as handpose from '@tensorflow-models/handpose'
import * as tf from '@tensorflow/tfjs'
import { useRef } from 'react'
import Webcam from 'react-webcam'
import { drawHand } from '@/components/Utils'
export default function Home() {
  const webcamref = useRef(null)
  const canvasref = useRef(null)

  const runHandpose = async () => {
    const net = await handpose.load()
    console.log('modal loaded')
    setInterval(() => {
      Detect(net)
    }, 100)
  }
  runHandpose()

  const Detect = async (net) => {
    if (
      typeof webcamref.current !== 'undefined' &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      const video = webcamref.current.video
      const videoHeight = webcamref.current.video.videoHeight
      const videoWidth = webcamref.current.video.videoWidth

      webcamref.current.video.width = videoWidth
      webcamref.current.video.height = videoHeight

      canvasref.current.width = videoWidth
      canvasref.current.height = videoHeight

      const hand = await net.estimateHands(video)
      console.log(hand)

      const ctx = canvasref.current.getContext('2d')
      drawHand(hand, ctx)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Webcam
        ref={webcamref}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 0,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasref}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,

          textAlign: 'center',
          zIndex: 0,
          width: 640,
          height: 480,
        }}
      />
    </main>
  )
}
