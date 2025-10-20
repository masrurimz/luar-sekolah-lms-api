import { ORPCError, os } from '@orpc/server';
import type { Context } from './context';

export const o = os.$context<Context>();

export const publicProcedure = o;

// biome-ignore lint/suspicious/useAwait: middleware pattern requires async for consistency
const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED');
  }
  return next({
    context: {
      session: context.session,
      db: context.db,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
