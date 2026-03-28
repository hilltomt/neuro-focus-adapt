import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar, { type ViewRole } from "@/components/DashboardSidebar";
import StudentDashboard from "@/components/student/StudentDashboard";
import SubjectsView from "@/components/student/SubjectsView";
import AIAssistantPlaceholder from "@/components/student/AIAssistantPlaceholder";
import ProgressView from "@/components/student/ProgressView";
import Adapt from "@/pages/Adapt";
import AdaptHistory from "@/pages/AdaptHistory";
import DashboardSettings from "@/pages/DashboardSettings";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";
import TeacherScheduleManager from "@/components/teacher/TeacherScheduleManager";
import TeacherJournals from "@/components/teacher/TeacherJournals";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || "dashboard");
  const [activeRole, setActiveRole] = useState<ViewRole>("student");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) setActiveSection(section);
  }, [searchParams]);

  const handleRoleChange = (role: ViewRole) => {
    setActiveRole(role);
    setActiveSection("dashboard");
  };

  const handleSectionChange = (section: string) => {
    if (section === "ai-assistant") {
      navigate("/assistant");
      return;
    }
    setActiveSection(section);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const renderStudentContent = () => {
    switch (activeSection) {
      case "subjects":
        return <SubjectsView />;
      case "ai-assistant":
        return <AIAssistantPlaceholder />;
      case "progress":
        return <ProgressView />;
      case "history":
        return <AdaptHistory embedded />;
      case "settings":
        return <DashboardSettings embedded />;
      default:
        return <StudentDashboard onSectionChange={handleSectionChange} />;
    }
  };

  const renderTeacherContent = () => {
    switch (activeSection) {
      case "schedule":
        return <TeacherScheduleManager />;
      case "adapt":
        return <Adapt embedded />;
      case "journals":
        return <TeacherJournals />;
      case "settings":
        return <DashboardSettings embedded />;
      default:
        return <TeacherDashboard onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onSignOut={handleSignOut}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-1" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
            {activeRole === "teacher" ? renderTeacherContent() : renderStudentContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
