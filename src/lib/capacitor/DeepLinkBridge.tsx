import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeDeepLinkToPath, registerCapacitorDeepLinkHandler } from '@/lib/capacitor/deeplinks';

const DeepLinkBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let unregister: null | (() => void) = null;
    let cancelled = false;

    void registerCapacitorDeepLinkHandler((event) => {
      const nextPath = normalizeDeepLinkToPath(event.url, import.meta.env.BASE_URL || '/');
      if (!nextPath) return;

      // Navigate inside the SPA so the auth callback route can finalize the session.
      navigate(nextPath, { replace: true });
    }).then((cleanup) => {
      if (cancelled) {
        cleanup?.();
        return;
      }
      unregister = cleanup;
    });

    return () => {
      cancelled = true;
      unregister?.();
    };
  }, [navigate]);

  return null;
};

export default DeepLinkBridge;

