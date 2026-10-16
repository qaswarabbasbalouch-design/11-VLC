import React from 'react';
import { X, CheckCircle2, AlertTriangle, Info, Cpu, ShieldCheck } from 'lucide-react';

interface CodecInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodecInfoModal: React.FC<CodecInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-6 text-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-semibold text-base text-slate-100">VLC 11 Player Engine & Codec Specification</h3>
              <p className="text-xs text-slate-400">Technical transparency on playback engine capabilities</p>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* Important Notice Callout */}
          <div className="p-3.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-200 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-100">Playback Engine Architecture Notice</p>
              <p className="text-slate-300 mt-1 leading-relaxed">
                VLC 11 Player is an independent Windows desktop application utilizing Electron and Chromium's high-performance hardware-accelerated media pipeline. Unlike traditional native C++ VideoLAN VLC that bundles external FFmpeg binaries for proprietary legacy codecs, this modern player uses native GPU rendering and Web Audio DSP filters for zero-latency playback.
              </p>
            </div>
          </div>

          {/* Fully Supported Formats */}
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Hardware-Accelerated Containers & Codecs</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <p className="font-medium text-emerald-300">Video Containers & Codecs</p>
                <ul className="mt-1 space-y-0.5 text-slate-400 list-disc list-inside">
                  <li><strong className="text-slate-200">MP4</strong> (.mp4, .m4v) — H.264 / AVC</li>
                  <li><strong className="text-slate-200">WebM</strong> (.webm) — VP8, VP9, AV1</li>
                  <li><strong className="text-slate-200">QuickTime</strong> (.mov) — H.264 profiles</li>
                  <li><strong className="text-slate-200">MKV</strong> (.mkv) — containing VP9, H.264 or AV1</li>
                </ul>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <p className="font-medium text-emerald-300">Audio Containers & Codecs</p>
                <ul className="mt-1 space-y-0.5 text-slate-400 list-disc list-inside">
                  <li><strong className="text-slate-200">MP3</strong> (.mp3) — MPEG Audio Layer 3</li>
                  <li><strong className="text-slate-200">WAV</strong> (.wav) — PCM Uncompressed Audio</li>
                  <li><strong className="text-slate-200">OGG</strong> (.ogg, .oga) — Vorbis & Opus</li>
                  <li><strong className="text-slate-200">AAC</strong> (.aac, .m4a) — Advanced Audio Coding</li>
                  <li><strong className="text-slate-200">FLAC</strong> (.flac) — Free Lossless Audio</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Format Limitations and Transparent Reporting */}
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Known Format Limitations & Solutions</span>
            </h4>
            <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 text-slate-300 space-y-2">
              <p>
                Certain legacy or proprietary codecs (e.g. <em>HEVC/H.265 without OS licensing, AC-3 / Dolby Digital multi-channel, and vintage RealMedia / WMV3</em>) may not decode natively in Chromium.
              </p>
              <p className="text-amber-300/90 font-medium">
                VLC 11 Player will clearly alert you if a selected file uses an unsupported codec, rather than crashing or freezing. For such files, we recommend standard transcoding using Handbrake or ffmpeg to H.264/AAC MP4.
              </p>
            </div>
          </div>

          {/* Subtitles Supported */}
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Subtitle Engines</span>
            </h4>
            <p className="text-slate-400">
              Full synchronized parsing for <strong>SubRip (.srt)</strong> and <strong>WebVTT (.vtt)</strong> subtitles with millisecond timing, line breaks, and offset synchronization adjustment (-5.0s to +5.0s).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
