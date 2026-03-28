import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const mockTasks: Record<string, { current: { id: string; title: string; time: string }[]; upcoming: { id: string; title: string; due: string }[]; completed: { id: string; title: string; grade: string }[] }> = {
  mathematics: {
    current: [
      { id: "1", title: "Math: Fractions Worksheet", time: "15 min" },
      { id: "2", title: "Math: Geometry Basics", time: "20 min" },
    ],
    upcoming: [
      { id: "3", title: "Algebra Introduction", due: "Apr 2" },
      { id: "4", title: "Number Patterns Quiz", due: "Apr 5" },
    ],
    completed: [
      { id: "5", title: "Multiplication Tables", grade: "⭐ 92%" },
      { id: "6", title: "Addition & Subtraction Review", grade: "⭐ 88%" },
    ],
  },
  english: {
    current: [
      { id: "1", title: "English: Write 3 Sentences", time: "8 min" },
      { id: "2", title: "English: Reading Comprehension", time: "12 min" },
    ],
    upcoming: [
      { id: "3", title: "Vocabulary Quiz", due: "Apr 3" },
    ],
    completed: [
      { id: "5", title: "Spelling Test", grade: "⭐ 95%" },
    ],
  },
  history: {
    current: [
      { id: "1", title: "History Essay: Vikings", time: "25 min" },
      { id: "2", title: "History: Timeline Activity", time: "10 min" },
    ],
    upcoming: [
      { id: "3", title: "Ancient Egypt Project", due: "Apr 8" },
    ],
    completed: [
      { id: "5", title: "Roman Empire Quiz", grade: "⭐ 90%" },
    ],
  },
};

const defaultTasks = {
  current: [
    { id: "1", title: "Reading Assignment", time: "15 min" },
    { id: "2", title: "Practice Exercise", time: "10 min" },
  ],
  upcoming: [
    { id: "3", title: "Weekly Quiz", due: "Apr 4" },
  ],
  completed: [
    { id: "5", title: "Introduction Module", grade: "⭐ 85%" },
  ],
};

const SubjectDetails = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const displayName = subjectName
    ? subjectName.charAt(0).toUpperCase() + subjectName.slice(1).replace(/-/g, " ")
    : "Subject";

  const tasks = (subjectName && mockTasks[subjectName.toLowerCase()]) || defaultTasks;

  const handleTaskClick = (taskTitle: string) => {
    navigate(`/assistant?task=${encodeURIComponent(taskTitle)}`);
  };

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
                      onClick={() => handleTaskClick(task.title)}
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
                          Start →
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-3 mt-4">
                  {tasks.upcoming.map((task) => (
                    <Card key={task.id} className="opacity-80">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <CalendarClock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
                          <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-3 mt-4">
                  {tasks.completed.map((task) => (
                    <Card key={task.id} className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground line-through">{task.title}</h3>
                          <p className="text-xs text-muted-foreground">{task.grade}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SubjectDetails;
