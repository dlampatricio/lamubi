import NavButton from '@/components/NavButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-xs">
        <div className="border-l-4 border-text-primary pl-6 py-2 mb-16">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
            Welcome to
          </p>
          <h1 className="text-5xl font-black text-text-primary uppercase leading-none tracking-tighter">
            La Mubi
          </h1>
          <p className="text-[11px] font-bold text-text-muted uppercase mt-2 tracking-widest">
            Charades Edition
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <NavButton 
            href="/lobby"
            label="Enter"
          />
          <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest text-center mt-2">
            Local Multiplayer • No Account Needed
          </p>
        </div>
      </div>
    </main>
  );
}