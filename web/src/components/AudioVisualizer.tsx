import { useEffect, useRef } from "react";
import { useVisualizerStore } from "@/stores/useVisualizerStore";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const AudioVisualizer = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { analyser, isVisualizerOpen, toggleVisualizer } = useVisualizerStore();
	const animationRef = useRef<number>(0);

	useEffect(() => {
		if (!isVisualizerOpen || !analyser || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size to full screen
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			animationRef.current = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "rgba(24, 24, 27, 0.2)"; // Zinc-900 with opacity for trail effect
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let barHeight;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i] * 2; // Scale up height

				// Cool gradient colors: Emerald to Violet
				const r = 100 + (i / bufferLength) * 100;
				const g = 255 - (i / bufferLength) * 150;
				const b = 200;

				ctx.fillStyle = `rgb(${r},${g},${b})`;
				
                // Draw rounded bars
                ctx.beginPath();
                ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [10, 10, 0, 0]);
                ctx.fill();

				x += barWidth + 2;
			}
		};

		draw();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		window.addEventListener("resize", handleResize);

		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
			window.removeEventListener("resize", handleResize);
		};
	}, [isVisualizerOpen, analyser]);

	if (!isVisualizerOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] bg-zinc-900/95 flex items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm">
			<Button
				onClick={toggleVisualizer}
				className="absolute top-6 right-6 z-50 bg-transparent hover:bg-white/10 text-white rounded-full p-2"
				variant="ghost"
			>
				<X className="h-8 w-8" />
			</Button>
            
            {/* Song Info Overlay */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center space-y-2 pointer-events-none">
                <h2 className="text-2xl font-bold text-white tracking-wider">VISUALIZER</h2>
                <p className="text-zinc-400 text-sm">Enjoy the beat</p>
            </div>

			<canvas ref={canvasRef} className="w-full h-full" />
		</div>
	);
};

export default AudioVisualizer;
