"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginOverlay } from '../../components/LoginOverlay';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{ background: '#000', height: '100vh' }}>
      <LoginOverlay
        isOpen={true}
        onClose={() => router.push('/')}
      />
    </div>
  );
}
