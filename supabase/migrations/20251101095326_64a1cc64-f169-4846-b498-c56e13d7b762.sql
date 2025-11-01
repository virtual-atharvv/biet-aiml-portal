-- Create Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL DEFAULT 'AIML',
  semester INTEGER NOT NULL,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'AIML',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Marks table
CREATE TABLE public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  marks NUMERIC(5,2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Create Announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create public read policies (since we're using client-side admin auth)
CREATE POLICY "Enable read access for all" ON public.students FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all" ON public.students FOR DELETE USING (true);

CREATE POLICY "Enable read access for all" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all" ON public.teachers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all" ON public.marks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON public.marks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON public.marks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all" ON public.marks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all" ON public.attendance FOR DELETE USING (true);

CREATE POLICY "Enable read access for all" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all" ON public.announcements FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
BEFORE UPDATE ON public.teachers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marks_updated_at
BEFORE UPDATE ON public.marks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_students_roll_number ON public.students(roll_number);
CREATE INDEX idx_marks_student_id ON public.marks(student_id);
CREATE INDEX idx_marks_date ON public.marks(date);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);