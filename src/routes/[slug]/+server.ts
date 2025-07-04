import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDatabase } from '$lib/db';

export const POST: RequestHandler = async ({ request, params }) => {
  const { slug } = params as { slug: string };
  const { secret } = await request.json();
  
  if (!secret) {
    return json({ success: false, error: 'Secret is required' }, { status: 400 });
  }
  
  try {
    const db = await getDatabase();
    const note = await db.getNoteBySlug(slug);
    
    if (!note) {
      return json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    
    if (!note.isSecret) {
      // Public note, return content directly
      return json({ success: true, content: note.content });
    }
    
    const isValid = await db.verifyNoteSecret(slug, secret);
    
    if (!isValid) {
      return json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }
    
    return json({ success: true, content: note.content });
  } catch (error) {
    
    return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}; 