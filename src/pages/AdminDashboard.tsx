import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, LogOut, Loader2 } from 'lucide-react';
import StudentsManager from '@/components/admin/StudentsManager';
import TeachersManager from '@/components/admin/TeachersManager';
import MarksManager from '@/components/admin/MarksManager';
import AttendanceManager from '@/components/admin/AttendanceManager';
import AnnouncementsManager from '@/components/admin/AnnouncementsManager';

const AdminDashboard = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/'); // Redirect non-admins
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Bansal Institute of Engineering and Technology</h1>
                <p className="text-sm text-muted-foreground">Department of AIML - Admin Dashboard</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="marks">Marks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsManager />
          </TabsContent>

          <TabsContent value="teachers">
            <TeachersManager />
          </TabsContent>

          <TabsContent value="marks">
            <MarksManager />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceManager />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsManager />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t mt-12">
        © @ananta
      </footer>
    </div>
  );
};

export default AdminDashboard;
