import type { z } from 'zod';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'slug'
  | 'select'
  | 'boolean'
  | 'datetime'
  | 'tags'
  | 'repeater'
  | 'relation'
  | 'image'
  | 'gallery'
  | 'rich-text';

export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: z.ZodTypeAny;
  /** Optional regex/pattern constraint on string values (e.g. URL path). */
  pattern?: RegExp;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'textarea';
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface SlugFieldConfig extends BaseFieldConfig {
  type: 'slug';
  sourceField: string;
  /** Prefix displayed in the public URL preview, e.g. "/tours/". */
  publicPathPrefix?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: Array<{ label: string; value: string }>;
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: 'boolean';
}

export interface DatetimeFieldConfig extends BaseFieldConfig {
  type: 'datetime';
}

export interface TagsFieldConfig extends BaseFieldConfig {
  type: 'tags';
}

export interface RelationFieldConfig extends BaseFieldConfig {
  type: 'relation';
  targetTable: string;
  labelField: string;
  valueField: string;
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: 'image' | 'gallery';
}

export interface RichTextFieldConfig extends BaseFieldConfig {
  type: 'rich-text';
}

export interface RepeaterFieldConfig extends BaseFieldConfig {
  type: 'repeater';
  itemLabel?: string;
  subfields: FieldConfig[];
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SlugFieldConfig
  | SelectFieldConfig
  | BooleanFieldConfig
  | DatetimeFieldConfig
  | TagsFieldConfig
  | RelationFieldConfig
  | ImageFieldConfig
  | RichTextFieldConfig
  | RepeaterFieldConfig;

export type ListColumnType =
  | 'text'
  | 'badge'
  | 'image'
  | 'date'
  | 'currency'
  | 'boolean'
  | 'expiry';

export interface ListColumnConfig {
  field: string;
  label: string;
  type: ListColumnType;
  sortable?: boolean;
  /** Optional field used to read currency code for currency columns. */
  currencyField?: string;
}

export interface ListFilterConfig {
  field: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface FormTabConfig {
  id: string;
  label: string;
  fields: FieldConfig[];
}

export interface ContentTypeConfig {
  slug: string; // Admin URL segment, e.g. 'tours'
  tableName: string; // Supabase table name
  singular: string;
  plural: string;
  description?: string;
  icon: string; // Lucide icon name
  revalidateTags: string[];
  /** Primary display field for dashboard & confirm prompts. */
  primaryLabelField: string;
  /** Optional public route prefix for slug redirects/preview (e.g. '/tours/'). */
  publicPathPrefix?: string;
  /** Optional slug column name if content type has canonical slugs. */
  slugField?: string;
  /** Whether table supports draft/published/archived workflow (default true; redirects uses false). */
  hasStatusWorkflow?: boolean;
  /** Field storing display_order if numeric/arrow ordering is enabled. */
  displayOrderField?: string;
  /** Optional date field for showing an "Expired" badge in list views. */
  expiryField?: string;
  /** Enable one-click "Duplicate as draft" action in list view. */
  supportsDuplicate?: boolean;
  listView: {
    columns: ListColumnConfig[];
    searchFields: string[];
    filters: ListFilterConfig[];
    defaultSort: { field: string; direction: 'asc' | 'desc' };
  };
  form: {
    tabs: FormTabConfig[];
  };
}
