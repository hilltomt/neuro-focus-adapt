import { useState } from "react";
import { Brain, LayoutDashboard, BookOpen, Wand2, History, TrendingUp, Settings, LogOut, Sparkles, Calendar, FileText, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const studentNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "subjects", label: "My Subjects", icon: BookOpen },
  { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const teacherNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule & Lessons", icon: Calendar },
  { id: "adapt", label: "Adapt Content", icon: Wand2 },
  { id: "journals", label: "Student Journals", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export type ViewRole = "student" | "teacher";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSignOut: () => void;
  activeRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, onSignOut, activeRole, onRoleChange }: DashboardSidebarProps) => {
  const navItems = activeRole === "teacher" ? teacherNav : studentNav;

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-lg font-bold text-sidebar-foreground">NEURO</span>
        </div>
        <Select value={activeRole} onValueChange={(v) => onRoleChange(v as ViewRole)}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student View</SelectItem>
            <SelectItem value="teacher">Teacher View</SelectItem>
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} className="cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
