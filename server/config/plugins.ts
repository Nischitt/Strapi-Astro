import type { Core } from '@strapi/strapi';

const config = ({ env }: { env: (key: string, defaultValue?: any) => any }): any => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {}, // 👈 This is required for streams/buffers
        delete: {},
      },
    },
  },
});

export default config;