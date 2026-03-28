import { useState, useRef } from "react";
import { Calendar, Clock, BookOpen, Plus, Wand2, X, Send, Save, Sparkles, ArrowLeft, Paperclip, FileText, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScheduleLesson {
  time: string;
  subject: string;
  class: string;
  description?: string;
}

const scheduleData = [
  { day: "Monday", lessons: [
    { time: "08:30–09:30", subject: "Mathematics", class: "6A", description: "Fractions and decimals — converting, adding and subtracting fractions." },
    { time: "10:00–11:00", subject: "Swedish", class: "6B", description: "Reading comprehension — analyzing narrative texts for main ideas." },
    { time: "13:00–14:00", subject: "English", class: "6A", description: "Creative writing — character development and story structure." },
  ]},
  { day: "Tuesday", lessons: [
    { time: "08:30–09:30", subject: "Biology", class: "6A", description: "Cell biology — organelles, cell membrane, plant vs animal cells." },
    { time: "10:00–11:00", subject: "Mathematics", class: "6C", description: "Geometry — angles, triangles and area calculations." },
  ]},
  { day: "Wednesday", lessons: [
    { time: "09:00–10:00", subject: "Swedish", class: "6A", description: "Grammar — sentence structure and word classes." },
    { time: "11:00–12:00", subject: "English", class: "6B", description: "Vocabulary building — context clues and word families." },
    { time: "13:00–14:30", subject: "Physics", class: "6A", description: "Forces and motion — Newton's laws and friction experiments." },
  ]},
  { day: "Thursday", lessons: [
    { time: "08:30–09:30", subject: "Mathematics", class: "6B", description: "Percentages — converting between fractions, decimals and percentages." },
    { time: "10:00–11:00", subject: "Biology", class: "6C", description: "Ecosystems — food chains, producers and consumers." },
  ]},
  { day: "Friday", lessons: [
    { time: "09:00–10:00", subject: "Swedish", class: "6C", description: "Writing workshop — persuasive text structure and arguments." },
    { time: "11:00–12:00", subject: "Mathematics", class: "6A", description: "Problem solving — multi-step word problems with mixed operations." },
  ]},
];

const lessonPlans = [
  { title: "Fractions & Decimals", subject: "Mathematics", class: "6A", status: "Ready" },
  { title: "Reading Comprehension", subject: "Swedish", class: "6B", status: "Draft" },
  { title: "Cell Biology", subject: "Biology", class: "6A", status: "Ready" },
  { title: "Creative Writing", subject: "English", class: "6A", status: "In Progress" },
];

const adaptationTypes = [
  { id: "adhd", label: "ADHD" },
  { id: "dyslexia", label: "Dyslexia" },
  { id: "autism", label: "Autism" },
  { id: "esl", label: "ESL / Language Support" },
  { id: "slow-processing", label: "Slow Processing" },
  { id: "general", label: "General Simplification" },
];

const mockStudents = [
  { id: "emma", name: "Emma S.", class: "6A" },
  { id: "omar", name: "Omar K.", class: "6A" },
  { id: "elsa", name: "Elsa M.", class: "6B" },
  { id: "lucas", name: "Lucas P.", class: "6A" },
  { id: "maja", name: "Maja L.", class: "6C" },
  { id: "ali", name: "Ali R.", class: "6B" },
];

interface MicroSprint {
  title: string;
  duration: string;
  description: string;
}

const TeacherScheduleManager = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<(ScheduleLesson & { day: string }) | null>(null);
  const [lessonText, setLessonText] = useState("");
  const [adaptationType, setAdaptationType] = useState("adhd");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adaptedContent, setAdaptedContent] = useState("");
  const [microSprints, setMicroSprints] = useState<MicroSprint[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLessonClick = (lesson: ScheduleLesson, day: string) => {
    setSelectedLesson({ ...lesson, day });
    setLessonText(lesson.description || "");
    setAdaptedContent("");
    setMicroSprints([]);
    setSelectedStudents([]);
    setAdaptationType("adhd");
    setUploadedFiles([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setIsUploading(true);
    const newFiles: { name: string; url: string }[] = [];

    for (const file of Array.from(files)) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("lesson-files")
        .upload(filePath, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("lesson-files")
        .getPublicUrl(filePath);

      newFiles.push({ name: file.name, url: urlData.publicUrl });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) toast.success(`${newFiles.length} file(s) uploaded`);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setSelectedLesson(null);
    setAdaptedContent("");
    setMicroSprints([]);
  };

  const handleGenerate = async () => {
    if (!lessonText.trim()) {
      toast.error("Please add lesson content first");
      return;
    }

    setIsGenerating(true);
    setAdaptedContent("");
    setMicroSprints([]);

    const adaptLabel = adaptationTypes.find((a) => a.id === adaptationType)?.label || adaptationType;

    try {
      const { data, error } = await supabase.functions.invoke("dust-chat", {
        body: {
          message: `You are an expert special education teacher. A teacher wants to adapt the following lesson for a student with ${adaptLabel} needs.

Subject: ${selectedLesson?.subject}
Class: ${selectedLesson?.class}
Time: ${selectedLesson?.time}
Content: ${lessonText}

Generate:
1. A simplified, ${adaptLabel}-friendly version of the content
2. 3-5 micro-sprints (small, timed tasks) that break the lesson into manageable chunks for the student

Return your response in this exact JSON format:
{
  "adaptedContent": "The full adapted lesson text here...",
  "microSprints": [
    {"title": "Sprint title", "duration": "5 min", "description": "What the student should do"}
  ]
}

Return ONLY the JSON, no markdown fences or extra text.`,
          conversationId: null,
          context: `Teacher adapting ${selectedLesson?.subject} for ${adaptLabel}`,
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
      toast.success("Adapted content generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
      setAdaptedContent(`Adapted version (${adaptLabel}):\n\n${lessonText}`);
      setMicroSprints([
        { title: "Read the introduction", duration: "3 min", description: "Read the first paragraph and underline key words." },
        { title: "Practice exercises", duration: "5 min", description: "Complete the 3 guided practice problems." },
        { title: "Summarize", duration: "4 min", description: "Write 2-3 sentences explaining what you learned." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSendToStudents = async () => {
    if (!user || !adaptedContent) return;
    if (selectedStudents.length === 0) {
      toast.error("Select at least one student");
      return;
    }
    setIsSaving(true);

    try {
      const { error } = await supabase.from("adaptations").insert({
        user_id: user.id,
        original_content: lessonText,
        adapted_content: adaptedContent,
        strategies_used: [adaptationType],
        title: `${selectedLesson?.subject} — ${selectedLesson?.class} (${selectedLesson?.day})`,
      });
      if (error) throw error;

      const studentNames = selectedStudents
        .map((id) => mockStudents.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      toast.success(`Adapted content sent to ${studentNames}!`);
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const relevantStudents = selectedLesson
    ? mockStudents.filter((s) => s.class === selectedLesson.class)
    : [];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Schedule
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Click a lesson to adapt its content for students</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {scheduleData.map((day) => (
          <Card key={day.day}>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm font-semibold">{day.day}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {day.lessons.map((lesson, i) => (
                <div
                  key={i}
                  onClick={() => handleLessonClick(lesson, day.day)}
                  className="p-2 rounded-lg bg-primary/5 border border-primary/10 space-y-1 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  <p className="text-xs font-medium text-foreground">{lesson.subject}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lesson.time}
                  </p>
                  <p className="text-xs text-muted-foreground">Class {lesson.class}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lesson Plans */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lesson Plans
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> New Plan
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {lessonPlans.map((plan, i) => (
            <Card key={i} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{plan.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    plan.status === "Ready" ? "bg-primary/10 text-primary" :
                    plan.status === "Draft" ? "bg-muted text-muted-foreground" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.subject} · Class {plan.class}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lesson Adaptation Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {selectedLesson?.subject} — Class {selectedLesson?.class}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedLesson?.day}, {selectedLesson?.time}
            </p>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Adaptation type */}
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

            {/* Lesson content */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Lesson content</Label>
              <Textarea
                value={lessonText}
                onChange={(e) => setLessonText(e.target.value)}
                placeholder="Edit or paste lesson content..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* File upload */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Attachments</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/30 bg-muted/30 cursor-pointer transition-colors"
              >
                {isUploading ? (
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload files (PDF, DOC, images)</p>
                  </>
                )}
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:text-primary truncate flex-1"
                      >
                        {file.name}
                      </a>
                      <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              className="w-full gap-2"
              disabled={isGenerating || !lessonText.trim()}
              size="lg"
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Magic Wand — Generate Micro-Sprints"}
            </Button>

            {/* Adapted content */}
            {adaptedContent && (
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground">Adapted Content</h3>
                <div className="p-3 rounded-lg border border-input bg-muted/30 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {adaptedContent}
                </div>
              </div>
            )}

            {/* Micro-sprints */}
            {microSprints.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Micro-Sprints</h3>
                <div className="space-y-2">
                  {microSprints.map((sprint, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{i + 1}. {sprint.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{sprint.duration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{sprint.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student selection & send */}
            {adaptedContent && (
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground">Send to students in Class {selectedLesson?.class}</h3>
                <div className="flex flex-wrap gap-2">
                  {relevantStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedStudents.includes(student.id)
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-card border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {student.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedStudents(
                      selectedStudents.length === relevantStudents.length
                        ? []
                        : relevantStudents.map((s) => s.id)
                    )}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {selectedStudents.length === relevantStudents.length ? "Deselect all" : "Select all"}
                  </button>
                </div>

                <Button
                  onClick={handleSendToStudents}
                  className="w-full gap-2"
                  disabled={isSaving || selectedStudents.length === 0}
                >
                  <Send className="h-4 w-4" />
                  {isSaving ? "Sending..." : `Send to ${selectedStudents.length} student${selectedStudents.length !== 1 ? "s" : ""}`}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherScheduleManager;
