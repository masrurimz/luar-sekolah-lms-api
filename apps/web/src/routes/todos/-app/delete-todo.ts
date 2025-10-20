import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { todo } from '@/lib/db/schema/todo';
import { publicProcedure } from '@/lib/orpc';

export const deleteTodo = publicProcedure
  .input(z.object({ id: z.uuid() }))
  .handler(async ({ input, context }) => {
    await context.db.delete(todo).where(eq(todo.id, input.id));
    return { success: true };
  });
