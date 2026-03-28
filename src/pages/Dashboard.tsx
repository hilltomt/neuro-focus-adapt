import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wand2, History, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
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
    ? `Welcome back, ${profile.full_name.split(" ")[0]}!`
    : "Welcome back!";

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          {greeting}
        </h1>
        <p className="text-muted-foreground mb-8">
          Ready to make content more accessible for your students?
        </p>

        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardContent className="p-6">
              <Link to="/dashboard/adapt" className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Adapt Content</h3>
                  <p className="text-sm text-muted-foreground">Transform text for ADHD learners</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <Link to="/dashboard/history" className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">View History</h3>
                  <p className="text-sm text-muted-foreground">{adaptationCount} adaptations saved</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Adaptations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{adaptationCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Focus Area</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">ADHD</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground truncate">{user?.email}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
