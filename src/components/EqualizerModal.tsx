import React, { useState } from 'react';
import { X, RotateCcw, Volume2, Sliders } from 'lucide-react';
import { EQUALIZER_FREQUENCIES, EQUALIZER_PRESETS, audioEngine } from '../utils/audioEngine.ts';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState('Flat');
  const [bands, setBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [preamp, setPreamp] = useState(1.0);

  if (!isOpen) return null;

  const handleBandChange = (index: number, val: number) => {
    const updated = [...bands];
    updated[index] = val;
    setBands(updated);
    audioEngine.setEqualizerBand(index, val);
    setSelectedPreset('Custom');
  };

  const handleSelectPreset = (presetName: string) => {
    const found = EQUALIZER_PRESETS.find(p => p.name === presetName);
    if (found) {
      setSelectedPreset(found.name);
      setBands([...found.bands]);
      audioEngine.applyPreset(found.bands);
    }
  };

  const handlePreampChange = (val: number) => {
    setPreamp(val);
    audioEngine.setBoostGain(val);
  };

  const handleReset = () => {
    handleSelectPreset('Flat');
    handlePreampChange(1.0);
  };

  const formatFreq = (freq: number) => {
    if (freq >= 1000) return `${freq / 1000}k`;
    return `${freq}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-base text-slate-100">10-Band Graphic Audio Equalizer</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-sky-400 focus:outline-none focus:border-sky-500 font-medium"
            >
              {EQUALIZER_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
              {selectedPreset === 'Custom' && <option value="Custom">Custom</option>}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Preamp Boost */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Preamp:</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={preamp}
                onChange={(e) => handlePreampChange(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400 h-1 bg-slate-800 rounded"
              />
              <span className="font-mono text-sky-400 w-8">{Math.round(preamp * 100)}%</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Equalizer Frequency Sliders Grid */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between gap-1 sm:gap-2">
          {EQUALIZER_FREQUENCIES.map((freq, idx) => {
            const gain = bands[idx] || 0;
            return (
              <div key={freq} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {gain > 0 ? `+${gain}` : gain}dB
                </span>
                <div className="relative h-40 flex items-center justify-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={gain}
                    onChange={(e) => handleBandChange(idx, parseInt(e.target.value, 10))}
                    className="h-36 -rotate-90 accent-cyan-400 cursor-pointer bg-slate-800"
                    style={{ width: '9rem' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-sky-300/80 font-medium">
                  {formatFreq(freq)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>Real-time Web Audio API biquad frequency filtering</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
