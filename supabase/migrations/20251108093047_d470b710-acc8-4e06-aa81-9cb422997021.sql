-- Create role enum
CREATE TYPE app_role AS ENUM ('admin', 'teacher', 'student');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_photo_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Link existing students table to auth
ALTER TABLE students ADD COLUMN user_id UUID REFERENCES auth.users(id) UNIQUE;
ALTER TABLE students ADD COLUMN profile_photo_url TEXT;

-- Link existing teachers table to auth
ALTER TABLE teachers ADD COLUMN user_id UUID REFERENCES auth.users(id) UNIQUE;
ALTER TABLE teachers ADD COLUMN profile_photo_url TEXT;

-- Security definer function for role checking (prevents RLS recursion)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON user_roles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins and teachers can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'teacher')
  );

-- Update Students RLS policies
DROP POLICY IF EXISTS "Enable read access for all" ON students;
DROP POLICY IF EXISTS "Enable insert access for all" ON students;
DROP POLICY IF EXISTS "Enable update access for all" ON students;
DROP POLICY IF EXISTS "Enable delete access for all" ON students;

CREATE POLICY "Admins can manage all students"
  ON students FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage students"
  ON students FOR ALL
  USING (has_role(auth.uid(), 'teacher'));

CREATE POLICY "Students can view own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

-- Update Teachers RLS policies
DROP POLICY IF EXISTS "Enable read access for all" ON teachers;
DROP POLICY IF EXISTS "Enable insert access for all" ON teachers;
DROP POLICY IF EXISTS "Enable update access for all" ON teachers;
DROP POLICY IF EXISTS "Enable delete access for all" ON teachers;

CREATE POLICY "Admins can manage all teachers"
  ON teachers FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view all teachers"
  ON teachers FOR SELECT
  USING (has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can view own record"
  ON teachers FOR SELECT
  USING (user_id = auth.uid());

-- Update Marks RLS policies
DROP POLICY IF EXISTS "Enable read access for all" ON marks;
DROP POLICY IF EXISTS "Enable insert access for all" ON marks;
DROP POLICY IF EXISTS "Enable update access for all" ON marks;
DROP POLICY IF EXISTS "Enable delete access for all" ON marks;

CREATE POLICY "Admins and teachers can manage marks"
  ON marks FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Students can view own marks"
  ON marks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = marks.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Update Attendance RLS policies
DROP POLICY IF EXISTS "Enable read access for all" ON attendance;
DROP POLICY IF EXISTS "Enable insert access for all" ON attendance;
DROP POLICY IF EXISTS "Enable update access for all" ON attendance;
DROP POLICY IF EXISTS "Enable delete access for all" ON attendance;

CREATE POLICY "Admins and teachers can manage attendance"
  ON attendance FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Announcements remain public read, admin-only write
DROP POLICY IF EXISTS "Enable read access for all" ON announcements;
DROP POLICY IF EXISTS "Enable insert access for all" ON announcements;
DROP POLICY IF EXISTS "Enable update access for all" ON announcements;
DROP POLICY IF EXISTS "Enable delete access for all" ON announcements;

CREATE POLICY "Everyone can view announcements"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();