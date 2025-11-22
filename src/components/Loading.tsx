import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-cyan-400">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="font-tech tracking-widest animate-pulse text-sm">SYSTEM INITIALIZING...</p>
  </div>
);

export default Loading;