import { useState, useRef, useEffect, useCallback } from "react";
import { CheckCircle2, Circle, Sparkles, SendHorizonal, Mic, ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Step {
  id: string;
  title: string;
  description: string;
  status: "default" | "active" | "completed";
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface StudySessionBoardProps {
  taskTitle: string;
  taskId: string;
  onBack: () => void;
}

const BOARD_MESSAGES_KEY = "neuro_board_messages";
const BOARD_CONVOS_KEY = "neuro_board_conversations";
const BOARD_STEPS_KEY = "neuro_board_steps";

const loadBoardMessages = (taskId: string): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(BOARD_MESSAGES_KEY);
    if (raw) { const all = JSON.parse(raw); return all[taskId] || []; }
  } catch {}
  return [];
};

const saveBoardMessages = (taskId: string, msgs: ChatMessage[]) => {
  try {
    const raw = localStorage.getItem(BOARD_MESSAGES_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[taskId] = msgs;
    localStorage.setItem(BOARD_MESSAGES_KEY, JSON.stringify(all));
  } catch {}
};

const loadBoardConvoId = (taskId: string): string | null => {
  try {
    const raw = localStorage.getItem(BOARD_CONVOS_KEY);
    if (raw) { const all = JSON.parse(raw); return all[taskId] || null; }
  } catch {}
  return null;
};

const saveBoardConvoId = (taskId: string, convId: string) => {
  try {
    const raw = localStorage.getItem(BOARD_CONVOS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[taskId] = convId;
    localStorage.setItem(BOARD_CONVOS_KEY, JSON.stringify(all));
  } catch {}
};

const loadBoardSteps = (taskId: string): Step[] | null => {
  try {
    const raw = localStorage.getItem(BOARD_STEPS_KEY);
    if (raw) { const all = JSON.parse(raw); return all[taskId] || null; }
  } catch {}
  return null;
};

const saveBoardSteps = (taskId: string, steps: Step[]) => {
  try {
    const raw = localStorage.getItem(BOARD_STEPS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[taskId] = steps;
    localStorage.setItem(BOARD_STEPS_KEY, JSON.stringify(all));
  } catch {}
};

const parseStepsFromAIResponse = (text: string): Step[] | null => {
  try {
    // Try to find JSON array in the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, index: number) => ({
          id: String(index + 1),
          title: item.title || `Step ${index + 1}`,
          description: item.description || "",
          status: "default" as const,
        }));
      }
    }
  } catch {}
  return null;
};

