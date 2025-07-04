import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUser } from '$lib/auth';
import { getDatabase } from '$lib/db';

export const load = async (event: RequestEvent) => {
  const user = await getUser(event);
  
  // If user is logged in, redirect to dashboard
  if (user) {
    throw redirect(302, '/dashboard');
  }
  
  // If not logged in, redirect to login page
  throw redirect(302, '/auth/login');
}; 