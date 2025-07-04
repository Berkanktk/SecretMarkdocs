import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { loginUser, setSessionCookie, getUser } from '../../../lib/auth';

export const load = async ({ cookies }: RequestEvent) => {
  // If already logged in, redirect to dashboard
  const sessionToken = cookies.get('session');
  if (sessionToken) {
    throw redirect(302, '/dashboard');
  }
  
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const { request, cookies } = event;
    const data = await request.formData();
    const username = data.get('username') as string;
    const password = data.get('password') as string;

    if (!username || !password) {
      return fail(400, { error: 'Username and password are required' });
    }

    try {
      const user = await loginUser(username, password);
      
      if (!user) {
        return fail(401, { error: 'Invalid username or password' });
      }

      // Set session cookie
      setSessionCookie(event, user);

      // Redirect to dashboard (outside try-catch so it's not caught as an error)
    } catch (error) {

      return fail(500, { error: 'Login failed. Please try again.' });
    }

    // Redirect after successful login
    throw redirect(302, '/dashboard');
  }
}; 