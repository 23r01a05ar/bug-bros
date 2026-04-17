-- ========================================
-- BUG BROS — STORAGE BUCKETS & POLICIES
-- Run AFTER rls_policies.sql
-- ========================================

-- ========================================
-- CREATE BUCKETS
-- ========================================

-- Resumes: private read, admin write
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Profile images: public read
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Project assets: public read
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STORAGE POLICIES — RESUMES (private)
-- ========================================

-- Admin can upload resumes
CREATE POLICY "Admin can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes' AND
    public.is_admin()
  );

-- Admin can read resumes
CREATE POLICY "Admin can read resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    public.is_admin()
  );

-- Authenticated users can read their own resume
CREATE POLICY "Users can read own resume"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin can delete resumes
CREATE POLICY "Admin can delete resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    public.is_admin()
  );

-- Admin can update resumes
CREATE POLICY "Admin can update resumes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'resumes' AND
    public.is_admin()
  );

-- ========================================
-- STORAGE POLICIES — PROFILE IMAGES (public read)
-- ========================================

-- Anyone can view profile images
CREATE POLICY "Public can view profile images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

-- Admin can upload profile images
CREATE POLICY "Admin can upload profile images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-images' AND
    public.is_admin()
  );

-- Admin can delete profile images
CREATE POLICY "Admin can delete profile images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND
    public.is_admin()
  );

-- Admin can update profile images
CREATE POLICY "Admin can update profile images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'profile-images' AND
    public.is_admin()
  );

-- ========================================
-- STORAGE POLICIES — PROJECT ASSETS (public read)
-- ========================================

-- Anyone can view project assets
CREATE POLICY "Public can view project assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-assets');

-- Admin can upload project assets
CREATE POLICY "Admin can upload project assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-assets' AND
    public.is_admin()
  );

-- Admin can delete project assets
CREATE POLICY "Admin can delete project assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-assets' AND
    public.is_admin()
  );

-- Admin can update project assets
CREATE POLICY "Admin can update project assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'project-assets' AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'project-assets' AND
    public.is_admin()
  );
