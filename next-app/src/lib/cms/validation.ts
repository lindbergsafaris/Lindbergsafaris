import { z } from 'zod';
import type { ContentTypeConfig, FieldConfig } from './types';

export const EMPTY_TIPTAP_DOC = { type: 'doc', content: [] };

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const singleImageSchema = z.object({
  public_id: z.string().optional().default(''),
  url: z.string().trim().min(1, 'Image URL is required').url('Please enter a valid image URL'),
  alt: z.string().trim().min(1, 'Alt text is required when an image is provided'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

function buildFieldSchema(field: FieldConfig): z.ZodTypeAny {
  if (field.validation) {
    return field.validation;
  }

  switch (field.type) {
    case 'text':
    case 'textarea': {
      let s = z.string();
      if (field.required) {
        s = s.trim().min(field.minLength ?? 1, `${field.label} is required`);
      } else if (field.minLength) {
        s = s.trim().min(field.minLength);
      }
      if (field.maxLength) {
        s = s.max(field.maxLength, `${field.label} must be at most ${field.maxLength} characters`);
      }
      if (field.pattern) {
        const rx = field.pattern;
        const msg = field.patternMessage ?? `${field.label} format is invalid`;
        return field.required
          ? s.refine((v) => rx.test(v), msg)
          : z
              .string()
              .nullable()
              .optional()
              .transform((v) => (typeof v === 'string' && v.trim() === '' ? null : v?.trim() ?? null))
              .refine((v) => v === null || rx.test(v), msg);
      }
      return field.required
        ? s
        : z
            .string()
            .nullable()
            .optional()
            .transform((v) => (typeof v === 'string' && v.trim() === '' ? null : v?.trim() ?? null));
    }

    case 'slug': {
      const base = z
        .string()
        .trim()
        .min(1, `${field.label} is required`)
        .regex(
          SLUG_REGEX,
          'Slug must be lowercase letters, numbers, and single hyphens (e.g. "maasai-mara")'
        );
      return field.required ? base : base.nullable().optional();
    }

    case 'number': {
      return z
        .union([z.number(), z.string(), z.null(), z.undefined()])
        .transform((val, ctx) => {
          if (val === '' || val === null || val === undefined) {
            if (field.required) {
              ctx.addIssue({
                code: 'custom',
                message: `${field.label} is required`,
              });
              return z.NEVER;
            }
            return null;
          }
          const num = typeof val === 'number' ? val : Number(val);
          if (Number.isNaN(num)) {
            ctx.addIssue({
              code: 'custom',
              message: `${field.label} must be a valid number`,
            });
            return z.NEVER;
          }
          if (field.min !== undefined && num < field.min) {
            ctx.addIssue({
              code: 'custom',
              message: `${field.label} must be at least ${field.min}`,
            });
            return z.NEVER;
          }
          if (field.max !== undefined && num > field.max) {
            ctx.addIssue({
              code: 'custom',
              message: `${field.label} must be at most ${field.max}`,
            });
            return z.NEVER;
          }
          return num;
        });
    }

    case 'select': {
      const allowed = field.options.map((o) => o.value);
      return z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val, ctx) => {
          const clean = typeof val === 'string' ? val.trim() : '';
          if (!clean) {
            if (field.required) {
              ctx.addIssue({
                code: 'custom',
                message: `${field.label} is required`,
              });
              return z.NEVER;
            }
            return null;
          }
          if (allowed.length > 0 && !allowed.includes(clean)) {
            ctx.addIssue({
              code: 'custom',
              message: `Invalid ${field.label} selection`,
            });
            return z.NEVER;
          }
          return clean;
        });
    }

    case 'boolean':
      return z.boolean().optional().default(Boolean(field.defaultValue ?? false));

    case 'datetime': {
      return z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val, ctx) => {
          const clean = typeof val === 'string' ? val.trim() : '';
          if (!clean) {
            if (field.required) {
              ctx.addIssue({
                code: 'custom',
                message: `${field.label} is required`,
              });
              return z.NEVER;
            }
            return null;
          }
          const d = new Date(clean);
          if (Number.isNaN(d.getTime())) {
            ctx.addIssue({
              code: 'custom',
              message: `${field.label} must be a valid date/time`,
            });
            return z.NEVER;
          }
          return d.toISOString();
        });
    }

    case 'tags':
      return z
        .array(z.string().trim().min(1))
        .optional()
        .default([])
        .transform((arr) => arr.map((s) => s.trim()).filter(Boolean));

    case 'relation':
      return field.required
        ? z.string().trim().min(1, `${field.label} is required`)
        : z
            .string()
            .nullable()
            .optional()
            .transform((v) => (typeof v === 'string' && v.trim() === '' ? null : v?.trim() ?? null));

    case 'image': {
      if (field.required) {
        return singleImageSchema.refine(
          (val) => Boolean(val && val.url && val.alt),
          `${field.label} and alt text are required`
        );
      }
      return z
        .union([singleImageSchema, z.null(), z.undefined()])
        .optional()
        .transform((val) => {
          if (!val || !val.url) return null;
          return val;
        });
    }

    case 'gallery':
      return z.array(singleImageSchema).optional().default([]);

    case 'rich-text':
      return z
        .record(z.string(), z.unknown())
        .optional()
        .default(EMPTY_TIPTAP_DOC);

    case 'repeater': {
      const itemShape: Record<string, z.ZodTypeAny> = {};
      for (const sub of field.subfields) {
        itemShape[sub.name] = buildFieldSchema(sub);
      }
      return z.array(z.object(itemShape)).optional().default([]);
    }

    default:
      return z.unknown();
  }
}

export function getAllConfigFields(config: ContentTypeConfig): FieldConfig[] {
  return config.form.tabs.flatMap((t) => t.fields);
}

export function buildZodSchema(config: ContentTypeConfig): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of getAllConfigFields(config)) {
    shape[field.name] = buildFieldSchema(field);
  }
  return z.object(shape);
}

export function buildDefaultValues(config: ContentTypeConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of getAllConfigFields(config)) {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
      continue;
    }
    switch (field.type) {
      case 'boolean':
        defaults[field.name] = false;
        break;
      case 'tags':
      case 'gallery':
      case 'repeater':
        defaults[field.name] = [];
        break;
      case 'rich-text':
        defaults[field.name] = EMPTY_TIPTAP_DOC;
        break;
      case 'image':
      case 'number':
      case 'datetime':
      case 'relation':
        defaults[field.name] = null;
        break;
      case 'select':
        defaults[field.name] = field.options[0]?.value ?? '';
        break;
      default:
        defaults[field.name] = '';
    }
  }
  return defaults;
}
