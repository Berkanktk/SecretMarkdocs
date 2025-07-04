import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { registerUser, setSessionCookie } from '../../../lib/auth';
import { getDatabase } from '../../../lib/db';

export const load = async ({ cookies }: RequestEvent) => {
  // If already logged in, redirect to dashboard
  const sessionToken = cookies.get('session');
  if (sessionToken) {
    throw redirect(302, '/dashboard');
  }
  
  return {};
};

export const actions: Actions = {
  register: async (event) => {
    const { request, cookies } = event;
    const data = await request.formData();
    const username = data.get('username') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    const inviteCode = data.get('inviteCode') as string;

    // Validation
    if (!username || !email || !password || !confirmPassword || !inviteCode) {
      return fail(400, { error: 'All fields including invite code are required' });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters long' });
    }

    if (username.length < 3) {
      return fail(400, { error: 'Username must be at least 3 characters long' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { error: 'Please enter a valid email address' });
    }

    try {
      // Validate invite code
      const db = await getDatabase();
      const isValidInvite = await db.validateInvite(inviteCode.toUpperCase());
      
      if (!isValidInvite) {
        return fail(400, { error: 'Invalid or expired invite code' });
      }

      const user = await registerUser(username, email, password);
      
      // Mark invite as used and check result
      const inviteUsed = await db.useInvite(inviteCode.toUpperCase(), user._id!);
      
      if (!inviteUsed) {
        return fail(400, { error: 'Failed to mark invite as used. Please try a different code.' });
      }
      
      // Set session cookie
      setSessionCookie(event, user);

      // Redirect to dashboard
      throw redirect(302, '/dashboard');
    } catch (error) {
      // Don't catch redirect errors - they're normal SvelteKit behavior
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        throw error; // Re-throw redirect
      }
      
      if (error instanceof Error && error.message === 'User already exists') {
        return fail(409, { error: 'Username or email already exists' });
      }
      
      return fail(500, { error: 'Registration failed. Please try again.' });
    }
  }
}; 