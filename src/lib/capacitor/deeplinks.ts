export type DeepLinkEvent = { url: string };

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/**
 * Converts an incoming deep link URL into a router path we can navigate to.
 * Handles:
 * - Universal/App links: https://example.com/auth/callback?... or https://example.com/routine-stars/auth/callback?...
 * - Custom schemes (best-effort): routinestars://auth/callback?... (host becomes part of the path)
 */
export const normalizeDeepLinkToPath = (url: string, baseUrl = '/') => {
  if (!url) return null;

  const basePath = baseUrl && baseUrl !== '/' ? stripTrailingSlash(baseUrl) : '';

  try {
    const parsed = new URL(url);
    // Custom schemes (e.g. routinestars://auth/callback) parse with hostname="auth" and pathname="/callback".
    // For non-http(s), treat hostname as part of the path.
    const isWebUrl = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    let pathname = parsed.pathname || '/';
    if (!isWebUrl && parsed.hostname) {
      pathname = `/${parsed.hostname}${pathname}`;
    }

    // If we’re running with a Vite base (e.g. "/routine-stars/"), strip it so react-router sees "/auth/callback".
    if (basePath && pathname.startsWith(`${basePath}/`)) {
      pathname = pathname.slice(basePath.length);
    }

    const nextPath = `${pathname}${parsed.search}${parsed.hash}`;
    return nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  } catch {
    // Custom schemes like "routinestars://auth/callback?x=1" parse with host="auth".
    // Do a conservative split and treat everything after the scheme as a path-ish string.
    const schemeIndex = url.indexOf('://');
    const remainder = schemeIndex >= 0 ? url.slice(schemeIndex + 3) : url;

    // remainder: "auth/callback?x=1" or "auth/callback#hash"
    const leadingSlash = remainder.startsWith('/') ? '' : '/';
    const pathish = `${leadingSlash}${remainder}`;

    if (basePath && pathish.startsWith(`${basePath}/`)) {
      return pathish.slice(basePath.length);
    }

    return pathish;
  }
};

export const registerCapacitorDeepLinkHandler = async (
  onDeepLink: (event: DeepLinkEvent) => void
): Promise<null | (() => void)> => {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return null;

  const { App } = await import('@capacitor/app');

  const handler = (event: DeepLinkEvent) => onDeepLink(event);
  const listener = await App.addListener('appUrlOpen', handler);

  // Handle cold-start deep links.
  try {
    const launch = await App.getLaunchUrl();
    if (launch?.url) {
      onDeepLink({ url: launch.url });
    }
  } catch {
    // If unavailable on some platforms, ignore.
  }

  return () => {
    listener.remove();
  };
};
