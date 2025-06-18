"use client";
import { DBTrack } from "../../../lib/models";
import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import { BsZoomIn, BsZoomOut, BsPlayFill } from "react-icons/bs"
import config from '../../../../morg_config/config.json';

export default function AudioPlayer({selectedTrack}:{selectedTrack:DBTrack|null}){
    const library_root: string = config.library_root;
    const waveformRef = useRef<HTMLDivElement | null>(null)
    const waveSurferRef = useRef<WaveSurfer | null>(null)
    const [zoomLevel, setZoomLevel] = useState(0)

    const isReadyRef = useRef(false);
    useEffect(() => {
    if (!waveformRef.current) return

    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#332f33",
      progressColor: "#de23c8",
      height: "auto",
      barWidth: 2,
      cursorWidth: 1,
      plugins: [
        Hover.create({
          lineColor: '#999',
          lineWidth: 1,
          labelBackground: '#222',
          labelColor: '#fff',
          labelSize: '12px'
        })
      ]
    })

    waveSurferRef.current = waveSurfer
    isReadyRef.current = true;

    const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
        e.preventDefault() // prevent page scrolling
        waveSurfer.playPause()
        }
    } 
    // Enable zoom on scroll wheel
    const handleWheel = (e: WheelEvent) => {
      if (waveformRef.current?.contains(e.target as Node)) {
        e.preventDefault()
        const delta = Math.sign(e.deltaY)
        setZoomLevel(prev => {
          const newZoom = Math.max(0, prev - delta * 10)
          waveSurfer.zoom(newZoom)
          return newZoom
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('wheel', handleWheel)
    try {
        // Abort any ongoing operations before destroy
        waveSurferRef.current?.stop()
        waveSurferRef.current?.empty()
        waveSurferRef.current?.destroy()
    } catch (err) {
        console.warn("Error during WaveSurfer cleanup:", err)
    }

        waveSurferRef.current = null
    }
  }, [])

    

    useEffect(() => {
    if (!selectedTrack || !waveSurferRef.current || !isReadyRef) return
    
    const fullPath = `${selectedTrack.folder}${selectedTrack.filename}`
    const encondedPath = encodeURIComponent(fullPath)
    const audioUrl = `/api/track?path=${encondedPath}`
    console.log(`audiourl: ${audioUrl}`)
    try {
      waveSurferRef.current.stop();
      waveSurferRef.current.setTime(0);
      waveSurferRef.current.empty();
      waveSurferRef.current.load(audioUrl);
    } catch (err) {
      console.warn("Error during WaveSurfer.load:", err);
    }
    }, [selectedTrack])

    const handleZoom = (amount: number) => {
    if (!waveSurferRef.current) return
    setZoomLevel(prev => {
      const newZoom = Math.max(0, prev + amount)
      waveSurferRef.current!.zoom(newZoom)
      return newZoom
    })
  }

    return(
        <>
        <div
            ref={waveformRef}
            style={{ overflowX: "auto", border: "1px solid #ccc", borderRadius: "4px" }}
            className="h-full w-full"
        />
        <div className="mt-3 flex gap-3 items-center">
            <button
            className="px-3 py-2 bg-gray-700 text-white rounded"
            onClick={() => waveSurferRef.current?.playPause()}
            >
            <BsPlayFill /> Play / Pause
            </button>
            <button
            className="px-3 py-2 bg-gray-700 text-white rounded"
            onClick={() => handleZoom(10)}
            >
            <BsZoomIn /> Zoom In
            </button>
            <button
            className="px-3 py-2 bg-gray-700 text-white rounded"
            onClick={() => handleZoom(-10)}
            >
            <BsZoomOut /> Zoom Out
            </button>
        </div>
        </>
    )
}