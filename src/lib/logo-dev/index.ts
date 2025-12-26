
export const LOGO_DEV_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY || '';

// Debug log to check if key is loaded
if (typeof window !== 'undefined') {
  console.log('[Logo.dev] Key loaded:', LOGO_DEV_PUBLISHABLE_KEY ? 'Yes (Starts with ' + LOGO_DEV_PUBLISHABLE_KEY.substring(0, 4) + ')' : 'No');
}

export const getBrandLogoUrl = (domain: string) => {
  if (!domain || !LOGO_DEV_PUBLISHABLE_KEY) {
    if (!LOGO_DEV_PUBLISHABLE_KEY && typeof window !== 'undefined') console.warn('[Logo.dev] Missing API Key');
    return '';
  }
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLISHABLE_KEY}`;
};
