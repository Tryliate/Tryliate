'use server';

const LOGO_DEV_SECRET_KEY = process.env.LOGO_DEV_SECRET_KEY;

export interface BrandInfo {
  name: string;
  domain: string;
  logoUrl?: string; // We construct this client-side usually, but could return it too
}

export async function getBrandInfo(domain: string): Promise<BrandInfo | null> {
  if (!domain || !LOGO_DEV_SECRET_KEY) return null;

  try {
    const response = await fetch(`https://api.logo.dev/search?q=${encodeURIComponent(domain)}`, {
      headers: {
        'Authorization': `Bearer ${LOGO_DEV_SECRET_KEY}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`[Logo.dev] Failed to fetch info for ${domain}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Try to find exact domain match first
      const exactMatch = data.find((brand: any) => brand.domain === domain);
      if (exactMatch) return exactMatch;

      // Fallback to the first result (usually the most relevant)
      return data[0];
    }

    return null;
  } catch (error) {
    console.error('[Logo.dev] Error fetching brand info:', error);
    return null;
  }
}
