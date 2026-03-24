import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Mic, Volume2, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import ReactMarkdown from "react-markdown";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hello, Operator. I am the DSG ONE Command Assistant. How can I help you manage your autonomous fleet today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isExpanded]);

  useEffect(() => {
    // Initialize chat session
    chatRef.current = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "You are the DSG ONE Command Assistant, an AI expert in deterministic safety gates, formal verification (Z3 SMT), and autonomous agent management. You help operators monitor their fleet, understand proofs, and manage policies. Keep responses concise, professional, and technical.",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }]
      }
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: "model", text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", text: "Error: Unable to process request. Please check your connection or API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          try {
            // Use flash for transcription
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [
                {
                  inlineData: {
                    data: base64Audio,
                    mimeType: "audio/webm"
                  }
                },
                "Transcribe this audio. Return ONLY the transcribed text."
              ]
            });
            const transcribedText = response.text?.trim() || "";
            if (transcribedText) {
               setInput(transcribedText);
            }
          } catch (error) {
            console.error("Transcription error:", error);
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playTTS = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audio.onended = () => setIsPlaying(false);
        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105 z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-6 right-6 w-[380px] h-[600px]'} bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 overflow-hidden`}>
          {/* Header */}
          <div className="h-14 bg-secondary/50 border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Command Assistant
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary text-secondary-foreground rounded-tl-sm'}`}>
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => playTTS(msg.text)}
                      disabled={isPlaying}
                      className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center gap-1 transition-opacity"
                    >
                      <Volume2 size={12} /> {isPlaying ? 'Playing...' : 'Read aloud'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background shrink-0">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your fleet or proofs..."
                className="w-full pl-4 pr-24 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-[52px]"
                rows={1}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Mic size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
