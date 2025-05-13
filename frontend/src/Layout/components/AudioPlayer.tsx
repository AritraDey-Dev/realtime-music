import { usePlayerStore } from '@/stores/usePlayerStore'
import React, { useEffect, useRef } from 'react'

const AudioPlayer = () => {
  const audioRef=useRef<HTMLAudioElement>(null)
  const prevSongRef=useRef<string| null>(null)
  const {currentSong,isPlaying,playNext}=usePlayerStore()
  useEffect(()=>{
    if(isPlaying) audioRef.current?.play()
    else audioRef.current?.pause()
  },[isPlaying])
  useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;

			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying]);
  return (
    <audio ref={audioRef}/>
  )
}

export default AudioPlayer