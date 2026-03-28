
-- Create storage bucket for teacher lesson files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-files', 'lesson-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload lesson files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lesson-files');

-- Allow authenticated users to read lesson files
CREATE POLICY "Authenticated users can read lesson files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'lesson-files');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own lesson files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'lesson-files' AND (storage.foldername(name))[1] = auth.uid()::text);
