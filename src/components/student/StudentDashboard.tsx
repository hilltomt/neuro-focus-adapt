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

const todayMissions = [
  { id: 1, title: "Read Chapter 5 — Biology", subject: "Biology", time: "15 min", done: false },
  { id: 2, title: "Math worksheet: Fractions", subject: "Mathematics", time: "10 min", done: true },
  { id: 3, title: "Write 3 sentences — English", subject: "English", time: "8 min", done: false },
];

const StudentDashboard = ({ onSectionChange }: StudentDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [adaptationCount, setAdaptationCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, countRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
        supabase.from("adaptations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (countRes.count !== null) setAdaptationCount(countRes.count);
    };
    fetchData();
  }, [user]);

  const greeting = profile?.full_name
    ? `Hey, ${profile.full_name.split(" ")[0]}! 👋`
    : "Hey there! 👋";

  const completedMissions = todayMissions.filter((m) => m.done).length;

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
            <p className="text-2xl font-bold text-foreground">{completedMissions}/{todayMissions.length}</p>
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
            <span className="text-xs font-normal text-muted-foreground">{completedMissions} of {todayMissions.length} done</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {todayMissions.map((mission) => (
            <div
              key={mission.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
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
