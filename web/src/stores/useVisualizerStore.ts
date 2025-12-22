import { create } from "zustand";

interface VisualizerStore {
	analyser: AnalyserNode | null;
	setAnalyser: (analyser: AnalyserNode | null) => void;
	isVisualizerOpen: boolean;
	toggleVisualizer: () => void;
}

export const useVisualizerStore = create<VisualizerStore>((set) => ({
	analyser: null,
	setAnalyser: (analyser) => set({ analyser }),
	isVisualizerOpen: false,
	toggleVisualizer: () => set((state) => ({ isVisualizerOpen: !state.isVisualizerOpen })),
}));
