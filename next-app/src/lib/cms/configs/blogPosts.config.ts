import type { ContentTypeConfig } from '../types';

export const blogPostsConfig: ContentTypeConfig = {
  slug: 'blog-posts',
  tableName: 'blog_posts',
  singular: 'Blog Post',
  plural: 'Blog Posts',
  description: 'Editorial travel stories, guides, and safari tips.',
  icon: 'FileText',
  revalidateTags: ['blogPost'],
  primaryLabelField: 'title',
  publicPathPrefix: '/blog/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  listView: {
    columns: [
      { field: 'featured_image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'category', label: 'Category', type: 'text', sortable: true },
      { field: 'author', label: 'Author', type: 'text' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'published_at', label: 'Published', type: 'date', sortable: true },
    ],
    searchFields: ['title', 'category', 'author', 'slug'],
    filters: [],
    defaultSort: { field: 'published_at', direction: 'desc' },
  },
  form: {
    tabs: [
      {
        id: 'article',
        label: 'Article',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'title',
            publicPathPrefix: '/blog/',
            required: true,
          },
          { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. travel-tips, destinations' },
          { name: 'author', label: 'Author', type: 'text', required: true, defaultValue: 'Lindberg Safaris' },
          { name: 'read_time', label: 'Read Time', type: 'text', placeholder: 'e.g. 5 min read' },
          { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
          { name: 'featured_image', label: 'Featured Image', type: 'image' },
          { name: 'content', label: 'Content', type: 'rich-text' },
        ],
      },
      {
        id: 'seo',
        label: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO Title', type: 'text' },
          { name: 'seo_description', label: 'SEO Description', type: 'textarea' },
        ],
      },
      {
        id: 'publishing',
        label: 'Publishing',
        fields: [
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ],
          },
          { name: 'published_at', label: 'Published At', type: 'datetime' },
        ],
      },
    ],
  },
};
