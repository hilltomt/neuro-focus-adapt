import { useSearchParams, useNavigate } from "react-router-dom";
import { Brain, MessageSquare, Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const taskTitle = searchParams.get("task");

  const greeting = taskTitle
    ? `Hi Lucas! 👋 I see we need to tackle **${taskTitle}**. I've prepared a nonlinear roadmap for you. Which part do you want to smash first?`
    : "Hi Lucas! 👋 I'm your AI learning assistant. Pick a task or ask me anything!";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          activeSection="ai-assistant"
          onSectionChange={(section) => {
            if (section === "dashboard") navigate("/dashboard");
            else navigate(`/dashboard?section=${section}`);
          }}
          onSignOut={handleSignOut}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-1" />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
            <div className="space-y-6 animate-fade-up">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    AI Assistant
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Your personal learning companion — powered by AI.
                  </p>
                </div>
              </div>

              {/* Chat area */}
              <Card className="border border-border bg-card">
                <CardContent className="p-6 min-h-[400px] flex flex-col">
                  {/* AI greeting bubble */}
                  <div className="flex gap-3 mb-6">
                    <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <div className="bg-accent/5 border border-accent/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {greeting.split("**").map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-semibold text-accent">
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Quick prompts */}
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {[
                      "Break it into steps",
                      "Explain simply",
                      "Quiz me on this",
                      "Give me a summary",
                    ].map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {prompt}
                      </Button>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground/60 text-center mt-3">
                    Dust agent integration — pending setup
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assistant;
