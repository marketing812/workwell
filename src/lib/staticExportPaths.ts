const isCapacitorStaticBuild =
  process.env.BUILD_TARGET === "capacitor" ||
  process.env.npm_lifecycle_event === "build:capacitor";

export function toExportAwareAppPath(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, "");
  if (!isCapacitorStaticBuild || !normalizedPath.startsWith("/")) {
    return normalizedPath || pathname;
  }

  if (
    normalizedPath === "/" ||
    normalizedPath.endsWith(".html") ||
    /\.[a-z0-9]+$/i.test(normalizedPath)
  ) {
    return normalizedPath;
  }

  return `${normalizedPath}.html`;
}
