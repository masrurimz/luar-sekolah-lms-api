import { createAuthClient } from 'better-auth/react';
import { env } from '../../env/client';

const authClient = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_URL,
});

export default authClient;
