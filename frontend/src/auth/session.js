import { useRouteLoaderData } from 'react-router-dom';
import { authApi } from '../api/authApi';

// Resolves to the signed-in user, or null when there is no valid session
export async function loadCurrentUser() {
  try {
    return await authApi.me();
  } catch (err) {
    if (err.status === 401) {
      return null;
    }
    throw err;
  }
}

export function useCurrentUser() {
  return useRouteLoaderData('root');
}

// Only same-site paths, so a crafted ?next=//evil.example cannot redirect away after login
export function safeNextPath(next) {
  return next && /^\/(?![/\\])/.test(next) ? next : '/';
}
