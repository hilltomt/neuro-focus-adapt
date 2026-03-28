DROP POLICY IF EXISTS "Teachers can insert lesson files" ON public.lesson_files;
DROP POLICY IF EXISTS "Teachers can view their lesson files" ON public.lesson_files;
DROP POLICY IF EXISTS "Students can view all lesson files" ON public.lesson_files;

CREATE POLICY "Anyone can upload lesson files"
ON public.lesson_files
FOR INSERT
TO public
WITH CHECK (
  teacher_user_id IS NOT NULL
  AND subject <> ''
  AND class <> ''
  AND file_name <> ''
  AND file_url <> ''
);

CREATE POLICY "Anyone can view lesson files"
ON public.lesson_files
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public can upload lesson-files" ON storage.objects;

CREATE POLICY "Public can upload lesson-files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'lesson-files');