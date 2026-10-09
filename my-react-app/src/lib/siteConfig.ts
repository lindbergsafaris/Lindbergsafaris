/**
 * Single source of truth for the canonical site URL.
 *
 * - In Vercel Production: set VITE_SITE_URL=https://www.lindbergsafaris.com
 * - Locally: falls back to the www default so local builds are consistent.
 *
 * IMPORTANT: Never use a bare "lindbergsafaris.com" string anywhere else in
 * the codebase. Import SITE_URL from this file instead.
 */
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  "https://www.lindbergsafaris.com";

export const SITE_NAME = "Lindberg Safaris";
