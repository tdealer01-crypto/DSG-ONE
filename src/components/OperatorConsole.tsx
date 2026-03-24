import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Mic, Volume2, Loader2, Maximize2, Minimize2, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Terminal } from "lucide-react";
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { useAgent, Proposal } from "../context/AgentContext";
import { tools, getToolDeclarations, validateProposal } from "../lib/agent/tools";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function OperatorConsole() {
  const { 
    state, setState, 
    currentGoal, setCurrentGoal, 
    activeProposal, setActiveProposal, 
    addLedgerEntry, 
    pendingApprovalCallback,
    approveProposal, rejectProposal
  } = useAgent();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model" | "system"; text: string }[]>([
    { role: "model", text: "DSG ONE Command Assistant online. Tool router connected. Ready for operations." }
  ]);
  const [input, setInput] = useState("");
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
  }, [messages, isOpen, isExpanded, activeProposal, state]);

  useEffect(() => {
    // Initialize chat session with tools
    chatRef.current = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "You are the DSG ONE Command Assistant, an autonomous operations agent. You have access to real-world tools. You MUST use tools to accomplish the user's goals. Do not just explain how to do it, actually propose the tool calls. Always follow the PLAN -> PROPOSE -> VALIDATE -> EXECUTE loop. If a tool is blocked or rejected, explain why and propose an alternative if possible.",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ functionDeclarations: getToolDeclarations() }],
        toolConfig: { includeServerSideToolInvocations: true }
      }
    });
  }, []);

  const executeTool = async (toolName: string, args: any, actionId: string) => {
    const tool = tools[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);
    const startTime = Date.now();
    try {
      const result = await tool.execute(args);
      const duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      return {
        success: result.success !== false,
        output: result,
        error: result.error || null,
        duration: result.duration || duration,
        toolName,
        actionId
      };
    } catch (e) {
      const duration = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      return {
        success: false,
        output: null,
        error: String(e),
        duration,
        toolName,
        actionId
      };
    }
  };

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim() || state !== 'IDLE') return;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setCurrentGoal(userMsg);
    setState('THINKING');

    try {
      let response = await chatRef.current.sendMessage({ message: userMsg });
      
      // Process tool calls loop
      while (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        const toolName = call.name;
        const args = call.args;
        
        setState('VALIDATING');
        const { decision, reason } = validateProposal(toolName, args);
        
        const proposal: Proposal = {
          id: Math.random().toString(36).substring(7),
          toolName,
          args,
          decision,
          reason
        };
        setActiveProposal(proposal);
        
        let toolResult;
        let status: 'SUCCESS' | 'FAILED' | 'REJECTED' = 'SUCCESS';
        
        if (decision === 'ALLOW') {
          setState('EXECUTING');
          try {
            toolResult = await executeTool(toolName, args, proposal.id);
          } catch (e) {
            toolResult = { error: String(e) };
            status = 'FAILED';
          }
        } else if (decision === 'STABILIZE') {
          setState('WAITING_APPROVAL');
          const approved = await new Promise<boolean>((resolve) => {
            pendingApprovalCallback.current = resolve;
          });
          
          if (approved) {
            setState('EXECUTING');
            try {
              toolResult = await executeTool(toolName, args, proposal.id);
            } catch (e) {
              toolResult = { error: String(e) };
              status = 'FAILED';
            }
          } else {
            toolResult = { error: "User rejected the proposal." };
            status = 'REJECTED';
          }
        } else {
          // BLOCK
          toolResult = { error: "Action blocked by safety policy: " + reason };
          status = 'REJECTED';
        }
        
        // Add to ledger
        addLedgerEntry({
          id: proposal.id,
          timestamp: new Date().toISOString(),
          goal: userMsg,
          proposal,
          tool: toolName,
          decision,
          reason,
          result: toolResult,
          status,
          auditId: `AUD-${Math.floor(Math.random() * 100000)}`,
          proofRef: `PRF-${Math.floor(Math.random() * 100000)}`
        });
        
        setActiveProposal(null);
        setState('THINKING');
        
        // Send result back to Gemini
        response = await chatRef.current.sendMessage({
          message: [{
            functionResponse: {
              name: toolName,
              response: toolResult
            }
          }]
        });
      }
      
      if (response.text) {
        setMessages(prev => [...prev, { role: "model", text: response.text }]);
      }
      setState('IDLE');
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "system", text: "Error: Unable to process request or tool execution failed." }]);
      setState('IDLE');
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
          setState('LISTENING');
          try {
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [
                { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
                "Transcribe this audio. Return ONLY the transcribed text."
              ]
            });
            const transcribedText = response.text?.trim() || "";
            if (transcribedText) {
               handleSend(transcribedText);
            } else {
               setState('IDLE');
            }
          } catch (error) {
            console.error("Transcription error:", error);
            setState('IDLE');
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
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
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

  const getStatusColor = () => {
    switch (state) {
      case 'IDLE': return 'bg-primary';
      case 'THINKING': return 'bg-blue-500';
      case 'VALIDATING': return 'bg-purple-500';
      case 'WAITING_APPROVAL': return 'bg-amber-500';
      case 'EXECUTING': return 'bg-emerald-500';
      case 'LISTENING': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 ${getStatusColor()} text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 z-50`}
        >
          {state === 'IDLE' ? <Terminal size={24} /> : <Loader2 size={24} className="animate-spin" />}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-6 right-6 w-[420px] h-[700px]'} bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 overflow-hidden`}>
          {/* Header */}
          <div className="h-14 bg-secondary/50 border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${state !== 'IDLE' ? 'animate-pulse' : ''}`} />
              Operator Console
              <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-0.5 bg-background rounded-full border border-border">
                {state}
              </span>
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

          {/* Messages & Activity */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : msg.role === 'system' ? 'bg-destructive/20 text-destructive border border-destructive/30 rounded-tl-sm' : 'bg-secondary text-secondary-foreground rounded-tl-sm'}`}>
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
            
            {/* Active Proposal UI */}
            {activeProposal && (
              <div className="flex justify-start">
                <div className="w-full max-w-[90%] bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal size={16} className="text-primary" />
                    <span className="font-semibold text-sm">Tool Proposal</span>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-3 mb-3 font-mono text-xs overflow-x-auto">
                    <div className="text-primary mb-1">{activeProposal.toolName}</div>
                    <div className="text-muted-foreground">{JSON.stringify(activeProposal.args, null, 2)}</div>
                  </div>

                  <div className="flex items-start gap-2 mb-4">
                    {activeProposal.decision === 'ALLOW' && <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />}
                    {activeProposal.decision === 'STABILIZE' && <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />}
                    {activeProposal.decision === 'BLOCK' && <XCircle size={16} className="text-destructive mt-0.5 shrink-0" />}
                    <div>
                      <div className="text-sm font-medium">Validator: {activeProposal.decision}</div>
                      <div className="text-xs text-muted-foreground">{activeProposal.reason}</div>
                    </div>
                  </div>

                  {state === 'WAITING_APPROVAL' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={approveProposal}
                        className="flex-1 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve & Execute
                      </button>
                      <button 
                        onClick={rejectProposal}
                        className="flex-1 bg-destructive/20 text-destructive hover:bg-destructive/30 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {state !== 'IDLE' && state !== 'WAITING_APPROVAL' && !activeProposal && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm capitalize">{state.toLowerCase()}...</span>
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
                placeholder={state === 'IDLE' ? "Issue a command..." : "Agent is busy..."}
                disabled={state !== 'IDLE'}
                className="w-full pl-4 pr-24 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-[52px] disabled:opacity-50"
                rows={1}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={toggleRecording}
                  disabled={state !== 'IDLE' && !isRecording}
                  className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50'}`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Mic size={18} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || state !== 'IDLE'}
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
