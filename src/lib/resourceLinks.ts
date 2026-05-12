import { toExportAwareAppPath } from "@/lib/staticExportPaths";

const wpHosts = new Set([
  "workwellfut.com",
  "www.workwellfut.com",
  "workwellfut.hl1450.dinaserver.com",
]);

export function toExportAwareResourcePath(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, "");
  if (!normalizedPath.startsWith("/resources/")) {
    return normalizedPath || pathname;
  }

  return toExportAwareAppPath(normalizedPath);
}

export function normalizeResourceLinkHref(rawHref: string): string {
  const href = String(rawHref || "").trim();
  if (!href) return href;

  const lowerHref = href.toLowerCase();
  if (
    lowerHref.startsWith("#") ||
    lowerHref.startsWith("mailto:") ||
    lowerHref.startsWith("tel:") ||
    lowerHref.startsWith("javascript:")
  ) {
    return href;
  }

  const toInternalPath = (pathname: string, search = "", hash = ""): string => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return href;

    const categoryIndex = segments.indexOf("category");
    if (categoryIndex >= 0 && segments[categoryIndex + 1]) {
      return `${toExportAwareResourcePath(`/resources/category/${segments[categoryIndex + 1]}`)}${search}${hash}`;
    }

    const slug = segments[segments.length - 1];
    if (!slug) return href;
    return `${toExportAwareResourcePath(`/resources/post/${slug}`)}${search}${hash}`;
  };

  if (href.startsWith("/")) {
    if (href.startsWith("/resources/")) {
      return toExportAwareResourcePath(href);
    }
    try {
      const u = new URL(href, "https://workwellfut.com");
      return toInternalPath(u.pathname, u.search, u.hash);
    } catch {
      return href;
    }
  }

  if (/^https?:\/\//i.test(href)) {
    try {
      const u = new URL(href);
      if (wpHosts.has(u.hostname.toLowerCase())) {
        return toInternalPath(u.pathname, u.search, u.hash);
      }
      return href;
    } catch {
      return href;
    }
  }

  const cleaned = href.replace(/^\.\//, "").replace(/\/+$/, "");
  if (!cleaned) return href;
  const [pathPart, hashPart = ""] = cleaned.split("#", 2);
  const [slugPart, queryPart = ""] = pathPart.split("?", 2);
  const slug = slugPart.split("/").filter(Boolean).pop();
  if (!slug) return href;
  const query = queryPart ? `?${queryPart}` : "";
  const hash = hashPart ? `#${hashPart}` : "";
  return `${toExportAwareResourcePath(`/resources/post/${slug}`)}${query}${hash}`;
}

export function normalizeResourceContentHtml(html: string): string {
  return String(html || "").replace(
    /<a\b([^>]*?)\bhref=(["'])(.*?)\2([^>]*)>/gi,
    (_full, before, quote, href, after) => {
      const normalizedHref = normalizeResourceLinkHref(href);
      return `<a${before}href=${quote}${normalizedHref}${quote}${after}>`;
    }
  );
}
