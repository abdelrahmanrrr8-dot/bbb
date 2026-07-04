import { useEffect, useState, useCallback } from 'react';

export type Route = {
  path: string;
  params: Record<string, string>;
};

function parseLocation(): Route {
  let path = window.location.pathname || '/';
  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) path = path.slice(0, queryIndex);

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

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseLocation);

  useEffect(() => {
    const handler = () => {
      setRoute(parseLocation());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(parseLocation());
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
