import { FileText, Search, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const journalEntries = [
  { student: "Emma S.", class: "6A", date: "Today", summary: "Good progress in reading comprehension. Needs more support with inferencing.", flag: "positive" },
  { student: "Omar K.", class: "6A", date: "Today", summary: "Struggled with fraction problems. Consider adapted worksheet for next session.", flag: "attention" },
  { student: "Elsa M.", class: "6B", date: "Yesterday", summary: "Excellent participation in group discussion. Completed all tasks independently.", flag: "positive" },
  { student: "Lucas P.", class: "6A", date: "Yesterday", summary: "Had difficulty focusing during longer tasks. Transition timer helped.", flag: "attention" },
  { student: "Maja L.", class: "6C", date: "2 days ago", summary: "Showed improvement in written expression. Continue with adapted prompts.", flag: "positive" },
  { student: "Ali R.", class: "6B", date: "2 days ago", summary: "Missed several assignments. Parent meeting scheduled for next week.", flag: "attention" },
];

const TeacherJournals = () => {
  const [search, setSearch] = useState("");

  const filtered = journalEntries.filter(
    (e) =>
      e.student.toLowerCase().includes(search.toLowerCase()) ||
      e.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Student Journals
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Track student progress and observations</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((entry, i) => (
          <Card key={i} className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${
                  entry.flag === "positive" ? "bg-primary/10" : "bg-destructive/10"
                }`}>
                  {entry.flag === "positive" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{entry.student}</h3>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Class {entry.class}</p>
                  <p className="text-sm text-foreground/80">{entry.summary}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No journal entries found.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherJournals;
