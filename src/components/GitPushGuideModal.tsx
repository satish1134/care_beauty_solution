import React, { useState } from 'react';
import { X, GitBranch, Terminal, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface GitPushGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitPushGuideModal: React.FC<GitPushGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Local Repository Status',
      desc: 'The Git repository has already been initialized in this environment on branch main, and the initial baseline commit has been generated.',
      cmd: 'git status',
    },
    {
      title: 'Step 2: Create a Remote Repository on GitHub / GitLab',
      desc: 'Log in to your GitHub account (https://github.com/new) and create a new repository named "care-beauty-solution". Do NOT initialize with a README or .gitignore since we already have them configured.',
      cmd: null,
    },
    {
      title: 'Step 3: Add Remote Origin URL',
      desc: 'Replace YOUR_GITHUB_USERNAME with your GitHub profile handle and run:',
      cmd: 'git remote add origin https://github.com/YOUR_GITHUB_USERNAME/care-beauty-solution.git',
    },
    {
      title: 'Step 4: Rename Branch to Main (if needed) & Set Upstream',
      desc: 'Ensure main branch tracking is established:',
      cmd: 'git branch -M main',
    },
    {
      title: 'Step 5: Push All Code to Remote',
      desc: 'Push all files, Prisma schema, components, and server logic to your GitHub repository:',
      cmd: 'git push -u origin main',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-emerald-100">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg">Git Setup & Remote Connection Guide</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Git Repository Successfully Initialized Locally!</p>
              <p className="mt-0.5 text-emerald-800">
                All 15+ files, including the Prisma PostgreSQL schema, Express server, Razorpay integration, and React storefront are committed locally. Follow the steps below to push to your GitHub repo.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((st, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-700" /> {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>

                {st.cmd && (
                  <div className="bg-slate-900 text-amber-300 font-mono text-xs p-3 rounded-xl flex items-center justify-between gap-2 overflow-x-auto">
                    <code>{st.cmd}</code>
                    <button
                      onClick={() => copyToClipboard(st.cmd, i)}
                      className="text-slate-400 hover:text-white transition flex-shrink-0 p-1"
                      title="Copy Command"
                    >
                      {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
