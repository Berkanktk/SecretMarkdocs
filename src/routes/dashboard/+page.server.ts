import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUser } from '$lib/auth';
import { getDatabase } from '$lib/db';

export const load = async (event: RequestEvent) => {
  const user = await getUser(event);
  
  if (!user) {
    throw redirect(302, '/auth/login');
  }
  
  const db = await getDatabase();
  const notes = await db.getUserNotes(user.id);
  
  return {
    user,
    notes
  };
}; 