const StudySessionBoard = ({ taskTitle, taskId, onBack }: StudySessionBoardProps) => {
  const [steps, setSteps] = useState<Step[]>(() => loadBoardSteps(taskId) || []);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadBoardMessages(taskId));
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => loadBoardConvoId(taskId));
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef(false);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate steps from AI on first mount (if not already cached)
  useEffect(() => {
    if (hasGeneratedRef.current) return;
    const cachedSteps = loadBoardSteps(taskId);
    if (cachedSteps && cachedSteps.length > 0) {
      hasGeneratedRef.current = true;
      // If no messages yet, add the welcome message
      if (messages.length === 0) {
        const welcomeMsg: ChatMessage = {
          id: `ai-welcome-${Date.now()}`,
          role: "ai",
          text: `Hey! 👋 I've prepared a roadmap for tackling **${taskTitle}**. Check out the steps on the right — click any card to start working on it, and I'll be right here to help you along the way! 🚀`,
        };
        setMessages([welcomeMsg]);
        saveBoardMessages(taskId, [welcomeMsg]);
      }
      return;
    }

    hasGeneratedRef.current = true;
    setIsGeneratingSteps(true);

    const generateStepsFromAI = async () => {
      try {
        const prompt = `I need to work on this assignment: "${taskTitle}". Please break it down into 3-5 clear, actionable steps that a student can follow. Return ONLY a JSON array with objects containing "title" and "description" fields. No other text, just the JSON array. Example format: [{"title": "Step title", "description": "Brief description of what to do"}]`;

        const { data, error } = await supabase.functions.invoke('dust-chat', {
          body: { message: prompt, conversationId: null, context: taskTitle, taskId },
        });

        if (error) throw error;

        if (data?.conversationId) {
          setConversationId(data.conversationId);
          saveBoardConvoId(taskId, data.conversationId);
        }

        const parsedSteps = parseStepsFromAIResponse(data?.reply || "");
        if (parsedSteps && parsedSteps.length > 0) {
          setSteps(parsedSteps);
          saveBoardSteps(taskId, parsedSteps);
        } else {
          // Fallback steps if parsing fails
          const fallback: Step[] = [
            { id: "1", title: "Review the requirements", description: "Read through the assignment carefully and identify key objectives.", status: "default" },
            { id: "2", title: "Research & gather materials", description: "Find relevant resources and take notes on important concepts.", status: "default" },
            { id: "3", title: "Work through the task", description: "Complete the main body of work step by step.", status: "default" },
            { id: "4", title: "Review & refine", description: "Check your work, fix any issues, and polish the final result.", status: "default" },
          ];
          setSteps(fallback);
          saveBoardSteps(taskId, fallback);
        }

        // Add welcome message
        const welcomeMsg: ChatMessage = {
          id: `ai-welcome-${Date.now()}`,
          role: "ai",
          text: `Hey! 👋 I've prepared a roadmap for tackling **${taskTitle}**. Check out the steps on the right — click any card to start working on it, and I'll be right here to help you along the way! 🚀`,
        };
        setMessages([welcomeMsg]);
        saveBoardMessages(taskId, [welcomeMsg]);
      } catch (err) {
        console.error('Failed to generate steps:', err);
        const fallback: Step[] = [
          { id: "1", title: "Review the requirements", description: "Read through the assignment carefully and identify key objectives.", status: "default" },
          { id: "2", title: "Research & gather materials", description: "Find relevant resources and take notes on important concepts.", status: "default" },
          { id: "3", title: "Work through the task", description: "Complete the main body of work step by step.", status: "default" },
        ];
        setSteps(fallback);
        saveBoardSteps(taskId, fallback);

        const welcomeMsg: ChatMessage = {
          id: `ai-welcome-${Date.now()}`,
          role: "ai",
          text: `Hey! 👋 I've prepared a roadmap for tackling **${taskTitle}**. Check out the steps on the right and let's get started! 🚀`,
        };
        setMessages([welcomeMsg]);
        saveBoardMessages(taskId, [welcomeMsg]);
      } finally {
        setIsGeneratingSteps(false);
      }
    };

    generateStepsFromAI();
  }, [taskId, taskTitle]);

  const sendMessageToDust = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dust-chat', {
        body: { message: text, conversationId, context: taskTitle, taskId },
      });

      if (error) throw error;

      if (data?.conversationId) {
        setConversationId(data.conversationId);
        saveBoardConvoId(taskId, data.conversationId);
      }

      return data?.reply || "I'm thinking... could you try again?";
    } catch (err) {
      console.error('Dust chat error:', err);
      return "Sorry, I had trouble connecting. Please try again! 🔄";
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, taskTitle, taskId]);

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", text };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      saveBoardMessages(taskId, updated);
      return updated;
    });
    setChatInput("");

    const reply = await sendMessageToDust(text);
    const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: "ai", text: reply };
    setMessages((prev) => {
      const updated = [...prev, aiMsg];
      saveBoardMessages(taskId, updated);
      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStepClick = async (stepId: string) => {
    let clickedStep: Step | undefined;
    let newStatus: Step["status"] = "default";

    setSteps((prev) => {
      const updated = prev.map((s) => {
        if (s.id === stepId) {
          if (s.status === "default") { newStatus = "active"; return { ...s, status: "active" as const }; }
          if (s.status === "active") { newStatus = "completed"; return { ...s, status: "completed" as const }; }
          newStatus = "default"; return { ...s, status: "default" as const };
        }
        return s;
      });
      clickedStep = updated.find((s) => s.id === stepId);
      saveBoardSteps(taskId, updated);
      return updated;
    });

    // When a step becomes active, ask the AI for guidance on it
    if (newStatus === "active" && clickedStep) {
      const prompt = `The student just started working on this step: "${clickedStep.title}" — ${clickedStep.description}. Give them a brief, encouraging explanation of how to approach this step for the assignment "${taskTitle}". Be concise and helpful.`;
      const reply = await sendMessageToDust(prompt);
      const aiMsg: ChatMessage = { id: `ai-step-${Date.now()}`, role: "ai", text: reply };
      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        saveBoardMessages(taskId, updated);
        return updated;
      });
    }
  };

  const activeStep = steps.find((s) => s.status === "active");

  return (
    <div className="flex-1 flex flex-col bg-muted/30 min-h-0">
      {/* Top bar with avatar + progress */}
      <div className="flex items-center gap-4 px-4 sm:px-6 py-4 bg-card/60 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Progress circle */}
        <div className="relative h-11 w-11 shrink-0">
          <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" className="stroke-border" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
            {progress}%
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground truncate">{taskTitle}</h2>
          <p className="text-xs text-muted-foreground">{completedCount} of {steps.length} steps complete</p>
        </div>
      </div>

      {/* Two-column content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left column — AI guidance + chat */}
        <div className="w-full md:w-[40%] flex flex-col border-r border-border/30 p-4 sm:p-5">
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Chat messages */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-accent/5 border border-accent/20 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {(isLoading || isGeneratingSteps) && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {isGeneratingSteps ? "Preparing your roadmap..." : "Thinking..."}
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="pt-4">
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this step…"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm placeholder:text-muted-foreground/60 px-0"
                disabled={isLoading || isGeneratingSteps}
              />
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || isGeneratingSteps}
                className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Right column — Step cards grid */}
        <div className="hidden md:flex flex-col flex-1 p-4 sm:p-5 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isGeneratingSteps ? "Building your roadmap... ✨" : "Let's Start! 🚀"}
          </h3>
          {isGeneratingSteps ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">AI is breaking down your task into steps...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    step.status === "completed"
                      ? "bg-muted/50 border-primary/30"
                      : step.status === "active"
                      ? "bg-card border-primary shadow-[0_0_16px_hsl(var(--primary)/0.15)] scale-[1.01]"
                      : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : step.status === "active" ? (
                        <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-primary/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold mb-0.5 ${
                        step.status === "completed"
                          ? "line-through text-muted-foreground"
                          : step.status === "active"
                          ? "text-foreground"
                          : "text-foreground/80"
                      }`}>
                        Step {index + 1}: {step.title}
                      </p>
                      <p className={`text-xs leading-relaxed ${
                        step.status === "completed" ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySessionBoard;
