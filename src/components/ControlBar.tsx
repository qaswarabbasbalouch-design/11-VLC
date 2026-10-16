import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square as StopIcon, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sliders, 
  Maximize, 
  Minimize, 
  Sparkles, 
  Tv, 
  Subtitles, 
  Music,
  ListMusic
} from 'lucide-react';
import { RepeatMode, SubtitleTrack } from '../types/player.ts';

interface ControlBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  isFullscreen: boolean;
  subtitleTracks: SubtitleTrack[];
  activeSubtitleId: string | null;
  onTogglePlay: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onOpenEqualizer: () => void;
  onOpenVideoEffects: () => void;
  onSelectSubtitleTrack: (id: string | null) => void;
  onTogglePlaylist: () => void;
}

/**
 * Format seconds to hh:mm:ss or mm:ss
 */
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `00:${pad(mins)}:${pad(secs)}`;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  muted,
  repeatMode,
  shuffle,
  isFullscreen,
  subtitleTracks,
  activeSubtitleId,
  onTogglePlay,
  onStop,
  onSeek,
  onPrev,
  onNext,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onToggleFullscreen,
  onTogglePiP,
  onOpenEqualizer,
  onOpenVideoEffects,
  onSelectSubtitleTrack,
  onTogglePlaylist
}) => {
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVolumePercent = muted ? 0 : Math.round(volume * 100);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  const handleTimelineMouseLeave = () => {
    setHoverSeekTime(null);
  };

  return (
    <div className="w-full bg-[#080d1a]/95 border-t border-slate-800/90 px-4 py-2.5 flex flex-col gap-2 select-none z-40 backdrop-blur-md">
      {/* 1. Top Row: Time & Sleek Cyan Timeline Progress */}
      <div className="flex items-center gap-3">
        {/* Elapsed Time */}
        <span className="text-[11px] font-mono tabular-nums text-sky-400 w-16 text-left">
          {formatTime(currentTime)}
        </span>

        {/* Progress Timeline Scrubber */}
        <div
          onClick={handleTimelineClick}
          onMouseMove={handleTimelineMouseMove}
          onMouseLeave={handleTimelineMouseLeave}
          className="relative flex-1 h-5 flex items-center cursor-pointer group"
        >
          {/* Track Rail */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden transition-all group-hover:h-1.5">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-75 relative shadow-[0_0_8px_rgba(0,180,216,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Glowing Seek Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#080d1a] shadow-[0_0_10px_rgba(0,180,216,0.9)] transition-transform scale-0 group-hover:scale-100"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />

          {/* Hover Time Tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 border border-slate-700 text-[10px] font-mono text-slate-200 pointer-events-none shadow-lg"
              style={{ left: `${(hoverSeekTime / duration) * 100}%` }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Total Duration */}
        <span className="text-[11px] font-mono tabular-nums text-slate-400 w-16 text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* 2. Bottom Row: Playback Buttons & Right Audio/Controls */}
      <div className="flex items-center justify-between">
        {/* Left Playback Cluster */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Previous Track */}
          <button
            type="button"
            onClick={onPrev}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Previous (P)"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 active:scale-95 text-slate-950 flex items-center justify-center transition-all shadow-[0_0_12px_rgba(0,180,216,0.5)]"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={onNext}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Next (N)"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Stop (S)"
          >
            <StopIcon className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Repeat Button */}
          <button
            type="button"
            onClick={onToggleRepeat}
            className={`p-1.5 rounded-full transition-colors relative ${
              repeatMode !== 'off' ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          {/* Shuffle Button */}
          <button
            type="button"
            onClick={onToggleShuffle}
            className={`p-1.5 rounded-full transition-colors ${
              shuffle ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title={`Shuffle: ${shuffle ? 'On' : 'Off'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools Cluster (Matching Reference Image) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Volume Group */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleMute}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={muted ? "Unmute (M)" : "Mute (M)"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-slate-800 accent-cyan-400 rounded-lg cursor-pointer"
              title={`Volume: ${currentVolumePercent}%`}
            />

            {/* Volume Percentage Text */}
            <span className="text-[10px] font-mono tabular-nums text-slate-400 w-8 text-right">
              {currentVolumePercent}%
            </span>
          </div>

          {/* Subtitles Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                activeSubtitleId
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
              title="Subtitles Track"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Subtitles</span>
            </button>

            {showSubtitleMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#0c1322] border border-slate-700/80 rounded-md shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Subtitle Track
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSubtitleTrack(null);
                    setShowSubtitleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    activeSubtitleId === null ? 'text-sky-400 font-semibold bg-sky-950/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Disabled
                </button>
                {subtitleTracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      onSelectSubtitleTrack(track.id);
                      setShowSubtitleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors truncate ${
                      activeSubtitleId === track.id ? 'text-sky-400 font-semibold bg-sky-950/40' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equalizer & Audio Effects Button */}
          <button
            type="button"
            onClick={onOpenEqualizer}
            className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
            title="Audio Equalizer (Ctrl+E)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Video Color Filters Button */}
          <button
            type="button"
            onClick={onOpenVideoEffects}
            className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
            title="Video Effects & Adjustments (Ctrl+V)"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Picture-in-Picture Button */}
          <button
            type="button"
            onClick={onTogglePiP}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden sm:block"
            title="Picture-in-Picture"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Playlist Drawer Toggle Button */}
          <button
            type="button"
            onClick={onTogglePlaylist}
            className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
            title="Toggle Playlist (Ctrl+L)"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Full Screen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen (F / F11)"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
