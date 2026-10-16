export type MediaType = 'video' | 'audio';

export interface MediaItem {
  id: string;
  title: string;
  name: string;
  url: string;
  path?: string;
  type: MediaType;
  duration: number;
  size?: number;
  artist?: string;
  album?: string;
  thumbnail?: string;
  codec?: string;
  resolution?: string;
  sampleRate?: string;
  addedAt: number;
  lastPlayedAt?: number;
}

export interface Playlist {
  id: string;
  name: string;
  itemIds: string[];
  createdAt: number;
}

export interface SubtitleCue {
  id?: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  cues: SubtitleCue[];
  sourceName?: string;
}

export interface AudioEqualizerPreset {
  name: string;
  bands: number[]; // 10 bands: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz (-12 to +12 dB)
}

export interface VideoFilterSettings {
  brightness: number;  // 50 to 150 (default 100%)
  contrast: number;    // 50 to 150 (default 100%)
  saturate: number;    // 0 to 200 (default 100%)
  hueRotate: number;   // 0 to 360 (default 0 deg)
  blur: number;        // 0 to 10 (default 0 px)
  sepia: number;       // 0 to 100 (default 0%)
  invert: number;      // 0 to 100 (default 0%)
}

export type RepeatMode = 'off' | 'all' | 'one';
export type AspectRatioMode = 'fit' | '16:9' | '4:3' | 'original' | 'fill';
export type ActiveTab = 'home' | 'videos' | 'music' | 'playlists' | 'library' | 'subtitles' | 'settings';

export interface NavigationSettings {
  showSidebar: boolean;
  showHome: boolean;
  showVideos: boolean;
  showMusic: boolean;
  showPlaylists: boolean;
  showLibrary: boolean;
  showSubtitles: boolean;
}

export interface PlayerSettings {
  volume: number; // 0 to 1 (or up to 2 for 200% VLC boost)
  muted: boolean;
  speed: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  theme: 'dark' | 'light';
  aspectRatio: AspectRatioMode;
  audioBoost: boolean;
  enableVisualizer: boolean;
  subtitleOffset: number; // in seconds (-5 to +5)
  subtitleSize: number;   // font size in px
  navigation: NavigationSettings;
}

// Global declaration for window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      platform: string;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<boolean>;
      closeWindow: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      setFullScreen: (flag: boolean) => Promise<void>;
      openFileDialog: (options?: any) => Promise<{ canceled: boolean; files: any[] }>;
      openFolderDialog: () => Promise<{ canceled: boolean; folderPath?: string; files: any[] }>;
      openSubtitleDialog: () => Promise<{ canceled: boolean; fileName?: string; filePath?: string; content?: string }>;
      readSubtitleFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      getAppVersion: () => Promise<string>;
      onMenuAction: (callback: (action: string, payload?: any) => void) => () => void;
      onWindowStateChange: (callback: (state: string) => void) => () => void;
    };
  }
}
