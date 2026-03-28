import { Users, BookOpen, Calendar, FileText, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeacherDashboardProps {
  onSectionChange: (section: string) => void;
}

const quickStats = [
  { label: "Active Students", value: "28", icon: Users, color: "text-primary" },
  { label: "Lessons This Week", value: "12", icon: Calendar, color: "text-accent" },
  { label: "Adaptations Made", value: "34", icon: BookOpen, color: "text-primary" },
  { label: "Journals Updated", value: "8", icon: FileText, color: "text-accent" },
];

const recentActivity = [
  { student: "Emma S.", action: "Completed reading assignment", subject: "Swedish", time: "10 min ago" },
  { student: "Omar K.", action: "Started math worksheet", subject: "Mathematics", time: "25 min ago" },
  { student: "Elsa M.", action: "Submitted journal entry", subject: "Biology", time: "1 hour ago" },
  { student: "Lucas P.", action: "Finished adapted text", subject: "English", time: "2 hours ago" },
];

const TeacherDashboard = ({ onSectionChange }: TeacherDashboardProps) => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Teacher Overview 👩‍🏫</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your students today.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-1`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Recent Student Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.student} — {activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.subject} · {activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Schedule & Lessons", desc: "Manage your weekly schedule", icon: Calendar, section: "schedule" },
          { label: "Adapt Content", desc: "Create adapted materials", icon: BookOpen, section: "adapt" },
          { label: "Student Journals", desc: "Review student journals", icon: FileText, section: "journals" },
        ].map((action) => (
          <Card
            key={action.section}
            className="cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => onSectionChange(action.section)}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-foreground">{action.label}</h3>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
