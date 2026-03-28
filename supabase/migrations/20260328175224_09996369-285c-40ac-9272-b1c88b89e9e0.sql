
CREATE TABLE public.lesson_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  class TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lesson_files ENABLE ROW LEVEL SECURITY;

-- Teachers can insert their own files
CREATE POLICY "Teachers can insert lesson files"
ON public.lesson_files
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = teacher_user_id);

-- Teachers can view their own files
CREATE POLICY "Teachers can view their lesson files"
ON public.lesson_files
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_user_id);

-- Everyone can view lesson files (students need to see them)
CREATE POLICY "Students can view all lesson files"
ON public.lesson_files
FOR SELECT
TO authenticated
USING (true);

-- Teachers can delete their own files
CREATE POLICY "Teachers can delete their lesson files"
ON public.lesson_files
FOR DELETE
TO authenticated
USING (auth.uid() = teacher_user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_files;
