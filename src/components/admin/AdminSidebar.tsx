
import { Link, useLocation } from "react-router-dom";
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
  SidebarProvider
} from "@/components/ui/sidebar";
import { Book, Calendar, BookOpen, Grid2x2, Users, Award } from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: Grid2x2
    },
    {
      title: "Exams",
      path: "/admin/exams",
      icon: Book
    },
    {
      title: "Years",
      path: "/admin/years",
      icon: Calendar
    },
    {
      title: "Subjects",
      path: "/admin/subjects",
      icon: BookOpen
    },
    {
      title: "Students",
      path: "/admin/students",
      icon: Users
    },
    {
      title: "Top Performers",
      path: "/admin/top-performers",
      icon: Award
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center py-4">
        <h2 className="text-xl font-bold">YodeduHub Admin</h2>
        <p className="text-sm text-muted-foreground">Exam Management System</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    isActive={isActive(item.path)} 
                    tooltip={item.title}
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
