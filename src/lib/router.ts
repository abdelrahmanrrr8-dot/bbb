import { useCallback, useSyncExternalStore } from 'react';

export type Route = {
  path: string;
  params: Record<string, string>;
};

function parseLocation(): Route {
  let path = window.location.pathname || '/';
  const search = window.location.search;
  const params: Record<string, string> = {};
  if (search) {
    new URLSearchParams(search).forEach((v, k) => {
      params[k] = v;
    });
  }
  if (!path.startsWith('/')) path = '/' + path;
  return { path, params };
}

// Global singleton store so all components share the same route state
let currentRoute: Route = parseLocation();
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Route {
  return currentRoute;
}

// Listen to popstate (browser back/forward)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentRoute = parseLocation();
    emitChange();
    window.scrollTo(0, 0);
  });
}

export function useRouter() {
  const route = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    currentRoute = parseLocation();
    emitChange();
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
