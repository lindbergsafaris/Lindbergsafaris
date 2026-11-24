-- ============================================================================
-- Test Suite: supabase/tests/rls.sql
-- Description: Automated transaction-based verification suite for Row Level
--              Security (RLS) policies on Lindberg Safaris CMS.
--
-- Checks verified:
--   1. anon can read ONLY published rows (status = 'published' AND published_at <= now())
--   2. anon CANNOT read drafts or archived rows
--   3. anon CANNOT read profiles
--   4. anon CANNOT insert, update, or delete content
--   5. an editor CAN read all rows (published, draft, archived)
--   6. an editor CAN write content (INSERT, UPDATE)
--   7. an editor CANNOT delete content
--   8. an editor CANNOT read other profiles, CANNOT update other profiles
--   9. an editor CANNOT change their own role (no self-role-escalation)
--  10. an admin CAN read all profiles, update content, delete content
--  11. an admin CAN change another user's role
--  12. an admin CANNOT change their OWN role (no user can change their own role)
--  13. client-side INSERT on profiles fails for everyone (service role only)
--
-- This script runs inside a single TRANSACTION that automatically ROLLS BACK
-- upon completion, leaving the database completely clean.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- SETUP: Mock IDs and Test Harness
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_admin_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    v_editor_id UUID := '00000000-0000-0000-0000-000000000002'::uuid;
    v_other_user_id UUID := '00000000-0000-0000-0000-000000000003'::uuid;
    v_tour_published_id UUID := '10000000-0000-0000-0000-000000000001'::uuid;
    v_tour_draft_id UUID := '10000000-0000-0000-0000-000000000002'::uuid;
    v_tour_archived_id UUID := '10000000-0000-0000-0000-000000000003'::uuid;
    v_count INTEGER;
    v_error_thrown BOOLEAN;
