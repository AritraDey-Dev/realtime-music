import { usePlayerStore } from "@/stores/usePlayerStore";
import { useVisualizerStore } from "@/stores/useVisualizerStore";
import { usePartyStore } from "@/stores/usePartyStore";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();
	const { setAnalyser } = useVisualizerStore();
    const { roomId, isHost, syncPlayer } = usePartyStore();
    const { socket } = useChatStore();
	const audioContextRef = useRef<AudioContext | null>(null);

	useEffect(() => {
		if (audioRef.current && !audioContextRef.current) {
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;

			const source = audioContext.createMediaElementSource(audioRef.current);
			source.connect(analyser);
			analyser.connect(audioContext.destination);

			audioContextRef.current = audioContext;
			setAnalyser(analyser);
		}
	}, [setAnalyser]);

	// handle play/pause logic
	useEffect(() => {
		if (isPlaying) {
			audioRef.current?.play();
			if (audioContextRef.current?.state === "suspended") {
				audioContextRef.current.resume();
			}
		} else {
			audioRef.current?.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext]);

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

    // Party Mode Sync
    useEffect(() => {
        if (!roomId || !isHost) return;
        // Host emits sync events
        const audio = audioRef.current;
        if (!audio) return;

        // We sync on state changes (isPlaying, currentSong) which are handled by other effects triggering syncPlayer
        syncPlayer("sync", currentSong, isPlaying, audio.currentTime);

    }, [roomId, isHost, currentSong, isPlaying, syncPlayer]);

    useEffect(() => {
        if (!socket || !roomId || isHost) return;

        const handleSync = (data: any) => {
            const { song, isPlaying: remoteIsPlaying, currentTime } = data;
            
            // Sync Song
            if (song?._id !== usePlayerStore.getState().currentSong?._id) {
                usePlayerStore.setState({ currentSong: song });
            }

            // Sync Play/Pause
            if (remoteIsPlaying !== usePlayerStore.getState().isPlaying) {
                 usePlayerStore.setState({ isPlaying: remoteIsPlaying });
            }

            // Sync Time
            if (audioRef.current) {
                const diff = Math.abs(audioRef.current.currentTime - currentTime);
                if (diff > 1) { // Only seek if off by more than 1s
                    audioRef.current.currentTime = currentTime;
                }
            }
        };

        socket.on("player_sync", handleSync);
        return () => { socket.off("player_sync", handleSync); };
    }, [socket, roomId, isHost]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;