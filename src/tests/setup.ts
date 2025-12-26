import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.crypto for PKCE
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr: any) => arr,
    subtle: {
      digest: async () => new Uint8Array(32),
    },
  },
});

// Mock ResizeObserver for React Flow
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
  getBYOIClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
}));

// Mock AI actions
vi.mock('../lib/ai/actions', () => ({
  askAI: vi.fn().mockResolvedValue('Neural Insight: Test Response'),
}));

// Mock Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));
