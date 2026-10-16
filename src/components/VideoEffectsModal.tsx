import React from 'react';
import { X, Sparkles, RotateCcw } from 'lucide-react';
import { VideoFilterSettings } from '../types/player.ts';

interface VideoEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VideoFilterSettings;
  onChange: (filters: VideoFilterSettings) => void;
  onReset: () => void;
}

export const VideoEffectsModal: React.FC<VideoEffectsModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset
}) => {
  if (!isOpen) return null;

  const update = (key: keyof VideoFilterSettings, val: number) => {
    onChange({ ...filters, [key]: val });
  };

  const controls = [
    { key: 'brightness', label: 'Brightness', min: 50, max: 150, step: 1, unit: '%', value: filters.brightness },
    { key: 'contrast', label: 'Contrast', min: 50, max: 150, step: 1, unit: '%', value: filters.contrast },
    { key: 'saturate', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%', value: filters.saturate },
    { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, step: 1, unit: '°', value: filters.hueRotate },
    { key: 'sepia', label: 'Sepia Film', min: 0, max: 100, step: 1, unit: '%', value: filters.sepia },
    { key: 'invert', label: 'Invert Colors', min: 0, max: 100, step: 1, unit: '%', value: filters.invert },
    { key: 'blur', label: 'Soft Blur', min: 0, max: 10, step: 0.5, unit: 'px', value: filters.blur }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-base text-slate-100">Video Effects & Adjustments</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders List */}
        <div className="mt-4 space-y-3.5">
          {controls.map((ctrl) => (
            <div key={ctrl.key} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">{ctrl.label}</span>
                <span className="font-mono text-sky-400">
                  {ctrl.value}
                  {ctrl.unit}
                </span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={ctrl.value}
                onChange={(e) => update(ctrl.key as keyof VideoFilterSettings, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 accent-cyan-400 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
