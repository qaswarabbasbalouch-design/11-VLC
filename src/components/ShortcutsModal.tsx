import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      group: 'Playback & Navigation',
      items: [
        { key: 'Space', desc: 'Play / Pause toggle' },
        { key: 'S', desc: 'Stop playback' },
        { key: 'Left / Right', desc: 'Seek backward / forward 5 seconds' },
        { key: 'P / N', desc: 'Previous / Next track in playlist' },
        { key: '] / [', desc: 'Speed up / slow down playback' },
        { key: '=', desc: 'Reset speed to normal (1.0x)' }
      ]
    },
    {
      group: 'Audio & Volume',
      items: [
        { key: 'Up / Down', desc: 'Increase / decrease volume (5%)' },
        { key: 'M', desc: 'Mute / unmute audio' },
        { key: 'Ctrl + E', desc: 'Toggle 10-band audio equalizer' }
      ]
    },
    {
      group: 'Video & View',
      items: [
        { key: 'F / F11', desc: 'Toggle Full Screen mode' },
        { key: 'Escape', desc: 'Exit Full Screen or close modal' },
        { key: 'Ctrl + V', desc: 'Toggle Video Color Effects' },
        { key: 'Ctrl + L', desc: 'Toggle Playlist Queue drawer' },
        { key: 'Ctrl + B', desc: 'Toggle Left Navigation Sidebar' }
      ]
    },
    {
      group: 'Files & Subtitles',
      items: [
        { key: 'Ctrl + O', desc: 'Open media file (native picker)' },
        { key: 'Ctrl + Shift + O', desc: 'Open entire folder / library' },
        { key: 'Ctrl + S', desc: 'Load Subtitle file (.srt, .vtt)' },
        { key: 'Drag & Drop', desc: 'Drop any file directly onto window' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-6 text-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-base text-slate-100">VLC 11 Keyboard Shortcuts Reference</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {shortcutGroups.map((group) => (
            <div key={group.group} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              <h4 className="font-semibold text-sky-300 mb-2.5 pb-1 border-b border-slate-800">
                {group.group}
              </h4>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">{item.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-sky-400 whitespace-nowrap shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
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
