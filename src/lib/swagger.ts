import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'CHALLECARA API Documentation',
        version: '1.0.0',
        description: 'API documentation for CHALLECARA - A social profile management platform',
        contact: {
          name: 'CHALLECARA Team',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://challecara.com',
          description: 'Production server',
        },
      ],
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique user identifier',
              },
              accountId: {
                type: 'string',
                minLength: 3,
                maxLength: 20,
                description: 'User account ID',
              },
              nickname: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
                description: 'User nickname',
              },
              bio: {
                type: 'string',
                description: 'User biography',
              },
              avatarUrl: {
                type: 'string',
                format: 'uri',
                description: 'Avatar image URL',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Account creation timestamp',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp',
              },
            },
            required: ['id', 'accountId', 'nickname', 'bio', 'avatarUrl', 'createdAt', 'updatedAt'],
          },
          UserCreateInput: {
            type: 'object',
            properties: {
              accountId: {
                type: 'string',
                minLength: 3,
                maxLength: 20,
                description: 'User account ID',
              },
              password: {
                type: 'string',
                minLength: 8,
                format: 'password',
                description: 'User password (minimum 8 characters)',
              },
              nickname: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
                description: 'User nickname',
              },
              bio: {
                type: 'string',
                description: 'User biography',
              },
              avatarUrl: {
                type: 'string',
                format: 'uri',
                description: 'Avatar image URL',
              },
            },
            required: ['accountId', 'password', 'nickname', 'bio', 'avatarUrl'],
          },
          SocialLink: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique social link identifier',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'Associated user ID',
              },
              provider: {
                type: 'string',
                enum: ['twitter', 'instagram', 'facebook', 'tiktok'],
                description: 'Social media provider',
              },
              url: {
                type: 'string',
                format: 'uri',
                description: 'Social media profile URL',
              },
              isActive: {
                type: 'boolean',
                description: 'Whether the link is active',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp',
              },
            },
            required: ['id', 'userId', 'provider', 'url', 'isActive', 'createdAt'],
          },
          SocialLinkCreateInput: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'Associated user ID',
              },
              provider: {
                type: 'string',
                enum: ['twitter', 'instagram', 'facebook', 'tiktok'],
                description: 'Social media provider',
              },
              url: {
                type: 'string',
                format: 'uri',
                description: 'Social media profile URL',
              },
            },
            required: ['userId', 'provider', 'url'],
          },
          BlogPost: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique blog post identifier',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'Author user ID',
              },
              title: {
                type: 'string',
                description: 'Blog post title',
              },
              content: {
                type: 'string',
                description: 'Blog post content',
              },
              isPublished: {
                type: 'boolean',
                description: 'Whether the post is published',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp',
              },
            },
            required: ['id', 'userId', 'title', 'content', 'isPublished', 'createdAt', 'updatedAt'],
          },
          BlogPostCreateInput: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'Author user ID',
              },
              title: {
                type: 'string',
                description: 'Blog post title',
              },
              content: {
                type: 'string',
                description: 'Blog post content',
              },
              isPublished: {
                type: 'boolean',
                default: false,
                description: 'Whether the post is published',
              },
            },
            required: ['userId', 'title', 'content', 'isPublished'],
          },
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                description: 'Error message',
              },
              code: {
                type: 'string',
                description: 'Error code',
              },
            },
            required: ['error'],
          },
        },
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        {
          name: 'Users',
          description: 'User management endpoints',
        },
        {
          name: 'Social Links',
          description: 'Social media link management',
        },
        {
          name: 'Blog Posts',
          description: 'Blog post management',
        },
        {
          name: 'Authentication',
          description: 'Authentication endpoints',
        },
      ],
    },
  });

  return spec;
};
