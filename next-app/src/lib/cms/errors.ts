export interface SupabaseErrorLike {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
}

/**
 * Translates Postgres / PostgREST / RLS / Auth errors into clear, human-friendly messages.
 */
export function formatCmsError(err: unknown, fallback = 'An unexpected error occurred.'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;

  const e = err as SupabaseErrorLike;
  const code = e.code || '';
  const msg = e.message || '';

  // RLS / Permission errors
  if (
    code === '42501' ||
    /row-level security/i.test(msg) ||
    /permission denied/i.test(msg) ||
    /insufficient_privilege/i.test(msg)
  ) {
    return 'You do not have permission to perform this action. Editors cannot delete records or manage users.';
  }

  // Unique constraint violations
  if (code === '23505' || /duplicate key/i.test(msg)) {
    if (/slug/i.test(msg)) {
      return 'A record with this URL slug already exists. Please choose a unique slug.';
    }
    if (/category/i.test(msg)) {
      return 'A themed package already exists for this category. Each category can only have one themed package.';
    }
    if (/old_path/i.test(msg)) {
      return 'A redirect from this old path already exists.';
    }
    if (/email/i.test(msg)) {
      return 'A user with this email address already exists.';
    }
    return 'This value must be unique and already exists in the database.';
  }

  // Foreign key violations
  if (code === '23503' || /foreign key/i.test(msg)) {
    if (/restrict/i.test(msg) || /destination_posts/i.test(msg)) {
      return 'Cannot delete this record because other items still reference it. Reassign or remove linked items first.';
    }
    return 'Referenced record was not found or cannot be deleted while linked.';
  }

  // Not-null constraint violations
  if (code === '23502' || /null value in column/i.test(msg)) {
    const match = msg.match(/column "([^"]+)"/i);
    if (match) {
      return `The field "${match[1].replace(/_/g, ' ')}" is required and cannot be empty.`;
    }
    return 'One or more required fields are missing.';
  }

  // Check constraint violations
  if (code === '23514' || /violates check constraint/i.test(msg)) {
    if (/slug/i.test(msg)) {
      return 'Slug must be lowercase letters, numbers, and hyphens only (e.g. "maasai-mara-safari").';
    }
    if (/image/i.test(msg) || /hero_image/i.test(msg) || /logo/i.test(msg) || /featured_image/i.test(msg)) {
      return 'Image must include a valid URL.';
    }
    if (/rating/i.test(msg)) {
      return 'Rating is outside the allowed range.';
    }
    if (/currency/i.test(msg)) {
      return 'Currency must be KES, USD, or EUR.';
    }
    return 'One of the values failed a database validation rule. Please review your inputs.';
  }

  return msg || fallback;
}
