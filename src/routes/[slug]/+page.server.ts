import { error, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { getDatabase } from '$lib/db';
import { getUser } from '$lib/auth';

export const load = async (event: RequestEvent) => {
  const { params } = event;
  const { slug } = params as { slug: string };
  
  const db = await getDatabase();
  const note = await db.getNoteBySlug(slug);
  
  if (!note) {
    throw error(404, 'Note not found');
  }
  
  // Check if user is authenticated and owns this note
  const user = await getUser(event);
  const isOwner = user && user.id === note.userId;
  
  // Return note data (with content if it's public OR if user owns it)
  return {
    post: {
      title: note.title,
      description: note.description || '',
      slug: note.slug,
      secret_hash: note.secretHash || '',
      content: (!note.isSecret || isOwner) ? note.content : '',
      isOwner: isOwner || false,
      isSecret: note.isSecret || false
    },
    user: user
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const { slug } = params as { slug: string };
    const data = await request.formData();
    const secret = data.get('secret') as string;
    
    if (!secret) {
      return fail(400, { success: false, error: 'Secret is required' });
    }
    
    const db = await getDatabase();
    const isValid = await db.verifyNoteSecret(slug, secret);
    
    if (!isValid) {
      return fail(401, { success: false, error: 'Invalid secret' });
    }
    
    // Get the note content after successful verification
    const note = await db.getNoteBySlug(slug);
    
    return { 
      success: true, 
      content: note?.content || ''
    };
  }
}; 