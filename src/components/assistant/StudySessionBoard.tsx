import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Circle, Sparkles, SendHorizonal, Mic, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  onBack: () => void;
}

const mockedAIResponses = [
  "Good start! Try breaking down the denominators first. What's the least common multiple? 🤔",
  "You're on the right track! Remember, to add fractions you need a common denominator. Keep going! 💪",
  "Great question! Think of it like pizza slices — if one pizza is cut into 4 and another into 6, how do you compare? 🍕",
  "Almost there! Simplify by finding the GCD of the numerator and denominator. You've got this! ✨",
  "That's a smart approach! Try writing it out step by step — it really helps with fractions. 📝",
];

const generateSteps = (taskTitle: string): Step[] => {
  const lower = taskTitle.toLowerCase();
  if (lower.includes("fraction")) {
    return [
      { id: "1", title: "Simplify 3 Fractions", description: "Reduce fractions to their simplest form using GCD.", status: "completed" },
      { id: "2", title: "Add Unlike Denominators", description: "Find common denominators and add fractions together.", status: "active" },
      { id: "3", title: "Fraction Word Problem", description: "Apply fraction skills to solve a real-world word problem.", status: "default" },
    ];
  }
  if (lower.includes("viking") || lower.includes("history")) {
    return [
      { id: "1", title: "Research Viking Routes", description: "Map out the main Viking exploration routes across Europe.", status: "active" },
      { id: "2", title: "Write Introduction", description: "Draft the opening paragraph with a strong thesis.", status: "default" },
      { id: "3", title: "Add Historical Facts", description: "Include at least 3 verified historical facts with sources.", status: "default" },
    ];
  }
  return [
    { id: "1", title: "Step 1: Review Material", description: "Go through the core concepts one more time.", status: "active" },
    { id: "2", title: "Step 2: Practice", description: "Complete the practice exercises.", status: "default" },
    { id: "3", title: "Step 3: Self-Check", description: "Quiz yourself on what you learned.", status: "default" },
  ];
};

const StudySessionBoard = ({ taskTitle, onBack }: StudySessionBoardProps) => {
  const [steps, setSteps] = useState<Step[]>(() => generateSteps(taskTitle));
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", text };
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: mockedAIResponses[responseIndex % mockedAIResponses.length],
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setResponseIndex((i) => i + 1);
    setChatInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStepClick = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) {
          if (s.status === "default") return { ...s, status: "active" as const };
          if (s.status === "active") return { ...s, status: "completed" as const };
          return { ...s, status: "active" as const };
        }
        return s;
      })
    );
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
            {/* AI instruction for current step */}
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {activeStep
                    ? `Great progress! 🎯 Let's work on: **${activeStep.title}**. ${activeStep.description} Click the card when you're done!`
                        .split("**")
                        .map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-semibold text-accent">{part}</span>
                          ) : (
                            part
                          )
                        )
                    : "Amazing — you've completed all steps! 🎉 Great job!"}
                </p>
              </div>
            </div>

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
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
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
              />
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSendMessage}
                className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right column — Step cards grid */}
        <div className="hidden md:flex flex-col flex-1 p-4 sm:p-5 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Let's Start! 🚀</h3>
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
                    : "bg-card border-border/60 hover:border-border"
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
                      <Circle className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold mb-0.5 ${
                      step.status === "completed"
                        ? "line-through text-muted-foreground"
                        : step.status === "active"
                        ? "text-foreground"
                        : "text-muted-foreground"
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
        </div>
      </div>
    </div>
  );
};

export default StudySessionBoard;
