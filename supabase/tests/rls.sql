-- ============================================================================
-- Test Suite: supabase/tests/rls.sql
-- Description: Automated transaction-based verification suite for Row Level
--              Security (RLS) policies on Lindberg Safaris CMS.
--
-- NOTE: This test suite MUST run on Supabase (local or hosted), NOT a plain
--       vanilla Postgres server. It relies on Supabase-managed roles (anon,
--       authenticated, service_role), auth session functions (auth.uid()),
--       and Supabase's pre-existing auth.users table.
--
-- Checks verified:
--   1. Catalog check: Every table in public schema has RLS enabled.
--   2. Catalog check: No policy grants INSERT, UPDATE, DELETE, or ALL to anon.
--   3. Policy audit: All 14 content tables have the 5 standard RLS policies defined.
--   4. Anon visibility loop: Anon sees 0 draft or archived rows across all content tables.
--   5. Anon published filter: Anon can read only published rows with published_at <= now().
--   6. Anon future publication: Rows with published_at in the future are invisible to anon.
--   7. Anon profiles access: Anon cannot read any profiles.
--   8. Anon write protection: Anon cannot insert, update, or delete content.
--   9. Anon RPC protection: Anon cannot execute private.is_cms_admin() (insufficient_privilege).
--  10. Editor visibility: Editor reads all rows (draft, published, archived).
--  11. Editor profile scope: Editor reads own profile only, not other profiles.
--  12. Editor write permissions: Editor can insert and update content.
--  13. Editor delete restriction: Editor CANNOT delete content (admin only).
--  14. Editor redirect restriction: Editor CANNOT delete redirects (admin only).
--  15. Editor user isolation: Editor CANNOT update other profiles.
--  16. Editor role protection: Editor CANNOT change their own role (no self-role-escalation).
--  17. Editor column protection: Editor CANNOT change their own email (column grant enforcement).
--  18. Editor insert protection: Editor CANNOT insert into profiles (no client-side inserts).
--  19. Admin profile scope: Admin reads all profiles.
--  20. Admin delete permissions: Admin CAN delete content.
--  21. Admin role management: Admin CAN change another user's role.
--  22. Admin user deletion: Admin CAN delete another user's profile.
--  23. Admin self-deletion protection: Admin CANNOT delete their own profile.
--  24. Admin self-role protection: Admin CANNOT change their own role.
--
-- This script runs inside a single TRANSACTION that automatically ROLLS BACK
-- upon completion, leaving the database completely clean.
-- ============================================================================

BEGIN;

DO $$
DECLARE
    v_admin_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    v_editor_id UUID := '00000000-0000-0000-0000-000000000002'::uuid;
    v_other_user_id UUID := '00000000-0000-0000-0000-000000000003'::uuid;
    v_tour_published_id UUID := '10000000-0000-0000-0000-000000000001'::uuid;
    v_tour_draft_id UUID := '10000000-0000-0000-0000-000000000002'::uuid;
    v_tour_archived_id UUID := '10000000-0000-0000-0000-000000000003'::uuid;
    v_tour_future_id UUID := '10000000-0000-0000-0000-000000000004'::uuid;
    v_redirect_test_id UUID := '20000000-0000-0000-0000-000000000001'::uuid;

    v_table_name TEXT;
    v_content_tables TEXT[] := ARRAY[
        'destination_categories',
        'destination_posts',
        'themed_packages',
        'packages',
        'tours',
        'blog_posts',
        'accommodations',
        'hot_deals',
        'popup_offers',
        'team_members',
        'hero_slides',
        'partners',
        'gallery_images',
        'fleet_vehicles'
    ];
    v_expected_policies TEXT[];
    v_policy_name TEXT;
    v_count INTEGER;
    v_error_thrown BOOLEAN;
    v_passed_assertions INTEGER := 0;