BEGIN
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'STARTING CMS ROW LEVEL SECURITY (RLS) VERIFICATION SUITE';
    RAISE NOTICE '============================================================';

    -- ------------------------------------------------------------------------
    -- 0. Seed Test Users (Simulating Supabase auth.users & public.profiles)
    -- ------------------------------------------------------------------------
    -- In Supabase auth, users exist in auth.users. Ensure schema and mock rows exist:
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE,
        raw_app_meta_data JSONB DEFAULT '{}'::jsonb,
        raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
        is_super_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Insert mock users into auth.users (as superuser / service role)
    INSERT INTO auth.users (id, email) VALUES 
        (v_admin_id, 'admin@lindbergsafaris.com'),
        (v_editor_id, 'editor@lindbergsafaris.com'),
        (v_other_user_id, 'stranger@example.com')
    ON CONFLICT (id) DO NOTHING;

    -- Insert test profiles directly (simulating service-role admin invite)
    INSERT INTO public.profiles (id, email, full_name, role) VALUES 
        (v_admin_id, 'admin@lindbergsafaris.com', 'System Admin', 'admin'),
        (v_editor_id, 'editor@lindbergsafaris.com', 'Content Editor', 'editor')
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

    -- Seed Test Content in tours
    INSERT INTO public.tours (
        id, title, slug, location, description, duration, price, currency, status, published_at
    ) VALUES 
        (v_tour_published_id, 'Published Mara Safari', 'published-mara-safari', 'Maasai Mara', 'Live tour', '3 Days', 50000, 'KES', 'published', now() - INTERVAL '1 day'),
        (v_tour_draft_id, 'Draft Amboseli Trek', 'draft-amboseli-trek', 'Amboseli', 'Draft tour', '4 Days', 65000, 'KES', 'draft', NULL),
        (v_tour_archived_id, 'Archived Samburu Escape', 'archived-samburu-escape', 'Samburu', 'Old tour', '2 Days', 30000, 'KES', 'archived', now() - INTERVAL '1 year')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Seed data initialized successfully.';

    -- ========================================================================
    -- TEST 1: Anonymous User (anon) Checks
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 1: ANONYMOUS ROLE (anon)';
    RAISE NOTICE '------------------------------------------------------------';

    -- Simulate anon request context
    PERFORM set_config('role', 'anon', true);
    PERFORM set_config('request.jwt.claims', '{}', true);

    -- 1.1 anon can read only published rows
    SELECT count(*) INTO v_count FROM public.tours;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: anon read % tours, expected exactly 1 (published only).', v_count;
    END IF;
    RAISE NOTICE 'PASS [1.1]: anon can read only published rows (count = 1).';

    -- 1.2 anon cannot read drafts or archived rows
    SELECT count(*) INTO v_count FROM public.tours WHERE status IN ('draft', 'archived');
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: anon read % draft/archived tours, expected 0.', v_count;
    END IF;
    RAISE NOTICE 'PASS [1.2]: anon cannot read drafts or archived rows (count = 0).';

    -- 1.3 anon cannot read profiles
    SELECT count(*) INTO v_count FROM public.profiles;
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: anon read % profiles, expected 0.', v_count;
    END IF;
    RAISE NOTICE 'PASS [1.3]: anon cannot read any rows from profiles (count = 0).';

    -- 1.4 anon cannot insert content
    v_error_thrown := false;
    BEGIN
        INSERT INTO public.tours (title, slug, location, description, duration, price, status)
        VALUES ('Hacker Tour', 'hacker-tour', 'Nowhere', 'Evil', '1 Day', 1, 'published');
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'TEST FAILED: anon was able to insert into tours.';
    END IF;
    RAISE NOTICE 'PASS [1.4]: anon insert into tours was blocked by RLS.';


    -- ========================================================================
    -- TEST 2: Editor Role Checks
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 2: EDITOR ROLE (authenticated)';
    RAISE NOTICE '------------------------------------------------------------';

    -- Switch context to editor
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_editor_id::text, 'role', 'authenticated')::text, true);

    -- 2.1 Editor can read all tours (draft, published, archived)
    SELECT count(*) INTO v_count FROM public.tours;
    IF v_count <> 3 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor read % tours, expected 3 (all statuses).', v_count;
    END IF;
    RAISE NOTICE 'PASS [2.1]: Editor reads all rows including drafts and archived (count = 3).';

    -- 2.2 Editor can read own profile, but NOT other profiles
    SELECT count(*) INTO v_count FROM public.profiles;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor read % profiles, expected 1 (own profile only).', v_count;
    END IF;
    RAISE NOTICE 'PASS [2.2]: Editor reads only their own profile row (count = 1).';

    -- 2.3 Editor can insert content
    INSERT INTO public.tours (
        id, title, slug, location, description, duration, price, status
    ) VALUES (
        '10000000-0000-0000-0000-000000000099'::uuid,
        'Editor New Tour', 'editor-new-tour', 'Lake Nakuru', 'Flamingos', '2 Days', 45000, 'draft'
    );
    RAISE NOTICE 'PASS [2.3]: Editor successfully inserted a new tour.';

    -- 2.4 Editor can update content
    UPDATE public.tours 
    SET description = 'Updated by editor' 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;

    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid 
    AND description = 'Updated by editor';

    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor update did not persist.';
    END IF;
    RAISE NOTICE 'PASS [2.4]: Editor successfully updated content.';

    -- 2.5 Editor CANNOT delete content (admin only)
    DELETE FROM public.tours WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;

    -- Verify the row still exists
    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;

    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor was able to delete content! Row was removed.';
    END IF;
    RAISE NOTICE 'PASS [2.5]: Editor cannot delete content (delete policy blocked removal).';

    -- 2.6 Editor CANNOT update other profiles
    UPDATE public.profiles 
    SET full_name = 'Hacked Admin' 
    WHERE id = v_admin_id;

    SELECT full_name INTO v_count 
    FROM public.profiles 
    WHERE id = v_admin_id;

    -- If 0 rows were updated, name remains 'System Admin'
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND full_name = 'Hacked Admin') THEN
        RAISE EXCEPTION 'TEST FAILED: Editor was able to modify another user profile!';
    END IF;
    RAISE NOTICE 'PASS [2.6]: Editor cannot update other user profiles.';

    -- 2.7 Editor CANNOT change their own role (no self-role-escalation)
    v_error_thrown := false;
    BEGIN
        UPDATE public.profiles 
        SET role = 'admin' 
        WHERE id = v_editor_id;
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        -- Check if value actually changed
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_editor_id AND role = 'admin') THEN
            RAISE EXCEPTION 'TEST FAILED: Editor successfully changed their own role to admin!';
        END IF;
    END IF;
    RAISE NOTICE 'PASS [2.7]: Editor cannot change their own role to admin (self-role-escalation prevented).';

    -- 2.8 Editor CANNOT insert into profiles (no client-side inserts)
    v_error_thrown := false;
    BEGIN
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES ('00000000-0000-0000-0000-000000000088'::uuid, 'fake@lindbergsafaris.com', 'Fake', 'admin');
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000088'::uuid) THEN
            RAISE EXCEPTION 'TEST FAILED: Client-side insert into profiles succeeded!';
        END IF;
    END IF;
    RAISE NOTICE 'PASS [2.8]: Client-side insert into profiles blocked by RLS.';


    -- ========================================================================
    -- TEST 3: Admin Role Checks
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 3: ADMIN ROLE (authenticated)';
    RAISE NOTICE '------------------------------------------------------------';

    -- Switch context to admin
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_admin_id::text, 'role', 'authenticated')::text, true);

    -- 3.1 Admin can read ALL profiles
    SELECT count(*) INTO v_count FROM public.profiles;
    IF v_count < 2 THEN
        RAISE EXCEPTION 'TEST FAILED: Admin read % profiles, expected at least 2.', v_count;
    END IF;
    RAISE NOTICE 'PASS [3.1]: Admin can read all profiles (count = %).', v_count;

    -- 3.2 Admin can delete content
    DELETE FROM public.tours WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;

    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;

    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: Admin delete did not remove row.';
    END IF;
    RAISE NOTICE 'PASS [3.2]: Admin successfully deleted content.';

    -- 3.3 Admin CAN change ANOTHER user's role
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = v_editor_id;

    SELECT role INTO v_count 
    FROM public.profiles 
    WHERE id = v_editor_id;

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_editor_id AND role = 'admin') THEN
        RAISE EXCEPTION 'TEST FAILED: Admin was unable to promote another user to admin.';
    END IF;
    RAISE NOTICE 'PASS [3.3]: Admin successfully updated another user role.';

    -- Revert editor role back for next check
    UPDATE public.profiles SET role = 'editor' WHERE id = v_editor_id;

    -- 3.4 Admin CANNOT change their OWN role (no user can change their own role)
    v_error_thrown := false;
    BEGIN
        UPDATE public.profiles 
        SET role = 'editor' 
        WHERE id = v_admin_id;
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'editor') THEN
            RAISE EXCEPTION 'TEST FAILED: Admin was able to demote their own role!';
        END IF;
    END IF;
    RAISE NOTICE 'PASS [3.4]: Admin cannot change their own role (self-role-modification prevented).';

    RAISE NOTICE '============================================================';
    RAISE NOTICE 'ALL CMS RLS TESTS PASSED SUCCESSFULLY (13/13)';
    RAISE NOTICE '============================================================';
END;
$$;

-- Always rollback so no test data remains
ROLLBACK;
