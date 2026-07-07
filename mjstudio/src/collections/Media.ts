import type { CollectionConfig } from 'payload'

/**
 * Media — the asset store behind the media library.
 *
 * Phase 1 uses Payload's built-in local upload handling (sharp generates
 * resized/WebP variants). Phase 1 wiring to Cloudflare R2 + CDN is a drop-in
 * storage adapter change — no field changes required.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'feature', width: 1600, height: 900, position: 'centre' },
    ],
    focalPoint: true,
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
