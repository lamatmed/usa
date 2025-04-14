'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  useEffect(() => {
    router.push('/activites');
  }, [router]);

  return null;
}
