"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  return (
    <>
    <div>
      <h1>La Mubi</h1>
    </div>
    <button onClick={() => router.push('/lobby')}>Lobby</button>
    </>
  );
}
