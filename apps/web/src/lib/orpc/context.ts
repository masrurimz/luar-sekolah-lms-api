import { serverOnly } from '@tanstack/react-start';
import { auth } from '../auth';
import { db } from '../db';

export const createContext = serverOnly(
  async ({ request }: { request: Request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return {
      session,
      db,
    };
  }
);

export type Context = Awaited<ReturnType<typeof createContext>>;
