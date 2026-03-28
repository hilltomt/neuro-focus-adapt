import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DashboardSettings = ({ embedded }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, school_name, subject_area")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setSchoolName(data.school_name || "");
          setSubjectArea(data.subject_area || "");
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, school_name: schoolName, subject_area: subjectArea })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  if (loading) {
    const loader = <div className="text-muted-foreground animate-pulse">Loading...</div>;
    if (embedded) return loader;
    return <DashboardLayout>{loader}</DashboardLayout>;
  }

  const content = (
      <div className="max-w-lg">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground mb-8">Manage your profile.</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School / Institution</Label>
                <Input
                  id="school"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Lincoln Elementary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Area</Label>
                <Input
                  id="subject"
                  value={subjectArea}
                  onChange={(e) => setSubjectArea(e.target.value)}
                  placeholder="Mathematics, English, etc."
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );

  if (embedded) return content;
  return <DashboardLayout>{content}</DashboardLayout>;
};

export default DashboardSettings;
