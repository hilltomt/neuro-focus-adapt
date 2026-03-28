import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const subjectGroups = [
  {
    label: "Core Subjects",
    subjects: [
      { id: "mathematics", name: "Mathematics", progress: 65, color: "hsl(var(--primary))" },
      { id: "english", name: "English", progress: 55, color: "hsl(217 91% 60%)" },
      { id: "science", name: "Science", progress: 70, color: "hsl(142 71% 45%)" },
    ],
  },
  {
    label: "Other Subjects",
    subjects: [
      { id: "history", name: "History", progress: 60, color: "hsl(32 95% 44%)" },
      { id: "geography", name: "Geography", progress: 50, color: "hsl(174 72% 40%)" },
      { id: "art", name: "Art", progress: 80, color: "hsl(330 81% 60%)" },
      { id: "music", name: "Music", progress: 45, color: "hsl(262 83% 58%)" },
      { id: "pe", name: "Physical Education", progress: 90, color: "hsl(142 71% 45%)" },
    ],
  },
];

const SubjectsView = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          My Subjects
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Track your progress across all subjects.</p>
      </div>

      {subjectGroups.map((group) => (
        <div key={group.label} className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 rounded-xl bg-card border border-border space-y-3 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                onClick={() => navigate(`/subject/${subject.id}`)}
              >
                <h4 className="font-semibold text-sm text-foreground">{subject.name}</h4>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{subject.progress}% completed</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectsView;
