/**
 * validator.ts
 *
 * Pre-insert validation. Throws loudly before any DB write if required fields
 * are missing or constraints would be violated.
 */

import { normaliseImage } from '../lib/cloudinary.ts';
import type { SanityDoc } from './loader.ts';

export interface ValidationError {
  _id: string;
  _type: string;
  field: string;
  message: string;
}

const VALID_CURRENCIES = ['KES', 'USD', 'EUR'] as const;
const VALID_ACCOMMODATION_TYPES = [
  'lodges',
  'holiday-homes',
  'town-hotels',
  'luxury-camps',
  'resort-hotels',
  'bush-camps',
] as const;
const VALID_THEMED_CATEGORIES = [
  'wildlife',
  'climbing',
  'cruise',
  'adventure',
  'pilgrimages',
  'corporate',
] as const;

function err(doc: SanityDoc, field: string, message: string): ValidationError {
  return { _id: doc._id, _type: doc._type, field, message };
}

/** Validate a single document. Returns array of errors (empty = OK). */
export function validateDoc(doc: SanityDoc, categoryIds?: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (doc._type === 'accommodation') {
    const type = (doc.type ?? (doc as Record<string, unknown>).accommodationType) as string | undefined;
    if (!type) {
      errors.push(err(doc, 'type', 'accommodations.type is required (NOT NULL)'));
    } else if (!VALID_ACCOMMODATION_TYPES.includes(type as (typeof VALID_ACCOMMODATION_TYPES)[number])) {
      errors.push(err(doc, 'type', `Invalid accommodation type: "${type}"`));
    }
  }

  if (doc._type === 'blogPost') {
    if (!doc.category) {
      errors.push(err(doc, 'category', 'blog_posts.category is required (NOT NULL)'));
    }
    if (!doc.excerpt) {
      errors.push(err(doc, 'excerpt', 'blog_posts.excerpt is required (NOT NULL)'));
    }
  }

  if (doc._type === 'destinationPost') {
    const catRef = (doc.category as Record<string, unknown>)?._ref as string | undefined;
    if (!catRef) {
      errors.push(err(doc, 'category', 'destination_posts.category_id is required (NOT NULL)'));
    } else if (categoryIds && !categoryIds.has(catRef)) {
      errors.push(err(doc, 'category', `destination_posts.category._ref "${catRef}" not found in destinationCategory docs`));
    }
  }

  if (doc._type === 'themedPackage') {
    const cat = String(doc.category ?? '').toLowerCase();
    if (!VALID_THEMED_CATEGORIES.includes(cat as (typeof VALID_THEMED_CATEGORIES)[number])) {
      errors.push(err(doc, 'category', `Invalid themed_packages.category: "${doc.category}"`));
    }
    if (!normaliseImage(doc.heroImage ?? doc.image ?? doc.coverImage)?.url) {
      errors.push(err(doc, 'heroImage', 'themed_packages.hero_image is required (NOT NULL)'));
    }
  }

  if (doc._type === 'galleryImage') {
    if (!normaliseImage(doc.imageUrl ?? doc.image ?? doc.photo)?.url) {
      errors.push(err(doc, 'imageUrl', 'gallery_images.image is required (NOT NULL)'));
    }
  }

  if (doc._type === 'fleetVehicle') {
    if (!normaliseImage(doc.imageUrl ?? doc.image ?? doc.photo)?.url) {
      errors.push(err(doc, 'imageUrl', 'fleet_vehicles.image is required (NOT NULL)'));
    }
  }

  if (doc._type === 'hotDeal') {
    if (!normaliseImage(doc.image)?.url) {
      errors.push(err(doc, 'image', 'hot_deals.image is required (NOT NULL)'));
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
  const categoryIds = new Set(
    docs.filter((d) => d._type === 'destinationCategory').map((d) => d._id)
  );
  const errors: ValidationError[] = [];
  for (const doc of docs) {
    errors.push(...validateDoc(doc, categoryIds));
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
