/**
 * `article-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  featuredImage: {
    fields: ["url", "alternativeText"],

  },
  author: {
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      articles: {
        fields: ["documentId", "title"]
      }
    }
  },
  contentTags: true

}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In article-populate middleware.');
    ctx.query.populate = populate;

    await next();
  };
};
