import '@/polyfill';

import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { onError } from '@orpc/server';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { createContext } from '@/lib/orpc/context';
import router from '@/lib/orpc/router';
import { TodoSchema } from '@/lib/orpc/schema';

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((_error) => {
      // TODO: Add proper error handling
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'TanStack ORPC Playground',
          version: '1.0.0',
        },
        commonSchemas: {
          Todo: { schema: TodoSchema },
          UndefinedError: { error: 'UndefinedError' },
        },
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: 'default-token',
            },
          },
        },
      },
    }),
  ],
});

async function handle({ request }: { request: Request }) {
  const context = await createContext({ request });

  const { response } = await handler.handle(request, {
    prefix: '/api',
    context,
  });

  return response ?? new Response('Not Found', { status: 404 });
}

export const ServerRoute = createServerFileRoute('/api/$').methods({
  HEAD: handle,
  GET: handle,
  POST: handle,
  PUT: handle,
  PATCH: handle,
  DELETE: handle,
});
