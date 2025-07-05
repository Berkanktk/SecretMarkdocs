import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUser } from '$lib/auth';
import { getDatabase } from '$lib/db';

export const load = async (event: RequestEvent) => {
  const user = await getUser(event);
  
  if (!user) {
    throw redirect(302, '/auth/login');
  }
  
  // Get search/filter parameters from URL
  const url = event.url;
  const searchTerm = url.searchParams.get('search') || '';
  const filterBy = url.searchParams.get('filter') as 'all' | 'public' | 'secret' || 'all';
  const sortBy = url.searchParams.get('sort') as 'created' | 'updated' | 'title' || 'created';
  const sortOrder = url.searchParams.get('order') as 'asc' | 'desc' || 'desc';
  
  const db = await getDatabase();
  const notes = await db.getUserNotesWithFilters(user.id, searchTerm, filterBy, sortBy, sortOrder);
  
  return {
    user,
    notes,
    searchParams: {
      search: searchTerm,
      filter: filterBy,
      sort: sortBy,
      order: sortOrder
    }
  };
}; 