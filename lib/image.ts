const IMAGE_SCHEME_RE = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export const DEFAULT_POST_IMAGE = "/images/news banner.jpg";

export function normalizeImageSrc(
  source?: string | null,
  fallback: string = DEFAULT_POST_IMAGE
) {
  const value = typeof source === "string" ? source.trim() : "";

  if (!value) {
    return fallback;
  }

  const normalized = value.startsWith("/") || IMAGE_SCHEME_RE.test(value) ? value : `/${value}`;

  return encodeURI(normalized);
}
