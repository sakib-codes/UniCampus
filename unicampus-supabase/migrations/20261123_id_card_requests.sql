-- Live ID Card Issuance, Reissue Payment & Admin Print Queue
CREATE TABLE IF NOT EXISTS public.id_card_requests (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  department_code TEXT NOT NULL,
  department_name TEXT NOT NULL,
  section TEXT,
  semester_name TEXT,
  designation TEXT,
  phone TEXT,
  emergency_phone TEXT,
  blood_group TEXT,
  photo_url TEXT,
  valid_through TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('initial', 'reissue')),
  reason TEXT NOT NULL,
  reason_note TEXT,
  fee_amount INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'free' CHECK (payment_status IN ('free', 'pending', 'paid')),
  payment_method TEXT,
  payment_trx_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued_for_print' CHECK (status IN ('payment_pending', 'queued_for_print', 'printing', 'ready_for_pickup', 'collected')),
  handled_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_id_card_requests_academic_id ON public.id_card_requests (academic_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_id_card_requests_dept_status ON public.id_card_requests (department_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_id_card_requests_user_id ON public.id_card_requests (user_id);

ALTER TABLE public.id_card_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "id_card_requests_select_own_or_admin" ON public.id_card_requests;
CREATE POLICY "id_card_requests_select_own_or_admin"
  ON public.id_card_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "id_card_requests_insert_own" ON public.id_card_requests;
CREATE POLICY "id_card_requests_insert_own"
  ON public.id_card_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "id_card_requests_update_admin" ON public.id_card_requests;
CREATE POLICY "id_card_requests_update_admin"
  ON public.id_card_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'id_card_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.id_card_requests;
  END IF;
END $$;
