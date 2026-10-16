import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  FolderOpen, 
  FileText, 
  Play, 
  Pause, 
  Square as StopIcon, 
  SkipForward, 
  SkipBack, 
  Sliders, 
  Maximize, 
  Sparkles, 
  HelpCircle, 
  Keyboard, 
  Info,
  Sun,
  Moon,
  ListMusic,
  Tv,
  Music,
  Trash2,
  LogOut
} from 'lucide-react';

interface TitleBarProps {
  currentTitle?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onOpenSubtitle: () => void;
  onOpenEqualizer: () => void;
  onOpenVideoEffects: () => void;
  onOpenCodecInfo: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onTogglePlaylist: () => void;
  onToggleSidebar: () => void;
  onToggleNav?: (key: string) => void;
  onToggleFullscreen: () => void;
  onToggleTheme: () => void;
  onLoadSamples: () => void;
  onClearLibrary: () => void;
  onSetSpeed: (speed: number) => void;
  onSetAspectRatio: (ratio: any) => void;
  theme: 'dark' | 'light';
  navigation?: any;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentTitle = 'VLC 11 Player',
  isPlaying,
  onTogglePlay,
  onStop,
  onNext,
  onPrev,
  onOpenFile,
  onOpenFolder,
  onOpenSubtitle,
  onOpenEqualizer,
  onOpenVideoEffects,
  onOpenCodecInfo,
  onOpenShortcuts,
  onOpenAbout,
  onOpenSettings,
  onTogglePlaylist,
  onToggleSidebar,
  onToggleNav,
  onToggleFullscreen,
  onToggleTheme,
  onLoadSamples,
  onClearLibrary,
  onSetSpeed,
  onSetAspectRatio,
  theme,
  navigation
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExitApp = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  const menuItems = [
    {
      id: 'media',
      label: 'Media',
      options: [
        { label: 'Open File...', shortcut: 'Ctrl+O', icon: Film, action: onOpenFile },
        { label: 'Open Folder / Library...', shortcut: 'Ctrl+Shift+O', icon: FolderOpen, action: onOpenFolder },
        { label: 'Load Subtitle File...', shortcut: 'Ctrl+S', icon: FileText, action: onOpenSubtitle },
        { separator: true },
        { label: 'Load Demo Showcase Media', shortcut: '', icon: Sparkles, action: onLoadSamples },
        { label: 'Clear Library History', shortcut: '', icon: Trash2, action: onClearLibrary },
        { separator: true },
        { label: 'Exit Application', shortcut: 'Alt+F4', icon: LogOut, action: handleExitApp }
      ]
    },
    {
      id: 'playback',
      label: 'Playback',
      options: [
        { label: isPlaying ? 'Pause' : 'Play', shortcut: 'Space', icon: isPlaying ? Pause : Play, action: onTogglePlay },
        { label: 'Stop Playback', shortcut: 'S', icon: StopIcon, action: onStop },
        { label: 'Previous Track', shortcut: 'P', icon: SkipBack, action: onPrev },
        { label: 'Next Track', shortcut: 'N', icon: SkipForward, action: onNext },
        { separator: true },
        { label: 'Speed: Slower (0.75x)', shortcut: '[', action: () => onSetSpeed(0.75) },
        { label: 'Speed: Normal (1.0x)', shortcut: '=', action: () => onSetSpeed(1.0) },
        { label: 'Speed: Faster (1.25x)', shortcut: ']', action: () => onSetSpeed(1.25) },
        { label: 'Speed: Fast Forward (2.0x)', shortcut: '', action: () => onSetSpeed(2.0) }
      ]
    },
    {
      id: 'audio',
      label: 'Audio',
      options: [
        { label: '10-Band Graphic Equalizer', shortcut: 'Ctrl+E', icon: Sliders, action: onOpenEqualizer },
        { separator: true },
        { label: 'Volume +5%', shortcut: 'Up' },
        { label: 'Volume -5%', shortcut: 'Down' },
        { label: 'Mute / Unmute', shortcut: 'M' }
      ]
    },
    {
      id: 'video',
      label: 'Video',
      options: [
        { label: 'Full Screen Mode', shortcut: 'F11 / F', icon: Maximize, action: onToggleFullscreen },
        { separator: true },
        { label: 'Video Effects & Color Tuning', shortcut: 'Ctrl+V', icon: Sparkles, action: onOpenVideoEffects },
        { separator: true },
        { label: 'Aspect Ratio: Fit Window', action: () => onSetAspectRatio('fit') },
        { label: 'Aspect Ratio: 16:9 Widescreen', action: () => onSetAspectRatio('16:9') },
        { label: 'Aspect Ratio: 4:3 Standard', action: () => onSetAspectRatio('4:3') },
        { label: 'Aspect Ratio: Original', action: () => onSetAspectRatio('original') }
      ]
    },
    {
      id: 'subtitles',
      label: 'Subtitles',
      options: [
        { label: 'Add Subtitle File (.srt, .vtt)...', shortcut: '', icon: FileText, action: onOpenSubtitle }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      options: [
        { label: 'Audio Equalizer', icon: Sliders, action: onOpenEqualizer },
        { label: 'Video Effects', icon: Sparkles, action: onOpenVideoEffects },
        { separator: true },
        { label: 'Codec & Format Compatibility Guide', icon: Info, action: onOpenCodecInfo },
        { separator: true },
        { label: 'Preferences & Navigation Settings', shortcut: 'Ctrl+P', action: onOpenSettings }
      ]
    },
    {
      id: 'view',
      label: 'View',
      options: [
        { label: 'Toggle Playlist Queue', shortcut: 'Ctrl+L', icon: ListMusic, action: onTogglePlaylist },
        { label: 'Toggle Navigation Sidebar', shortcut: 'Ctrl+B', icon: Tv, action: onToggleSidebar },
        { separator: true },
        { 
          label: navigation?.showHome ? 'Hide Home Tab' : 'Show Home Tab', 
          action: () => onToggleNav && onToggleNav('showHome') 
        },
        { 
          label: navigation?.showVideos ? 'Hide Videos Tab' : 'Show Videos Tab', 
          action: () => onToggleNav && onToggleNav('showVideos') 
        },
        { 
          label: navigation?.showMusic ? 'Hide Music Tab' : 'Show Music Tab', 
          action: () => onToggleNav && onToggleNav('showMusic') 
        },
        { separator: true },
        { label: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme', icon: theme === 'dark' ? Sun : Moon, action: onToggleTheme }
      ]
    },
    {
      id: 'help',
      label: 'Help',
      options: [
        { label: 'Keyboard Shortcuts Reference', shortcut: '?', icon: Keyboard, action: onOpenShortcuts },
        { separator: true },
        { label: 'About VLC 11 Player', shortcut: '', icon: HelpCircle, action: onOpenAbout }
      ]
    }
  ];

  return (
    <div className="relative select-none z-50 bg-[#070b14]/95 text-slate-200 border-b border-slate-800/80 px-2 py-1 flex items-center justify-between text-xs font-sans backdrop-blur-md">
      {/* Left: App Logo & Classic Desktop Menu Bar */}
      <div className="flex items-center gap-2" ref={menuRef}>
        {/* App Emblem */}
        <div className="flex items-center gap-1.5 px-1 py-0.5 rounded hover:bg-slate-800/60 transition-colors cursor-pointer" onClick={onOpenAbout}>
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-sky-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_8px_rgba(0,180,216,0.5)]">
            <div className="w-full h-full bg-[#070b14] rounded-full flex items-center justify-center">
              <span className="text-[9px] font-bold text-amber-400">11</span>
            </div>
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-[13px]">VLC 11</span>
        </div>

        {/* Dropdown Menu Bar Items */}
        <div className="hidden sm:flex items-center">
          {menuItems.map((item) => {
            const isOpen = activeMenu === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveMenu(isOpen ? null : item.id)}
                  onMouseEnter={() => {
                    if (activeMenu !== null) setActiveMenu(item.id);
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    isOpen ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 min-w-[240px] bg-[#0c1322] border border-slate-700/80 rounded-md shadow-2xl py-1 z-50 backdrop-blur-xl animate-in fade-in duration-100">
                    {item.options.map((opt: any, idx) => {
                      if (opt.separator) {
                        return <div key={idx} className="my-1 border-t border-slate-800" />;
                      }
                      const Icon = opt.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (opt.action) opt.action();
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-sky-600/20 hover:text-sky-300 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            {Icon ? <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" /> : <div className="w-3.5" />}
                            <span>{opt.label}</span>
                          </div>
                          {opt.shortcut && (
                            <span className="text-[10px] text-slate-500 font-mono group-hover:text-sky-400/80 ml-4">
                              {opt.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: Current Media Title */}
      <div className="flex-1 text-center truncate px-4 pointer-events-none">
        <span className="text-xs font-medium text-slate-400 truncate max-w-md inline-block">
          {currentTitle}
        </span>
      </div>

      {/* Right: Clean Spacer to maintain center title alignment */}
      <div className="hidden sm:block w-24 pointer-events-none" />
    </div>
  );
};
