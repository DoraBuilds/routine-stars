export const APP_VERSION = __APP_VERSION__;

export const getVersionManifestUrl = () => {
  const url = new URL("version.json", window.location.origin + import.meta.env.BASE_URL);
  url.searchParams.set("ts", Date.now().toString());
  return url.toString();
};

export const getRefreshUrl = (version: string) => {
  const url = new URL(import.meta.env.BASE_URL, window.location.origin);
  url.searchParams.set("refresh", version);
  return url.toString();
};
