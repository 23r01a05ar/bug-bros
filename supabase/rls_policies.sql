-- ========================================
-- BUG BROS — ROW LEVEL SECURITY POLICIES
-- Run AFTER schema.sql
-- ========================================

-- ========================================
-- HELPER: Check if current user is admin
-- ========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ========================================
-- USERS
-- ========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Public can read active users
CREATE POLICY "Public can view active users"
  ON public.users FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin can do everything
CREATE POLICY "Admin full access to users"
  ON public.users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Members can update their own row
CREATE POLICY "Members can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ========================================
-- PROJECTS
-- ========================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read all projects
CREATE POLICY "Public can view projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- ACHIEVEMENTS
-- ========================================
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view achievements"
  ON public.achievements FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- EXPERIENCES
-- ========================================
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view experiences"
  ON public.experiences FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to experiences"
  ON public.experiences FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- CONTRIBUTORS
-- ========================================
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view contributors"
  ON public.contributors FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to contributors"
  ON public.contributors FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- PARTICIPANTS
-- ========================================
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view participants"
  ON public.participants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to participants"
  ON public.participants FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- CONTACT MESSAGES
-- ========================================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit contact form)
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin can read and delete
CREATE POLICY "Admin can view messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ========================================
-- ABOUT CONTENT
-- ========================================
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view about content"
  ON public.about_content FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full CRUD
CREATE POLICY "Admin full access to about content"
  ON public.about_content FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
