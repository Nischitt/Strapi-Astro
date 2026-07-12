import type { Core } from '@strapi/strapi';

// We explicitly type the env parameter as a function that returns a string
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
        delete: {},
      },
    },
  },
});

export default config;