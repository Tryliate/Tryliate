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
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  channel: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
  removeChannel: vi.fn().mockReturnThis(),
  // Add then to make it thenable
  then: (onFullfilled: any) => Promise.resolve({ data: [], error: null }).then(onFullfilled),
};

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
  getBYOIClient: vi.fn(() => mockSupabase),
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
