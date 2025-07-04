import { json } from '@sveltejs/kit';
import { getDatabase } from '$lib/db';
import { getUser } from '$lib/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const user = await getUser({ cookies } as any);
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return json({ error: 'Admin access required' }, { status: 403 });
    }

    const { expiresInDays } = await request.json();
    
    const db = await getDatabase();
    const invite = await db.createInvite(user.id, expiresInDays);
    
    return json({ invite });
  } catch (error) {

    return json({ error: 'Failed to create invite' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const user = await getUser({ cookies } as any);
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return json({ error: 'Admin access required' }, { status: 403 });
    }

    const db = await getDatabase();
    const invites = await db.getUserInvites(user.id);
    
    return json({ invites });
  } catch (error) {

    return json({ error: 'Failed to fetch invites' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
  try {
    const user = await getUser({ cookies } as any);
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return json({ error: 'Admin access required' }, { status: 403 });
    }

    const { inviteId } = await request.json();
    
    const db = await getDatabase();
    const deleted = await db.deleteInvite(inviteId, user.id);
    
    if (!deleted) {
      return json({ error: 'Invite not found or access denied' }, { status: 404 });
    }
    
    return json({ success: true });
  } catch (error) {

    return json({ error: 'Failed to delete invite' }, { status: 500 });
  }
}; 