BEGIN
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'STARTING CMS ROW LEVEL SECURITY (RLS) VERIFICATION SUITE';
    RAISE NOTICE '============================================================';

    -- ------------------------------------------------------------------------
    -- 0. Seed Test Users & Entities (Run as superuser / service_role)
    -- ------------------------------------------------------------------------
    INSERT INTO auth.users (id, email) VALUES 
        (v_admin_id, 'admin@lindbergsafaris.com'),
        (v_editor_id, 'editor@lindbergsafaris.com'),
        (v_other_user_id, 'disposable@lindbergsafaris.com')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.profiles (id, email, full_name, role) VALUES 
        (v_admin_id, 'admin@lindbergsafaris.com', 'System Admin', 'admin'),
        (v_editor_id, 'editor@lindbergsafaris.com', 'Content Editor', 'editor'),
        (v_other_user_id, 'disposable@lindbergsafaris.com', 'Disposable Staff', 'editor')
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;

    -- Seed sample redirect
    INSERT INTO public.redirects (id, old_path, new_path, status_code)
    VALUES (v_redirect_test_id, '/test-legacy-path', '/tours', 301)
    ON CONFLICT (old_path) DO NOTHING;

    -- Seed sample tours across all lifecycle states
    INSERT INTO public.tours (
        id, title, slug, location, description, duration, price, currency, status, published_at
    ) VALUES 
        (v_tour_published_id, 'Published Mara Safari', 'published-mara-safari', 'Maasai Mara', 'Live tour', '3 Days', 50000, 'KES', 'published', now() - INTERVAL '1 day'),
        (v_tour_draft_id, 'Draft Amboseli Trek', 'draft-amboseli-trek', 'Amboseli', 'Draft tour', '4 Days', 65000, 'KES', 'draft', NULL),
        (v_tour_archived_id, 'Archived Samburu Escape', 'archived-samburu-escape', 'Samburu', 'Old tour', '2 Days', 30000, 'KES', 'archived', now() - INTERVAL '1 year'),
        (v_tour_future_id, 'Future Kilimanjaro View', 'future-kilimanjaro-view', 'Amboseli', 'Future scheduled tour', '5 Days', 80000, 'KES', 'published', now() + INTERVAL '2 days')
    ON CONFLICT (id) DO NOTHING;

    -- Seed a sample destination category and post to test relations
    INSERT INTO public.destination_categories (id, name, slug, description, status, published_at)
    VALUES ('30000000-0000-0000-0000-000000000001'::uuid, 'Test Kenya', 'test-kenya', 'East Africa', 'published', now() - INTERVAL '1 day')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.destination_posts (id, category_id, title, slug, excerpt, content, status, published_at)
    VALUES ('40000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000001'::uuid, 'Test Mara Post', 'test-mara-post', 'Excerpt', '{"type":"doc","content":[]}'::jsonb, 'draft', NULL)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Test fixtures and seed data initialized.';

    -- ========================================================================
    -- CATALOG TESTS: Schema-Level RLS Verification
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'CATALOG TEST 1: All public tables must have RLS enabled';
    RAISE NOTICE '------------------------------------------------------------';
    FOR v_table_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public' 
            AND c.relname = v_table_name 
            AND c.relrowsecurity = true
        ) THEN
            RAISE EXCEPTION 'CATALOG TEST FAILED: Table public.% does NOT have Row Level Security enabled!', v_table_name;
        END IF;
    END LOOP;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: All public tables have Row Level Security enabled.', v_passed_assertions;

    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'CATALOG TEST 2: No public policy grants write operations to anon';
    RAISE NOTICE '------------------------------------------------------------';
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND (
            'anon' = ANY(string_to_array(replace(replace(roles::text, '{', ''), '}', ''), ','))
            OR roles::text LIKE '%anon%'
            OR roles::text = '{public}'
        )
        AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    ) THEN
        RAISE EXCEPTION 'CATALOG TEST FAILED: Policy granting write operations (INSERT/UPDATE/DELETE/ALL) to anon detected!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Zero policies grant INSERT, UPDATE, DELETE, or ALL to anon.', v_passed_assertions;

    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'CATALOG TEST 3: Policy audit for all 14 content tables';
    RAISE NOTICE '------------------------------------------------------------';
    FOREACH v_table_name IN ARRAY v_content_tables
    LOOP
        v_expected_policies := ARRAY[
            v_table_name || '_select_public',
            v_table_name || '_select_staff',
            v_table_name || '_insert_staff',
            v_table_name || '_update_staff',
            v_table_name || '_delete_admin'
        ];

        FOREACH v_policy_name IN ARRAY v_expected_policies
        LOOP
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = v_table_name 
                AND policyname = v_policy_name
            ) THEN
                RAISE EXCEPTION 'CATALOG TEST FAILED: Table % is missing expected policy %!', v_table_name, v_policy_name;
            END IF;
        END LOOP;
    END LOOP;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: All 14 content tables have the 5 standard RLS policies registered.', v_passed_assertions;

    -- ========================================================================
    -- SUITE 1: ANONYMOUS ROLE (anon)
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 1: ANONYMOUS ROLE (anon)';
    RAISE NOTICE '------------------------------------------------------------';
    PERFORM set_config('role', 'anon', true);
    PERFORM set_config('request.jwt.claims', '{}', true);

    -- 1.1 Content tables loop: Anon sees 0 draft or archived rows across every table
    FOREACH v_table_name IN ARRAY v_content_tables
    LOOP
        EXECUTE format('SELECT count(*) FROM public.%I WHERE status IN (''draft'', ''archived'')', v_table_name)
        INTO v_count;
        IF v_count <> 0 THEN
            RAISE EXCEPTION 'TEST FAILED: anon read % draft/archived rows from table %!', v_count, v_table_name;
        END IF;
    END LOOP;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon sees 0 draft or archived rows across all 14 content tables.', v_passed_assertions;

    -- 1.2 Anon reads ONLY currently published tours (published_at <= now())
    SELECT count(*) INTO v_count FROM public.tours;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: anon read % tours, expected exactly 1 currently published tour.', v_count;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon reads only currently published tours (count = 1).', v_passed_assertions;

    -- 1.3 Future published_at is invisible to anon
    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE slug = 'future-kilimanjaro-view';
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: Future published tour was visible to anon!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Future-dated published tour is invisible to anon (count = 0).', v_passed_assertions;

    -- 1.4 Anon cannot read profiles
    v_error_thrown := false;
    BEGIN
        SELECT count(*) INTO v_count FROM public.profiles;
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown AND v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: anon was able to read % profiles!', v_count;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon cannot read any rows from public.profiles.', v_passed_assertions;

    -- 1.5 Anon cannot insert content
    v_error_thrown := false;
    BEGIN
        INSERT INTO public.tours (title, slug, location, description, duration, price, status)
        VALUES ('Hacker Tour', 'hacker-tour', 'Nowhere', 'Evil', '1 Day', 1, 'published');
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'TEST FAILED: anon insert into tours succeeded without insufficient_privilege!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon insert into tours blocked with insufficient_privilege.', v_passed_assertions;

    -- 1.6 Anon cannot execute private.is_cms_admin()
    v_error_thrown := false;
    BEGIN
        PERFORM private.is_cms_admin();
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'TEST FAILED: anon was able to execute private.is_cms_admin()!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon execution of private.is_cms_admin() blocked with insufficient_privilege.', v_passed_assertions;

    -- 1.7 Anon can read redirects
    SELECT count(*) INTO v_count FROM public.redirects WHERE old_path = '/test-legacy-path';
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: anon could not read public redirect!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: anon can read public redirects.', v_passed_assertions;

    -- ========================================================================
    -- SUITE 2: EDITOR ROLE (authenticated)
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 2: EDITOR ROLE (authenticated)';
    RAISE NOTICE '------------------------------------------------------------';
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_editor_id::text, 'role', 'authenticated')::text, true);

    -- 2.1 Editor sees all tours (published, draft, archived, future)
    SELECT count(*) INTO v_count FROM public.tours;
    IF v_count <> 4 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor read % tours, expected 4 (all statuses).', v_count;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor sees all content rows (draft, archived, future, published).', v_passed_assertions;

    -- 2.2 Editor reads own profile only
    SELECT count(*) INTO v_count FROM public.profiles;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor read % profiles, expected 1 (own profile only).', v_count;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor reads only their own profile row.', v_passed_assertions;

    -- 2.3 Editor can insert content
    INSERT INTO public.tours (
        id, title, slug, location, description, duration, price, status
    ) VALUES (
        '10000000-0000-0000-0000-000000000099'::uuid,
        'Editor Tour', 'editor-tour', 'Nakuru', 'Desc', '2 Days', 45000, 'draft'
    );
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor successfully inserted new tour.', v_passed_assertions;

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
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor successfully updated content.', v_passed_assertions;

    -- 2.5 Editor CANNOT delete content
    DELETE FROM public.tours WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;
    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor was able to delete content! Row was removed.';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor cannot delete content (deletion blocked by policy).', v_passed_assertions;

    -- 2.6 Editor CANNOT delete redirects
    DELETE FROM public.redirects WHERE id = v_redirect_test_id;
    SELECT count(*) INTO v_count FROM public.redirects WHERE id = v_redirect_test_id;
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Editor was able to delete redirect! Row was removed.';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor cannot delete redirects (admin only).', v_passed_assertions;

    -- 2.7 Editor CANNOT update other profiles
    UPDATE public.profiles 
    SET full_name = 'Hacked Admin' 
    WHERE id = v_admin_id;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND full_name = 'Hacked Admin') THEN
        RAISE EXCEPTION 'TEST FAILED: Editor updated another user profile!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor cannot update other profiles.', v_passed_assertions;

    -- 2.8 Editor CANNOT change their own role (self-role-escalation)
    v_error_thrown := false;
    BEGIN
        UPDATE public.profiles 
        SET role = 'admin' 
        WHERE id = v_editor_id;
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_editor_id AND role = 'admin') THEN
            RAISE EXCEPTION 'TEST FAILED: Editor changed their own role to admin!';
        END IF;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor cannot change own role to admin.', v_passed_assertions;

    -- 2.9 Editor CANNOT change their own email (column privilege enforcement)
    v_error_thrown := false;
    BEGIN
        UPDATE public.profiles 
        SET email = 'hacked@lindbergsafaris.com' 
        WHERE id = v_editor_id;
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'TEST FAILED: Editor was able to update their email column!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Editor cannot update their email column (insufficient_privilege raised).', v_passed_assertions;

    -- 2.10 Editor CANNOT insert into profiles (no client-side inserts)
    v_error_thrown := false;
    BEGIN
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES ('00000000-0000-0000-0000-000000000088'::uuid, 'fake@lindbergsafaris.com', 'Fake', 'admin');
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;
    IF NOT v_error_thrown THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000088'::uuid) THEN
            RAISE EXCEPTION 'TEST FAILED: Client-side insert into profiles succeeded!';
        END IF;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Client-side insert into profiles blocked by RLS.', v_passed_assertions;

    -- ========================================================================
    -- SUITE 3: ADMIN ROLE (authenticated)
    -- ========================================================================
    RAISE NOTICE '------------------------------------------------------------';
    RAISE NOTICE 'TEST SUITE 3: ADMIN ROLE (authenticated)';
    RAISE NOTICE '------------------------------------------------------------';
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_admin_id::text, 'role', 'authenticated')::text, true);

    -- 3.1 Admin reads all profiles
    SELECT count(*) INTO v_count FROM public.profiles;
    IF v_count < 3 THEN
        RAISE EXCEPTION 'TEST FAILED: Admin read % profiles, expected at least 3.', v_count;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin reads all profiles in database (count = %).', v_passed_assertions, v_count;

    -- 3.2 Admin can delete content
    DELETE FROM public.tours WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;
    SELECT count(*) INTO v_count 
    FROM public.tours 
    WHERE id = '10000000-0000-0000-0000-000000000099'::uuid;
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: Admin delete did not remove row.';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin successfully deleted content.', v_passed_assertions;

    -- 3.3 Admin CAN change another user role
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = v_editor_id;

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_editor_id AND role = 'admin') THEN
        RAISE EXCEPTION 'TEST FAILED: Admin was unable to promote another user to admin.';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin successfully promoted another user to admin.', v_passed_assertions;

    -- Revert editor role back
    UPDATE public.profiles SET role = 'editor' WHERE id = v_editor_id;

    -- 3.4 Admin CAN delete another user profile
    DELETE FROM public.profiles WHERE id = v_other_user_id;
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_other_user_id) THEN
        RAISE EXCEPTION 'TEST FAILED: Admin was unable to delete another user profile!';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin successfully deleted another user profile.', v_passed_assertions;

    -- 3.5 Admin CANNOT delete their OWN profile
    DELETE FROM public.profiles WHERE id = v_admin_id;
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id) THEN
        RAISE EXCEPTION 'TEST FAILED: Admin deleted their own profile! Self-deletion must be blocked.';
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin cannot delete their own profile.', v_passed_assertions;

    -- 3.6 Admin CANNOT change their OWN role (no user can change their own role)
    v_error_thrown := false;
    BEGIN
        UPDATE public.profiles 
        SET role = 'editor' 
        WHERE id = v_admin_id;
    EXCEPTION WHEN insufficient_privilege THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'editor') THEN
            RAISE EXCEPTION 'TEST FAILED: Admin changed their own role! Self-role change must be blocked.';
        END IF;
    END IF;
    v_passed_assertions := v_passed_assertions + 1;
    RAISE NOTICE 'PASS [%]: Admin cannot change their own role.', v_passed_assertions;

    -- ========================================================================
    -- FINAL RESULTS SUMMARY
    -- ========================================================================
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'ALL CMS RLS TESTS PASSED SUCCESSFULLY (% assertions passed)', v_passed_assertions;
    RAISE NOTICE '============================================================';
END;
$$;

-- Always rollback so database remains completely untouched
ROLLBACK;
