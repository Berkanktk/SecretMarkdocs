import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { clearSessionCookie } from '../../../lib/auth';

export const POST: RequestHandler = async (event) => {
  clearSessionCookie(event);
  return json({ success: true });
}; 