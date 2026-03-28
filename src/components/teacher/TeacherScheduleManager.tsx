import { Calendar, Clock, BookOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const scheduleData = [
  { day: "Monday", lessons: [
    { time: "08:30–09:30", subject: "Mathematics", class: "6A" },
    { time: "10:00–11:00", subject: "Swedish", class: "6B" },
    { time: "13:00–14:00", subject: "English", class: "6A" },
  ]},
  { day: "Tuesday", lessons: [
    { time: "08:30–09:30", subject: "Biology", class: "6A" },
    { time: "10:00–11:00", subject: "Mathematics", class: "6C" },
  ]},
  { day: "Wednesday", lessons: [
    { time: "09:00–10:00", subject: "Swedish", class: "6A" },
    { time: "11:00–12:00", subject: "English", class: "6B" },
    { time: "13:00–14:30", subject: "Physics", class: "6A" },
  ]},
  { day: "Thursday", lessons: [
    { time: "08:30–09:30", subject: "Mathematics", class: "6B" },
    { time: "10:00–11:00", subject: "Biology", class: "6C" },
  ]},
  { day: "Friday", lessons: [
    { time: "09:00–10:00", subject: "Swedish", class: "6C" },
    { time: "11:00–12:00", subject: "Mathematics", class: "6A" },
  ]},
];

const lessonPlans = [
  { title: "Fractions & Decimals", subject: "Mathematics", class: "6A", status: "Ready" },
  { title: "Reading Comprehension", subject: "Swedish", class: "6B", status: "Draft" },
  { title: "Cell Biology", subject: "Biology", class: "6A", status: "Ready" },
  { title: "Creative Writing", subject: "English", class: "6A", status: "In Progress" },
];

const TeacherScheduleManager = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Schedule
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Your teaching schedule for this week</p>
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
                <div key={i} className="p-2 rounded-lg bg-primary/5 border border-primary/10 space-y-1">
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
    </div>
  );
};

export default TeacherScheduleManager;
