import { useUser } from "@clerk/clerk-react";
import { Bot, Loader, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const AIPage = () => {
    const { user } = useUser();
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: `Hi ${user?.firstName}! I'm your AI DJ. Tell me how you're feeling or what kind of music you want to hear, and I'll create a perfect playlist for you.` }
    ]);
    const navigate = useNavigate();

    const handleGeneratePlaylist = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setPrompt("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/ai/generate", { prompt: userMessage });
            const { result } = response.data;

            if (result.type === 'playlist') {
                setMessages(prev => [...prev, { 
                    role: 'ai', 
                    content: result.message || `I've created a playlist called "${result.playlistName}" for you! Redirecting...`
                }]);

                setTimeout(() => {
                    navigate(`/playlists/${result.playlistId}`);
                }, 2000);
            } else {
                // Chat response
                setMessages(prev => [...prev, { 
                    role: 'ai', 
                    content: result.message || "I'm not sure how to respond to that."
                }]);
            }

        } catch (error) {
            console.error("Error generating response:", error);
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Sorry, I encountered an error. Please try again.";
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: message
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGeneratePlaylist();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-zinc-900 to-black p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-full">
                    <Sparkles className="size-8 text-emerald-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">AI DJ Assistant</h1>
                    <p className="text-zinc-400">Create personalized playlists with the power of AI</p>
                </div>
            </div>

            <ScrollArea className="flex-1 bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 mb-4">
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-br-none' 
                                    : 'bg-zinc-800 text-white rounded-bl-none'
                            }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {msg.role === 'ai' ? <Bot className="size-4" /> : <UserIcon className="size-4" />}
                                    <span className="text-xs font-medium opacity-70">
                                        {msg.role === 'ai' ? 'AI DJ' : 'You'}
                                    </span>
                                </div>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 text-white p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                                <Bot className="size-4" />
                                <Loader className="size-4 animate-spin" />
                                <span className="text-sm text-zinc-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="flex gap-2">
                <Input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your perfect playlist (e.g., 'High energy 80s rock for a workout')..."
                    className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    disabled={isLoading}
                />
                <Button 
                    onClick={handleGeneratePlaylist} 
                    disabled={isLoading || !prompt.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
};

const UserIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default AIPage;
