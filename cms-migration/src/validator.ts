/**
 * validator.ts
 *
 * Pre-insert validation. Throws loudly before any DB write if required fields
 * are missing or constraints would be violated.
 */

import type { SanityDoc } from './loader.ts';

export interface ValidationError {
  _id: string;
  _type: string;
  field: string;
  message: string;
}

const VALID_CURRENCIES = ['KES', 'USD', 'EUR'] as const;

function err(doc: SanityDoc, field: string, message: string): ValidationError {
  return { _id: doc._id, _type: doc._type, field, message };
}

/** Validate a single document. Returns array of errors (empty = OK). */
export function validateDoc(doc: SanityDoc): ValidationError[] {
  const errors: ValidationError[] = [];

  if (doc._type === 'accommodation') {
    const type = doc.type ?? (doc as Record<string, unknown>).accommodationType;
    if (!type) {
      errors.push(err(doc, 'type', 'accommodations.type is required (NOT NULL)'));
    }
  }

  if (doc._type === 'blogPost') {
    if (!doc.category) {
      errors.push(err(doc, 'category', 'blog_posts.category is required (NOT NULL)'));
    }
  }

  if (doc._type === 'tour') {
    const currency = (doc.currency as string | undefined) ?? 'KES';
    if (!VALID_CURRENCIES.includes(currency as (typeof VALID_CURRENCIES)[number])) {
      errors.push(err(doc, 'currency', `Invalid currency: ${currency}. Must be one of KES, USD, EUR`));
    }
  }

  if (doc._type === 'package') {
    const currency = (doc.currency as string | undefined) ?? 'KES';
    if (!VALID_CURRENCIES.includes(currency as (typeof VALID_CURRENCIES)[number])) {
      errors.push(err(doc, 'currency', `Invalid currency: ${currency}. Must be one of KES, USD, EUR`));
    }
  }

  return errors;
}

/** Validate all documents. Throws if any errors found. */
export function validateAll(docs: SanityDoc[]): void {
  const errors: ValidationError[] = [];
  for (const doc of docs) {
    errors.push(...validateDoc(doc));
  }
  if (errors.length > 0) {
    const lines = errors.map(
      (e) => `  [${e._type}] ${e._id} → ${e.field}: ${e.message}`
    );
    throw new Error(
      `Validation failed with ${errors.length} error(s):\n${lines.join('\n')}\n\nFix the source data before proceeding.`
    );
  }
}
