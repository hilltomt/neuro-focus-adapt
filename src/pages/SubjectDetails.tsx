import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, CalendarClock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  time?: string;
  due?: string;
  grade?: string;
  description: string;
  objectives?: string[];
}

const mockTasks: Record<string, { current: Task[]; upcoming: Task[]; completed: Task[] }> = {
  mathematics: {
    current: [
      { id: "1", title: "Fractions Worksheet", time: "15 min", description: "Complete exercises on adding and subtracting fractions with unlike denominators.", objectives: ["Simplify fractions", "Find common denominators", "Solve 10 practice problems"] },
      { id: "2", title: "Geometry Basics", time: "20 min", description: "Learn about basic geometric shapes, angles, and their properties.", objectives: ["Identify triangles, squares, and circles", "Measure angles with a protractor", "Calculate perimeter of simple shapes"] },
    ],
    upcoming: [
      { id: "3", title: "Algebra Introduction", due: "Apr 2", description: "Introduction to variables, expressions, and simple equations.", objectives: ["Understand what a variable is", "Write simple expressions"] },
      { id: "4", title: "Number Patterns Quiz", due: "Apr 5", description: "Quiz covering arithmetic and geometric number patterns." },
    ],
    completed: [
      { id: "5", title: "Multiplication Tables", grade: "⭐ 92%", description: "Practice multiplication tables from 1 to 12." },
      { id: "6", title: "Addition & Subtraction Review", grade: "⭐ 88%", description: "Review of multi-digit addition and subtraction with regrouping." },
    ],
  },
  english: {
    current: [
      { id: "1", title: "Write 3 Sentences", time: "8 min", description: "Write three complete sentences using this week's vocabulary words.", objectives: ["Use correct punctuation", "Include at least one adjective per sentence"] },
      { id: "2", title: "Reading Comprehension", time: "12 min", description: "Read the short passage and answer comprehension questions.", objectives: ["Identify the main idea", "Find supporting details", "Make inferences"] },
    ],
    upcoming: [
      { id: "3", title: "Vocabulary Quiz", due: "Apr 3", description: "Quiz on 15 vocabulary words from Unit 4." },
    ],
    completed: [
      { id: "5", title: "Spelling Test", grade: "⭐ 95%", description: "Weekly spelling test on commonly misspelled words." },
    ],
  },
  history: {
    current: [
      { id: "1", title: "Essay: Vikings", time: "25 min", description: "Write a short essay about Viking exploration and their impact on Europe.", objectives: ["Describe Viking routes", "Explain cultural exchanges", "Include at least 3 historical facts"] },
      { id: "2", title: "Timeline Activity", time: "10 min", description: "Place key medieval events on a timeline in the correct order.", objectives: ["Order events chronologically", "Identify century for each event"] },
    ],
    upcoming: [
      { id: "3", title: "Ancient Egypt Project", due: "Apr 8", description: "Research project on daily life in Ancient Egypt." },
    ],
    completed: [
      { id: "5", title: "Roman Empire Quiz", grade: "⭐ 90%", description: "Quiz covering the rise and fall of the Roman Empire." },
    ],
  },
};

const defaultTasks: { current: Task[]; upcoming: Task[]; completed: Task[] } = {
  current: [
    { id: "1", title: "Reading Assignment", time: "15 min", description: "Complete the assigned reading for this week's lesson." },
    { id: "2", title: "Practice Exercise", time: "10 min", description: "Work through the practice exercises at the end of the chapter." },
  ],
  upcoming: [
    { id: "3", title: "Weekly Quiz", due: "Apr 4", description: "Weekly assessment covering recent material." },
  ],
  completed: [
    { id: "5", title: "Introduction Module", grade: "⭐ 85%", description: "Introductory module covering the basics of the subject." },
  ],
};

const SubjectDetails = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const displayName = subjectName
    ? subjectName.charAt(0).toUpperCase() + subjectName.slice(1).replace(/-/g, " ")
    : "Subject";

  const tasks = (subjectName && mockTasks[subjectName.toLowerCase()]) || defaultTasks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          activeSection="subjects"
          onSectionChange={(section) => {
            if (section === "dashboard") navigate("/dashboard");
            else navigate(`/dashboard?section=${section}`);
          }}
          onSignOut={handleSignOut}
          activeRole="student"
          onRoleChange={() => {}}
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
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard?section=subjects")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {displayName}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Your tasks and assignments</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="current" className="text-sm">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Current
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="text-sm">
                    <CalendarClock className="h-4 w-4 mr-1.5" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Completed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-3 mt-4">
                  {tasks.current.map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
                          <p className="text-xs text-muted-foreground">Estimated: {task.time}</p>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          View →
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-3 mt-4">
                  {tasks.upcoming.map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:border-border hover:shadow-sm transition-all"
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <CalendarClock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
                          <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          View →
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-3 mt-4">
                  {tasks.completed.map((task) => (
                    <Card
                      key={task.id}
                      className="bg-primary/5 border-primary/20 cursor-pointer hover:shadow-sm transition-all"
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
                          <p className="text-xs text-muted-foreground">{task.grade}</p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          View →
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              {selectedTask?.time && `Estimated time: ${selectedTask.time}`}
              {selectedTask?.due && `Due: ${selectedTask.due}`}
              {selectedTask?.grade && `Grade: ${selectedTask.grade}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedTask?.description}</p>
            </div>

            {selectedTask?.objectives && selectedTask.objectives.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Learning Objectives</h4>
                <ul className="space-y-1.5">
                  {selectedTask.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              className="w-full mt-2"
              size="lg"
              onClick={() => {
                if (selectedTask) {
                  navigate(`/assistant?task=${encodeURIComponent(selectedTask.title)}`);
                }
              }}
            >
              <Brain className="h-4 w-4 mr-2" />
              Launch AI Assistant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SubjectDetails;
