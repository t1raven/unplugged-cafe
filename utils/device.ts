export function getDeviceType() {
  if (typeof window === "undefined") return "server";

  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}