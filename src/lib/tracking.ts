export function buildTrackedUrl(base: string): string {
  const url = new URL(base);

  let params: Record<string, string> = {};
  try {
    params = JSON.parse(sessionStorage.getItem('leadAttribution') || '{}');
  } catch {
    // Continue if parsing fails
  }

  Object.entries(params).forEach(([k, v]) => {
    if (!url.searchParams.has(k)) {
      url.searchParams.set(k, v as string);
    }
  });

  return url.toString();
}

export function getTrackingParams(): Record<string, string | null> {
  try {
    return JSON.parse(sessionStorage.getItem('leadAttribution') || '{}');
  } catch {
    return {};
  }
}
