'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (token) {
      console.log(token)
      router.push('/dashboard');
    } else {
      console.log('No token found, redirecting to login');
      router.push('/login');
    }
  }, [router]);

  return null;
}