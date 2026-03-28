import { Brain, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AIAssistantPlaceholder = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          AI Assistant
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal learning companion — powered by AI.
        </p>
      </div>

      {/* Chat area placeholder */}
      <Card className="border-dashed border-2 border-accent/30 bg-accent/5">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[400px] space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            AI Assistant Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This space will be powered by a smart AI agent that can help you break down tasks, 
            explain concepts in simple terms, create study plans, and adapt content to your learning style.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {["Explain this topic", "Break down my homework", "Quiz me", "Simplify this text"].map((prompt) => (
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
          <p className="text-xs text-muted-foreground/60 mt-4">
            Dust agent integration — pending setup
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPlaceholder;
