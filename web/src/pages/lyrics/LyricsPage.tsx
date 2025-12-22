import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

const LyricsPage = () => {
	const { currentSong } = usePlayerStore();

	useEffect(() => {
		if (currentSong) {
			document.title = `${currentSong.title} - Lyrics`;
		}
        return () => {
            document.title = "Music App";
        }
	}, [currentSong]);

	if (!currentSong) {
		return (
			<div className='h-full flex flex-col items-center justify-center p-6'>
				<div className='text-zinc-400 text-lg'>Play a song to see lyrics</div>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col items-center justify-start p-8 overflow-y-auto scrollbar-hide'>
			<div className='max-w-2xl w-full space-y-8'>
				{/* Header */}
				<div className='flex items-center gap-6'>
					<img
						src={currentSong.imageUrl}
						alt={currentSong.title}
						className='w-24 h-24 rounded-md shadow-lg object-cover'
					/>
					<div>
						<h1 className='text-3xl font-bold text-white'>{currentSong.title}</h1>
						<p className='text-zinc-400 text-lg'>{currentSong.artist}</p>
					</div>
				</div>

				{/* Lyrics */}
				<div className='space-y-4'>
					{currentSong.lyrics ? (
						currentSong.lyrics.split('\n').map((line, index) => (
							<p
								key={index}
								className='text-2xl font-medium text-zinc-300 hover:text-white transition-colors leading-relaxed'
							>
								{line}
							</p>
						))
					) : (
						<div className='flex flex-col items-center justify-center py-20'>
							<p className='text-zinc-500 text-xl'>No lyrics available for this song.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LyricsPage;
