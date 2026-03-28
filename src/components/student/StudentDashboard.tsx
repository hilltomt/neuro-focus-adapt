import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, Target, Zap, Clock, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
}

interface Mission {
  id: string;
  title: string;
  subject: string;
  time: string;
  done: boolean;
  adapted_content?: string | null;
}

const defaultMissions: Mission[] = [
  { id: "default-1", title: "Read Chapter 5 — Biology", subject: "Biology", time: "15 min", done: false },
  { id: "default-2", title: "Math worksheet: Fractions", subject: "Mathematics", time: "10 min", done: true },
  { id: "default-3", title: "Write 3 sentences — English", subject: "English", time: "8 min", done: false },
];

const StudentDashboard = ({ onSectionChange }: StudentDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [adaptationCount, setAdaptationCount] = useState(0);
  const [missions, setMissions] = useState<Mission[]>(defaultMissions);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, countRes, missionsRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
        supabase.from("adaptations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("student_missions").select("*").order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (countRes.count !== null) setAdaptationCount(countRes.count);

      if (missionsRes.data && missionsRes.data.length > 0) {
        const dbMissions: Mission[] = missionsRes.data.map((m: any) => ({
          id: m.id,
          title: m.title,
          subject: m.subject,
          time: m.estimated_time || "15 min",
          done: m.done,
          adapted_content: m.adapted_content,
        }));
        setMissions([...dbMissions, ...defaultMissions]);
      }
    };
    fetchData();
  }, [user]);

  const greeting = profile?.full_name
    ? `Hey, ${profile.full_name.split(" ")[0]}! 👋`
    : "Hey there! 👋";

  const completedMissions = missions.filter((m) => m.done).length;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{greeting}</h1>
        <p className="text-muted-foreground mt-1">Here's your day at a glance.</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{completedMissions}/{missions.length}</p>
            <p className="text-xs text-muted-foreground">Today's Missions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">42</p>
            <p className="text-xs text-muted-foreground">Stars Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{adaptationCount}</p>
            <p className="text-xs text-muted-foreground">Adapted Texts</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's missions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Today's Missions
            </span>
            <span className="text-xs font-normal text-muted-foreground">{completedMissions} of {missions.length} done</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => navigate(`/subject/${encodeURIComponent(mission.subject)}`)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                mission.done
                  ? "bg-primary/5 border-primary/20 opacity-70"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                mission.done ? "bg-primary/10" : "bg-muted"
              }`}>
                {mission.done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${mission.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {mission.title}
                </p>
                <p className="text-xs text-muted-foreground">{mission.subject} · {mission.time}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick action cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card
          className="cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => onSectionChange("subjects")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">My Subjects</h3>
              <p className="text-xs text-muted-foreground">View progress across all subjects</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-accent/30 transition-colors"
          onClick={() => onSectionChange("ai-assistant")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Get help with your learning</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
