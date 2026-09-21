'use client';

import DevOpsConsole from '@/components/DevOpsConsole';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OpsPage() {
  return (
    <div>
      <div className="bg-[#0f1117] text-white px-6 py-2.5 flex items-center justify-between border-b border-[#2d3343] text-xs font-mono">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CARE-A Operations Hub &bull; Development Environment</span>
        </span>
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition">
          <ArrowLeft size={14} /> Back to Storefront
        </Link>
      </div>
      <DevOpsConsole onClose={() => { window.location.href = '/'; }} />
    </div>
  );
}
