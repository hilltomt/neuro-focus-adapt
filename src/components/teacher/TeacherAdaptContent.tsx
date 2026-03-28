import { useState } from "react";
import { Wand2, Copy, Save, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const lessons = [
  { id: "fractions", name: "Fractions & Decimals", subject: "Mathematics", description: "Understanding fractions, converting between fractions and decimals, and performing basic operations with fractions including addition, subtraction, multiplication." },
  { id: "reading-comp", name: "Reading Comprehension", subject: "Swedish", description: "Analyzing texts for main ideas, supporting details, and author's purpose. Practice inferencing and summarizing narrative and informational texts." },
  { id: "cell-biology", name: "Cell Biology", subject: "Biology", description: "Introduction to cell structure including organelles, cell membrane function, and differences between plant and animal cells. Includes microscope lab work." },
  { id: "creative-writing", name: "Creative Writing", subject: "English", description: "Developing creative writing skills through storytelling techniques, character development, descriptive language, and narrative structure." },
  { id: "forces-motion", name: "Forces & Motion", subject: "Physics", description: "Newton's laws of motion, understanding gravity, friction, and balanced/unbalanced forces. Includes hands-on experiments with simple machines." },
  { id: "swedish-history", name: "Medieval Sweden", subject: "History", description: "Exploring Swedish history during the medieval period, including the Viking Age transition, the founding of towns, and the role of the church." },
];

const adaptationTypes = [
  { id: "adhd", label: "ADHD" },
  { id: "dyslexia", label: "Dyslexia" },
  { id: "autism", label: "Autism" },
  { id: "esl", label: "ESL / Language Support" },
  { id: "slow-processing", label: "Slow Processing" },
  { id: "general", label: "General Simplification" },
];

interface MicroSprint {
  title: string;
  duration: string;
  description: string;
}

const TeacherAdaptContent = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState("");
  const [adaptationType, setAdaptationType] = useState("adhd");
  const [lessonText, setLessonText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [microSprints, setMicroSprints] = useState<MicroSprint[]>([]);
  const [adaptedContent, setAdaptedContent] = useState("");

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setLessonText(lesson.description);
    }
    setMicroSprints([]);
    setAdaptedContent("");
  };

  const handleGenerate = async () => {
    if (!lessonText.trim()) {
      toast.error("Please select a lesson or paste content first");
      return;
    }

    setIsGenerating(true);
    setMicroSprints([]);
    setAdaptedContent("");

    const lesson = lessons.find((l) => l.id === selectedLesson);
    const adaptLabel = adaptationTypes.find((a) => a.id === adaptationType)?.label || adaptationType;

    try {
      const { data, error } = await supabase.functions.invoke("dust-chat", {
        body: {
          message: `You are an expert special education teacher. A teacher wants to adapt the following lesson content for a student with ${adaptLabel} needs.

Lesson: ${lesson?.name || "Custom content"}
Subject: ${lesson?.subject || "General"}
Content: ${lessonText}

Generate an adapted version with:
1. A simplified, ${adaptLabel}-friendly version of the content
2. 3-5 micro-sprints (small, timed tasks) that break the lesson into manageable chunks

Return your response in this exact JSON format:
{
  "adaptedContent": "The full adapted lesson text here...",
  "microSprints": [
    {"title": "Sprint title", "duration": "5 min", "description": "What the student should do"}
  ]
}

Return ONLY the JSON, no markdown fences or extra text.`,
          conversationId: null,
          context: `Teacher adapting content for ${adaptLabel}`,
        },
      });

      if (error) throw error;

      const reply = data?.reply || "";
      try {
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setAdaptedContent(parsed.adaptedContent || reply);
          setMicroSprints(parsed.microSprints || []);
        } else {
          setAdaptedContent(reply);
        }
      } catch {
        setAdaptedContent(reply);
      }

      toast.success("Micro-sprints generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate content");
      // Fallback
      const adaptLabel = adaptationTypes.find((a) => a.id === adaptationType)?.label || adaptationType;
      setAdaptedContent(`Adapted version (${adaptLabel}):\n\n${lessonText}`);
      setMicroSprints([
        { title: "Read the introduction", duration: "3 min", description: "Read the first paragraph carefully and underline key words." },
        { title: "Answer check questions", duration: "5 min", description: "Answer the 3 comprehension questions at the end." },
        { title: "Summarize in your words", duration: "4 min", description: "Write 2-3 sentences explaining what you learned." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !adaptedContent) return;
    setIsSaving(true);

    try {
      const lesson = lessons.find((l) => l.id === selectedLesson);
      const { error } = await supabase.from("adaptations").insert({
        user_id: user.id,
        original_content: lessonText,
        adapted_content: adaptedContent,
        strategies_used: [adaptationType],
        title: lesson?.name || lessonText.substring(0, 50),
      });
      if (error) throw error;
      toast.success("Adaptation saved and linked to student view!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const full = adaptedContent + (microSprints.length
      ? "\n\nMicro-Sprints:\n" + microSprints.map((s, i) => `${i + 1}. ${s.title} (${s.duration}) — ${s.description}`).join("\n")
      : "");
    navigator.clipboard.writeText(full);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Instruction Breakdown Card */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Instruction Breakdown</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Select a lesson to adapt, or paste text manually, and generate student-friendly micro-sprints.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Select lesson to adapt</Label>
              <Select value={selectedLesson} onValueChange={handleLessonSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson..." />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.name} — {lesson.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Adaptation type</Label>
              <Select value={adaptationType} onValueChange={setAdaptationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adaptationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            value={lessonText}
            onChange={(e) => setLessonText(e.target.value)}
            placeholder="Lesson description is auto-filled when you select a lesson, or paste text manually..."
            className="min-h-[120px] resize-none"
          />

          <Button
            onClick={handleGenerate}
            className="w-full gap-2"
            disabled={isGenerating || !lessonText.trim()}
            size="lg"
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Magic Wand — Generate Micro-Sprints"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Micro-Sprints */}
      {microSprints.length > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Generated Micro-Sprints
            </h3>
            <div className="space-y-3">
              {microSprints.map((sprint, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {i + 1}. {sprint.title}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {sprint.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{sprint.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adapted Content */}
      {adaptedContent && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Adapted Content
            </h3>
            <div className="p-4 rounded-lg border border-input bg-muted/30 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
              {adaptedContent}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2">
                <Copy className="h-4 w-4" />
                Copy All
              </Button>
              <Button onClick={handleSave} className="flex-1 gap-2" disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save & Link to Students"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherAdaptContent;
