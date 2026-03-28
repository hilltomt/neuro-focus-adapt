import { Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekActivity = [3, 5, 2, 4, 1, 0, 0]; // missions completed per day

const achievements = [
  { label: "First Adaptation", icon: Star, earned: true },
  { label: "3-Day Streak", icon: Flame, earned: true },
  { label: "10 Missions", icon: Trophy, earned: false },
  { label: "All Subjects", icon: TrendingUp, earned: false },
];

const ProgressView = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          My Progress
        </h2>
        <p className="text-sm text-muted-foreground mt-1">See how you're doing this week.</p>
      </div>

      {/* Weekly activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {weekDays.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end h-24">
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all"
                    style={{ height: `${(weekActivity[i] / 5) * 100}%`, minHeight: weekActivity[i] > 0 ? "8px" : "0" }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            {weekActivity.reduce((a, b) => a + b, 0)} missions completed this week
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors ${
                  a.earned
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-border opacity-50"
                }`}
              >
                <a.icon className={`h-6 w-6 ${a.earned ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs font-medium text-foreground">{a.label}</span>
                {a.earned && <span className="text-[10px] text-primary font-semibold">Earned ✓</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressView;
