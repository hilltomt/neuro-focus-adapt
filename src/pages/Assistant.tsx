import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Brain, Sparkles, ArrowLeft, Mic, SendHorizonal,
  ListChecks, BookOpen, HelpCircle, MessageSquare, MoreVertical, Trash2, Loader2, User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import StudySessionBoard from "@/components/assistant/StudySessionBoard";

interface OngoingTask {
  id: string;
  title: string;
}

const STORAGE_KEY = "neuro_ongoing_tasks";

const loadTasksFromStorage = (): OngoingTask[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

const saveTasksToStorage = (tasks: OngoingTask[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const taskTitle = searchParams.get("task");

  const [ongoingTasks, setOngoingTasks] = useState<OngoingTask[]>(() => {
    const stored = loadTasksFromStorage();
    // Ensure current URL task is in the list
    if (taskTitle && !stored.some((t) => t.title === taskTitle)) {
      const updated = [{ id: `task-${Date.now()}`, title: taskTitle }, ...stored];
      saveTasksToStorage(updated);
      return updated;
    }
    return stored.length > 0 ? stored : [];
  });

  const activeTask = taskTitle
    ? ongoingTasks.find((t) => t.title === taskTitle)
    : ongoingTasks[0];

  const [chatInput, setChatInput] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(activeTask?.id ?? "");

  const currentTaskTitle = activeTask?.title ?? taskTitle;

  const greeting = currentTaskTitle
    ? `Hi Lucas! 👋 I see we need to tackle **${currentTaskTitle}**. I've prepared a nonlinear roadmap for you. Which part do you want to smash first?`
    : "Hi Lucas! 👋 I'm your AI learning assistant. Launch a task from My Subjects to get started!";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSwitchTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setShowRoadmap(false);
    const task = ongoingTasks.find((t) => t.id === taskId);
    if (task) {
      navigate(`/assistant?task=${encodeURIComponent(task.title)}`, { replace: true });
    }
  };

  const handleRemoveTask = (taskId: string) => {
    const updated = ongoingTasks.filter((t) => t.id !== taskId);
    setOngoingTasks(updated);
    saveTasksToStorage(updated);
    if (activeTaskId === taskId) {
      if (updated.length > 0) {
        handleSwitchTask(updated[0].id);
      } else {
        setActiveTaskId("");
        navigate("/assistant", { replace: true });
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          activeSection="ai-assistant"
          onSectionChange={(section) => {
            if (section === "ai-assistant") navigate("/assistant");
            else if (section === "dashboard") navigate("/dashboard");
            else navigate(`/dashboard?section=${section}`);
          }}
          onSignOut={handleSignOut}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-1" />
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  AI Assistant
                </h2>
              </div>
            </div>
          </header>

          <div className="flex-1 flex min-h-0">
            {/* Left Task Sidebar — hidden during study session */}
            {!showRoadmap && (
            <aside className="hidden md:flex w-[25%] min-w-[220px] max-w-[280px] flex-col border-r border-border/50 bg-card/50">
              <div className="px-4 py-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  My Ongoing Tasks
                </h3>
                <div className="space-y-1">
                  {ongoingTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60 px-3 py-2">No tasks yet. Launch one from My Subjects.</p>
                  ) : (
                    ongoingTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group flex items-center gap-1 rounded-xl transition-all ${
                          activeTaskId === task.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <button
                          onClick={() => handleSwitchTask(task.id)}
                          className={`flex-1 text-left px-3 py-2.5 text-sm min-w-0 ${
                            activeTaskId === task.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="line-clamp-1">{task.title}</span>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => handleRemoveTask(task.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
            )}

            {/* Right Main Area */}
            <main className="flex-1 flex flex-col min-w-0">
              {showRoadmap ? (
                <StudySessionBoard
                  taskTitle={currentTaskTitle || "Study Session"}
                  onBack={() => setShowRoadmap(false)}
                />
              ) : (
                <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-3xl mx-auto w-full">
                  {/* Chat messages area */}
                  <div className="flex-1 space-y-4 animate-fade-up">
                    {/* AI greeting bubble */}
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4 text-accent" />
                      </div>
                      <div className="bg-accent/5 border border-accent/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                        <p className="text-sm text-foreground leading-relaxed">
                          {greeting.split("**").map((part, i) =>
                            i % 2 === 1 ? (
                              <span key={i} className="font-semibold text-accent">{part}</span>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap gap-2 pl-12">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => setShowRoadmap(true)}
                      >
                        <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                        Break it into steps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full border-border"
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        Explain simply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full border-border"
                      >
                        <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                        Quiz me on this
                      </Button>
                    </div>
                  </div>

                  {/* Floating chat input */}
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask anything about this task…"
                        className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm placeholder:text-muted-foreground/60 px-0"
                      />
                      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button size="icon" className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <SendHorizonal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                      AI assistant — Dust agent integration pending
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assistant;
