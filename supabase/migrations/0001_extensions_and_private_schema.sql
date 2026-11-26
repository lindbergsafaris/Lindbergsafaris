-- ============================================================================
-- Migration: 0001_extensions_and_private_schema.sql
-- Description: Enable required extensions, create private schema, and establish
--              security definer role verification functions with search_path=''.
-- ============================================================================

-- 1. Enable Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Isolated Private Schema
CREATE SCHEMA IF NOT EXISTS private;

-- Restrict schema access: only authenticated users and service_role can use it.
-- Anonymous / public users have no access to the private schema.
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- 3. Define Role Verification Helper Functions
-- Both functions are STABLE, SECURITY DEFINER, with search_path = '' and fully qualified names.
-- They reside in the private schema so they are NOT exposed over PostgREST / RPC.

CREATE OR REPLACE FUNCTION private.is_cms_user() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION private.is_cms_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

-- Grant execution permissions only to authenticated CMS staff and service role
REVOKE ALL ON FUNCTION private.is_cms_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_cms_user() FROM anon;
GRANT EXECUTE ON FUNCTION private.is_cms_user() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_cms_user() TO service_role;

REVOKE ALL ON FUNCTION private.is_cms_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_cms_admin() FROM anon;
GRANT EXECUTE ON FUNCTION private.is_cms_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_cms_admin() TO service_role;
