import { useAuth } from '@/contexts/AuthContext';

export const useRole = () => {
  const { userRole, loading } = useAuth();

  return {
    role: userRole,
    isAdmin: userRole === 'admin',
    isTeacher: userRole === 'teacher',
    isStudent: userRole === 'student',
    loading,
  };
};