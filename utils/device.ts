export type DeviceType = "mobile" | "tablet" | "desktop";

export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

export function isMobile(): boolean {
  return getDeviceType() === "mobile";
}

export function isTablet(): boolean {
  return getDeviceType() === "tablet";
}

export function isDesktop(): boolean {
  return getDeviceType() === "desktop";
}


export type MobileOS = "ios" | "android" | "other";

export function getMobileOS(): MobileOS {
  if (typeof window === "undefined") {
    return "other";
  }

  const userAgent = window.navigator.userAgent;

  // iPhone / iPad / iPod
  // iPadOS 13+는 Mac으로 UA가 표시될 수 있어서 maxTouchPoints 체크
  const isIOS =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return "ios";
  }

  if (/Android/i.test(userAgent)) {
    return "android";
  }

  return "other";
}

export function isIOS(): boolean {
  return getMobileOS() === "ios";
}

export function isAndroid(): boolean {
  return getMobileOS() === "android";
}