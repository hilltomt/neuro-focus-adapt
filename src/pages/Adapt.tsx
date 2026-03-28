import { useState } from "react";
import { Wand2, Copy, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const strategies = [
  { id: "chunking", label: "Content Chunking", description: "Break into small sections" },
  { id: "visual-cues", label: "Visual Cues", description: "Add icons and highlights" },
  { id: "simplify", label: "Simplify Language", description: "Use clear, direct words" },
  { id: "time-estimates", label: "Time Estimates", description: "Add reading time per section" },
  { id: "action-steps", label: "Action Steps", description: "Convert to numbered tasks" },
  { id: "key-points", label: "Key Points Summary", description: "Add a TL;DR section" },
];

const Adapt = ({ embedded }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const [originalContent, setOriginalContent] = useState("");
  const [adaptedContent, setAdaptedContent] = useState("");
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["chunking", "visual-cues", "simplify"]);
  const [isAdapting, setIsAdapting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleStrategy = (id: string) => {
    setSelectedStrategies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAdapt = () => {
    if (!originalContent.trim()) {
      toast.error("Please paste some content first");
      return;
    }
    if (selectedStrategies.length === 0) {
      toast.error("Select at least one strategy");
      return;
    }

    setIsAdapting(true);

    // Simulate adaptation (placeholder — will be replaced with AI)
    setTimeout(() => {
      let result = "";

      if (selectedStrategies.includes("key-points")) {
        result += "📋 KEY POINTS\n";
        const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim());
        sentences.slice(0, 3).forEach((s, i) => {
          result += `  • ${s.trim()}\n`;
        });
        result += "\n---\n\n";
      }

      if (selectedStrategies.includes("time-estimates")) {
        const wordCount = originalContent.split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(wordCount / 150));
        result += `⏱️ Estimated reading time: ${minutes} min\n\n`;
      }

      const paragraphs = originalContent.split(/\n\n+/).filter(p => p.trim());

      paragraphs.forEach((para, i) => {
        if (selectedStrategies.includes("chunking")) {
          result += `📌 Section ${i + 1}\n`;
        }

        let text = para.trim();

        if (selectedStrategies.includes("simplify")) {
          text = text
            .replace(/utilize/gi, "use")
            .replace(/implement/gi, "set up")
            .replace(/facilitate/gi, "help")
            .replace(/subsequently/gi, "then")
            .replace(/nevertheless/gi, "but")
            .replace(/approximately/gi, "about");
        }

        if (selectedStrategies.includes("action-steps")) {
          const sentences = text.split(/[.!?]+/).filter(s => s.trim());
          sentences.forEach((s, j) => {
            result += `  ${j + 1}. ${s.trim()}\n`;
          });
        } else {
          result += text;
        }

        if (selectedStrategies.includes("visual-cues")) {
          result += "\n  ✅ Check your understanding before moving on";
        }

        result += "\n\n";
      });

      setAdaptedContent(result.trim());
      setIsAdapting(false);
      toast.success("Content adapted!");
    }, 1200);
  };

  const handleSave = async () => {
    if (!user || !adaptedContent) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.from("adaptations").insert({
        user_id: user.id,
        original_content: originalContent,
        adapted_content: adaptedContent,
        strategies_used: selectedStrategies,
        title: originalContent.substring(0, 50) + (originalContent.length > 50 ? "..." : ""),
      });
      if (error) throw error;
      toast.success("Adaptation saved!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(adaptedContent);
    toast.success("Copied to clipboard!");
  };

  const content = (
      <div className="max-w-6xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Adapt Content
        </h1>
        <p className="text-muted-foreground mb-8">
          Paste your educational content and select strategies to make it ADHD-friendly.
        </p>

        {/* Strategies */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Adaptation Strategies
          </Label>
          <div className="flex flex-wrap gap-3">
            {strategies.map((strategy) => (
              <label
                key={strategy.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                  selectedStrategies.includes(strategy.id)
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={selectedStrategies.includes(strategy.id)}
                  onCheckedChange={() => toggleStrategy(strategy.id)}
                />
                {strategy.label}
              </label>
            ))}
          </div>
        </div>

        {/* Content panels */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Original */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Original Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="Paste your educational content here..."
                className="w-full h-64 p-3 rounded-lg border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={handleAdapt}
                className="w-full mt-3 gap-2"
                disabled={isAdapting || !originalContent.trim()}
              >
                <Wand2 className="h-4 w-4" />
                {isAdapting ? "Adapting..." : "Adapt Content"}
              </Button>
            </CardContent>
          </Card>

          {/* Adapted */}
          <Card className={adaptedContent ? "border-primary/20" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Adapted Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 p-3 rounded-lg border border-input bg-muted/30 text-sm overflow-y-auto whitespace-pre-wrap">
                {adaptedContent || (
                  <span className="text-muted-foreground">
                    Adapted content will appear here...
                  </span>
                )}
              </div>
              {adaptedContent && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={handleSave} className="flex-1 gap-2" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );

  if (embedded) return content;
  return <DashboardLayout>{content}</DashboardLayout>;
};

export default Adapt;
