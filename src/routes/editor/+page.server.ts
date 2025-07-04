import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { getUser } from '$lib/auth';
import { getDatabase } from '$lib/db';

export const load = async (event: RequestEvent) => {
  const user = await getUser(event);
  
  if (!user) {
    throw redirect(302, '/auth/login');
  }
  
  // Check if we're editing an existing note
  const editSlug = event.url.searchParams.get('edit');
  let note = null;
  
  if (editSlug) {
    const db = await getDatabase();
    note = await db.getNoteBySlug(editSlug);
    
    // Verify the note belongs to the user
    if (!note || note.userId !== user.id) {
      throw redirect(302, '/dashboard');
    }
  }
  
  return {
    user,
    note
  };
};

export const actions: Actions = {
  create: async (event) => {
    const { request, cookies } = event;
    const user = await getUser(event);
    
    if (!user) {
      throw redirect(302, '/auth/login');
    }
    
    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const content = data.get('content') as string;
    const isSecret = data.get('isSecret') === 'true';
    const secret = data.get('secret') as string | null;
    
    if (!title || !description || !content) {
      return fail(400, { error: 'Title, description, and content are required' });
    }
    
    if (isSecret && (!secret || secret.trim() === '')) {
      return fail(400, { error: 'Secret is required for secret notes' });
    }
    
    try {
      const db = await getDatabase();
      
      await db.createNote(title, description, content, isSecret, secret, user.id);
      
      // Don't catch the redirect
    } catch (error) {
      return fail(500, { error: 'Failed to create note' });
    }
    
    // Redirect after successful creation
    throw redirect(302, '/dashboard');
  },
  
  update: async (event) => {
    const { request, cookies, url } = event;
    const user = await getUser(event);
    
    if (!user) {
      throw redirect(302, '/auth/login');
    }
    
    const editSlug = url.searchParams.get('edit');
    if (!editSlug) {
      throw redirect(302, '/dashboard');
    }
    
    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const content = data.get('content') as string;
    const isSecret = data.get('isSecret') === 'true';
    const secret = data.get('secret') as string | null;
    
    if (!title || !description || !content) {
      return fail(400, { error: 'Title, description, and content are required' });
    }
    
    try {
      const db = await getDatabase();
      
      // For updates, allow empty secret (keeps existing secret)
      // Only validate secret requirement if switching from public to secret
      if (isSecret && (!secret || secret.trim() === '')) {
        const existingNote = await db.getNoteBySlug(editSlug);
        if (!existingNote || !existingNote.isSecret) {
          return fail(400, { error: 'Secret is required when setting a note as private' });
        }
      }
      
      // First, let's verify the note exists and belongs to the user
      const existingNote = await db.getNoteBySlug(editSlug);
      
      if (!existingNote) {
        return fail(404, { error: 'Note not found' });
      }
      
      if (existingNote.userId !== user.id) {
        return fail(403, { error: 'Access denied' });
      }
      
      const updatedNote = await db.updateNote(editSlug, title, description, content, isSecret, secret, user.id);
      
      if (!updatedNote) {
        return fail(500, { error: 'Failed to update note' });
      }
      
    } catch (error) {
      return fail(500, { error: 'Failed to update note' });
    }
    
    // Redirect after successful update
    throw redirect(302, '/dashboard');
  },
  
  delete: async (event) => {
    const { request, cookies, url } = event;
    const user = await getUser(event);
    
    if (!user) {
      throw redirect(302, '/auth/login');
    }
    
    const editSlug = url.searchParams.get('edit');
    if (!editSlug) {
      throw redirect(302, '/dashboard');
    }
    
    try {
      const db = await getDatabase();
      
      // Verify the note belongs to the user before deleting
      const note = await db.getNoteBySlug(editSlug);
      if (!note || note.userId !== user.id) {
        return fail(404, { error: 'Note not found or access denied' });
      }
      
      const deleted = await db.deleteNote(editSlug, user.id);
      
      if (!deleted) {
        return fail(404, { error: 'Note not found or access denied' });
      }
      
      // Don't catch the redirect
    } catch (error) {
      return fail(500, { error: 'Failed to delete note' });
    }
    
    // Redirect after successful deletion
    throw redirect(302, '/dashboard');
  }
}; 