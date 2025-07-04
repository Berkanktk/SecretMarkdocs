import type { RequestEvent } from '@sveltejs/kit';
import { getDatabase, type User } from './db';

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export function createSession(user: User): string {
  // Simple session token - in production, use JWT or more secure session management
  const sessionData = {
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  
  // Validate that we have all required fields
  if (!sessionData.id || !sessionData.username || !sessionData.email) {
    throw new Error('Invalid user data for session creation');
  }
  
  return btoa(JSON.stringify(sessionData));
}

export function validateSession(sessionToken: string): SessionUser | null {
  try {
    const sessionData = JSON.parse(atob(sessionToken));
    
    if (!sessionData.exp || Date.now() > sessionData.exp) {
      return null;
    }
    
    return {
      id: sessionData.id,
      username: sessionData.username,
      email: sessionData.email,
      isAdmin: sessionData.isAdmin || false
    };
  } catch {
    return null;
  }
}

export async function getUser(event: RequestEvent): Promise<SessionUser | null> {
  const sessionToken = event.cookies.get('session');
  
  if (!sessionToken) {
    return null;
  }
  
  return validateSession(sessionToken);
}

export async function requireAuth(event: RequestEvent): Promise<SessionUser> {
  const user = await getUser(event);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function setSessionCookie(event: RequestEvent, user: User) {
  const sessionToken = createSession(user);
  
  event.cookies.set('session', sessionToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 // 24 hours
  });
}

export function clearSessionCookie(event: RequestEvent) {
  event.cookies.delete('session', {
    path: '/'
  });
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const db = await getDatabase();
  return await db.authenticateUser(username, password);
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const db = await getDatabase();
  return await db.createUser(username, email, password);
} 