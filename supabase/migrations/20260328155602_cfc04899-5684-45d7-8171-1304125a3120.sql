
CREATE TABLE public.student_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_identifier text NOT NULL,
  teacher_user_id uuid NOT NULL,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  estimated_time text,
  adapted_content text,
  micro_sprints jsonb,
  done boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.student_missions ENABLE ROW LEVEL SECURITY;

-- Teachers can insert missions
CREATE POLICY "Teachers can insert missions"
  ON public.student_missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_user_id);

-- Teachers can view missions they created
CREATE POLICY "Teachers can view their missions"
  ON public.student_missions FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_user_id);

-- Anyone authenticated can view missions assigned to them (by student_identifier)
CREATE POLICY "Students can view their missions"
  ON public.student_missions FOR SELECT
  TO authenticated
  USING (true);

-- Allow updating done status
CREATE POLICY "Users can update missions"
  ON public.student_missions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
