import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, UploadCloud, Volume2, VolumeX, FastForward, Rewind, AlertCircle } from 'lucide-react';
import { MediaItem, VideoFilterSettings, AspectRatioMode } from '../types/player.ts';
import { audioEngine } from '../utils/audioEngine.ts';

interface VideoPlayerProps {
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  subtitleText: string | null;
  videoFilters: VideoFilterSettings;
  aspectRatio: AspectRatioMode;
  enableVisualizer: boolean;
  onTogglePlay: () => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (dur: number) => void;
  onEnded: () => void;
  onWaiting: () => void;
  onPlaying: () => void;
  onError: (e: any) => void;
  onFileDrop: (files: FileList) => void;
  onToggleFullscreen: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  osdMessage: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentMedia,
  isPlaying,
  currentTime,
  duration,
  volume,
  muted,
  speed,
  subtitleText,
  videoFilters,
  aspectRatio,
  enableVisualizer,
  onTogglePlay,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  onWaiting,
  onPlaying,
  onError,
  onFileDrop,
  onToggleFullscreen,
  videoRef,
  osdMessage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCenterControls, setShowCenterControls] = useState(true);
  const hideControlsTimeout = useRef<any>(null);

  // Initialize Web Audio Engine with video/audio element
  useEffect(() => {
    if (videoRef.current) {
      audioEngine.init(videoRef.current);
    }
  }, [currentMedia]);

  // Audio Visualizer loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas || !enableVisualizer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(64);

    const render = () => {
      animationId = requestAnimationFrame(render);
      audioEngine.getFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barCount = 48;
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i] || 0;
        const percent = val / 255;
        const barHeight = Math.max(4, percent * height * 0.75);
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient from cyan to amber
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(0.6, '#00b4d8');
        gradient.addColorStop(1, '#f59e0b');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enableVisualizer, isPlaying]);

  // Mouse activity auto-hide for center controls & cursor
  const handleMouseMove = () => {
    setShowCenterControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowCenterControls(false);
      }, 2500);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files);
    }
  };

  // Compute CSS filter string
  const cssFilter = `
    brightness(${videoFilters.brightness}%) 
    contrast(${videoFilters.contrast}%) 
    saturate(${videoFilters.saturate}%) 
    hue-rotate(${videoFilters.hueRotate}deg) 
    blur(${videoFilters.blur}px) 
    sepia(${videoFilters.sepia}%) 
    invert(${videoFilters.invert}%)
  `.trim();

  // Aspect ratio classes
  let aspectStyle: React.CSSProperties = { objectFit: 'contain' };
  if (aspectRatio === '16:9') aspectStyle = { aspectRatio: '16/9', objectFit: 'cover' };
  if (aspectRatio === '4:3') aspectStyle = { aspectRatio: '4/3', objectFit: 'cover' };
  if (aspectRatio === 'fill') aspectStyle = { objectFit: 'fill' };
  if (aspectRatio === 'original') aspectStyle = { objectFit: 'none' };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={onToggleFullscreen}
      className="relative flex-1 w-full h-full bg-[#050811] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.06)_0%,transparent_70%)]" />

      {/* Main HTML5 Video Element */}
      {currentMedia ? (
        <video
          ref={videoRef}
          src={currentMedia.url}
          style={{ ...aspectStyle, filter: cssFilter }}
          className="w-full h-full max-h-full transition-all duration-150"
          onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
          onDurationChange={(e) => onDurationChange(e.currentTarget.duration)}
          onEnded={onEnded}
          onWaiting={onWaiting}
          onPlaying={onPlaying}
          onError={onError}
          playsInline
        />
      ) : (
        /* Empty State / Standby Screen */
        <div className="flex flex-col items-center justify-center gap-4 text-center px-6 max-w-md z-10">
          <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 shadow-2xl">
            <UploadCloud className="w-10 h-10 text-sky-400/80 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-200">No Media Loaded</h2>
            <p className="text-xs text-slate-400 mt-1">
              Drag and drop local video or audio files here, or use the menu above to open files or folders.
            </p>
          </div>
        </div>
      )}

      {/* Audio Mode Graphic Backdrop (if playing an audio-only track) */}
      {currentMedia && currentMedia.type === 'audio' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-900 to-indigo-950 border border-sky-500/30 flex items-center justify-center shadow-2xl shadow-sky-900/30">
            <div className="text-center p-3">
              <span className="text-3xl">🎵</span>
              <p className="text-xs font-semibold text-slate-200 mt-2 truncate max-w-[110px]">{currentMedia.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentMedia.artist || 'Audio Track'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Visualizer Canvas */}
      {enableVisualizer && (
        <canvas
          ref={canvasRef}
          width={480}
          height={96}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-70"
        />
      )}

      {/* Reference Design: Center Glowing Amber Play Button */}
      {(!isPlaying || showCenterControls) && currentMedia && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="absolute z-20 w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all duration-200 flex items-center justify-center text-white shadow-[0_0_30px_rgba(245,158,11,0.65)] hover:shadow-[0_0_45px_rgba(245,158,11,0.85)] cursor-pointer group"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-white text-white" />
          ) : (
            <Play className="w-7 h-7 fill-white text-white ml-1 group-hover:scale-105 transition-transform" />
          )}
        </button>
      )}

      {/* Subtitle Display Overlay */}
      {subtitleText && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[85%] text-center">
          <span className="inline-block px-4 py-1.5 rounded bg-black/80 text-yellow-300 font-medium text-sm md:text-base tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-black/40">
            {subtitleText}
          </span>
        </div>
      )}

      {/* On-Screen Display (OSD) Message */}
      {osdMessage && (
        <div className="absolute top-6 right-6 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-sky-500/40 text-sky-300 text-xs font-semibold backdrop-blur-md shadow-2xl flex items-center gap-2">
            <span>{osdMessage}</span>
          </div>
        </div>
      )}

      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-40 bg-sky-950/85 backdrop-blur-sm border-2 border-dashed border-sky-400 flex flex-col items-center justify-center text-sky-200 pointer-events-none animate-in fade-in duration-100">
          <UploadCloud className="w-16 h-16 text-sky-400 animate-bounce mb-3" />
          <p className="text-lg font-bold">Drop files to play in VLC 11 Player</p>
          <p className="text-xs text-sky-300 mt-1">Supports MP4, WebM, MP3, WAV, OGG, and SRT/VTT subtitles</p>
        </div>
      )}
    </div>
  );
};
