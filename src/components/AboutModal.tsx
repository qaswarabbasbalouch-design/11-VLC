import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-6 text-slate-200 flex flex-col">
        {/* Header with App Icon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-500 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(0,180,216,0.4)]">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-amber-400 text-sm">11</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">VLC 11 Player</h3>
              <p className="text-xs text-slate-400 font-mono">v1.0.0 · Windows x64 Desktop</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>VLC 11 Player</strong> is a high-performance Windows x64 desktop media player built with modern web technologies: React, TypeScript, Vite, Electron, and electron-builder with native NSIS packaging.
          </p>

          <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1.5 text-[11px]">
            <p className="text-sky-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Core Application Features</span>
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              <li>Hardware-accelerated HTML5 video & audio engine</li>
              <li>10-Band graphic equalizer with DSP presets</li>
              <li>Real-time dynamic audio frequency visualizer</li>
              <li>SRT & WebVTT subtitle synchronization</li>
              <li>Custom video color grading & CSS filter adjustments</li>
              <li>Automated CI/CD Windows installer building on GitHub Actions</li>
            </ul>
          </div>

          <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 text-slate-300 text-[11px] flex gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Independent Software Notice</p>
              <p className="text-slate-400 mt-0.5">
                This software is an independent desktop media player project. It is not affiliated with, endorsed by, or an official product of the VideoLAN non-profit organization.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">Released 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
