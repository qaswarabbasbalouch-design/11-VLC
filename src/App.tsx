/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TitleBar } from './components/TitleBar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { VideoPlayer } from './components/VideoPlayer.tsx';
import { ControlBar } from './components/ControlBar.tsx';
import { PlaylistDrawer } from './components/PlaylistDrawer.tsx';
import { EqualizerModal } from './components/EqualizerModal.tsx';
import { VideoEffectsModal } from './components/VideoEffectsModal.tsx';
import { CodecInfoModal } from './components/CodecInfoModal.tsx';
import { ShortcutsModal } from './components/ShortcutsModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { MediaViews } from './components/MediaViews.tsx';
import { 
  MediaItem, 
  Playlist, 
  SubtitleTrack, 
  VideoFilterSettings, 
  PlayerSettings, 
  ActiveTab, 
  AspectRatioMode 
} from './types/player.ts';
import { INITIAL_SAMPLE_MEDIA, SAMPLE_SUBTITLES } from './utils/sampleMedia.ts';
import { parseSubtitleText, getActiveSubtitleText } from './utils/subtitles.ts';
import { audioEngine } from './utils/audioEngine.ts';

const DEFAULT_FILTERS: VideoFilterSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
  sepia: 0,
  invert: 0
};

const DEFAULT_SETTINGS: PlayerSettings = {
  volume: 0.9,
  muted: false,
  speed: 1.0,
  repeatMode: 'off',
  shuffle: false,
  theme: 'dark',
  aspectRatio: 'fit',
  audioBoost: true,
  enableVisualizer: false,
  subtitleOffset: 0,
  subtitleSize: 16,
  navigation: {
    showSidebar: true,
    showHome: true,
    showVideos: true,
    showMusic: true,
    showPlaylists: true,
    showLibrary: true,
    showSubtitles: true
  }
};

export default function App() {
  // Persistent or Sample Media
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('vlc11_media_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SAMPLE_MEDIA;
  });

  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(() => {
    return mediaList.length > 0 ? mediaList[0] : null;
  });

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_SETTINGS.volume);
  const [muted, setMuted] = useState(DEFAULT_SETTINGS.muted);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [repeatMode, setRepeatMode] = useState(DEFAULT_SETTINGS.repeatMode);
  const [shuffle, setShuffle] = useState(DEFAULT_SETTINGS.shuffle);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Settings & Navigation (with localStorage persistence)
  const [settings, setSettings] = useState<PlayerSettings>(() => {
    try {
      const saved = localStorage.getItem('vlc11_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          navigation: {
            ...DEFAULT_SETTINGS.navigation,
            ...(parsed.navigation || {})
          }
        };
      }
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vlc11_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const [videoFilters, setVideoFilters] = useState<VideoFilterSettings>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('vlc11_playlists');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'playlist-favorites',
        name: 'Favorites',
        itemIds: ['sample-video-1', 'sample-audio-1'],
        createdAt: Date.now()
      }
    ];
  });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>('playlist-favorites');

  // Subtitles
  const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>([
    {
      id: 'sub-default',
      label: 'English [Demonstration]',
      language: 'en',
      cues: SAMPLE_SUBTITLES
    }
  ]);
  const [activeSubtitleId, setActiveSubtitleId] = useState<string | null>('sub-default');

  // Modals & Panels
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showVideoEffects, setShowVideoEffects] = useState(false);
  const [showCodecInfo, setShowCodecInfo] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // OSD Notifications
  const [osdMessage, setOsdMessage] = useState<string | null>(null);
  const osdTimerRef = useRef<any>(null);

  const showOsd = useCallback((msg: string) => {
    setOsdMessage(msg);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = setTimeout(() => {
      setOsdMessage(null);
    }, 1800);
  }, []);

  // HTML5 Media Elements & Inputs References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const subtitleInputRef = useRef<HTMLInputElement | null>(null);

  // Save media list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vlc11_media_list', JSON.stringify(mediaList));
    } catch (e) {}
  }, [mediaList]);

  // Save playlists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vlc11_playlists', JSON.stringify(playlists));
    } catch (e) {}
  }, [playlists]);

  // Video Element playback synchronization
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentMedia]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = muted ? 0 : Math.min(1, volume);
  }, [volume, muted]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
  }, [speed]);

  // Compute active subtitle text
  const currentSubtitleTrack = subtitleTracks.find(t => t.id === activeSubtitleId);
  const activeSubtitleText = currentSubtitleTrack
    ? getActiveSubtitleText(currentSubtitleTrack.cues, currentTime, settings.subtitleOffset)
    : null;

  // Handlers for playback controls
  const handleTogglePlay = () => {
    audioEngine.resumeContext();
    setIsPlaying(prev => {
      const next = !prev;
      showOsd(next ? 'Playing' : 'Paused');
      return next;
    });
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    showOsd('Stopped');
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const handleSeekRelative = (secondsDelta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + secondsDelta));
    handleSeek(newTime);
    showOsd(`${secondsDelta > 0 ? '+' : ''}${secondsDelta}s`);
  };

  const handleNext = () => {
    if (mediaList.length === 0) return;
    const currentIndex = mediaList.findIndex(m => m.id === currentMedia?.id);
    let nextIndex = 0;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * mediaList.length);
    } else if (currentIndex !== -1 && currentIndex < mediaList.length - 1) {
      nextIndex = currentIndex + 1;
    }
    setCurrentMedia(mediaList[nextIndex]);
    setIsPlaying(true);
    showOsd(`Next: ${mediaList[nextIndex].title}`);
  };

  const handlePrev = () => {
    if (mediaList.length === 0) return;
    const currentIndex = mediaList.findIndex(m => m.id === currentMedia?.id);
    let prevIndex = mediaList.length - 1;
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    }
    setCurrentMedia(mediaList[prevIndex]);
    setIsPlaying(true);
    showOsd(`Previous: ${mediaList[prevIndex].title}`);
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else if (repeatMode === 'all' || mediaList.length > 1) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setMuted(false);
    showOsd(`Volume: ${Math.round(newVol * 100)}%`);
  };

  const handleVolumeStep = (delta: number) => {
    const newVol = Math.max(0, Math.min(1.5, volume + delta));
    handleVolumeChange(newVol);
  };

  const handleToggleMute = () => {
    setMuted(prev => {
      showOsd(!prev ? 'Muted' : `Volume: ${Math.round(volume * 100)}%`);
      return !prev;
    });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    showOsd(`Speed: ${newSpeed}x`);
  };

  const handleToggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setRepeatMode(nextMode);
    showOsd(`Repeat: ${nextMode.toUpperCase()}`);
  };

  const handleToggleShuffle = () => {
    setShuffle(prev => {
      showOsd(`Shuffle: ${!prev ? 'ON' : 'OFF'}`);
      return !prev;
    });
  };

  const handleToggleFullscreen = () => {
    if (window.electronAPI) {
      window.electronAPI.setFullScreen(!isFullscreen);
      setIsFullscreen(!isFullscreen);
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleTogglePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP error:', err);
      }
    }
  };

  // File addition logic
  const addFilesToLibrary = (files: File[] | FileList) => {
    const newItems: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isVideo = ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext);
      const isAudio = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext);
      const isSub = ['srt', 'vtt'].includes(ext);

      if (isSub) {
        // Parse subtitle file
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            const cues = parseSubtitleText(content);
            const newTrack: SubtitleTrack = {
              id: 'sub-' + Date.now(),
              label: file.name,
              language: 'local',
              cues
            };
            setSubtitleTracks(prev => [...prev, newTrack]);
            setActiveSubtitleId(newTrack.id);
            showOsd(`Loaded Subtitle: ${file.name}`);
          }
        };
        reader.readAsText(file);
        return;
      }

      if (isVideo || isAudio) {
        const url = URL.createObjectURL(file);
        newItems.push({
          id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          title: file.name.replace(/\.[^/.]+$/, ''),
          name: file.name,
          url,
          type: isVideo ? 'video' : 'audio',
          duration: 0,
          size: file.size,
          codec: isVideo ? 'H.264 / AVC' : 'Audio Track',
          resolution: isVideo ? 'Local Video' : 'Audio Only',
          addedAt: Date.now()
        });
      }
    });

    if (newItems.length > 0) {
      setMediaList(prev => [...newItems, ...prev]);
      setCurrentMedia(newItems[0]);
      setIsPlaying(true);
      setActiveTab('home');
      showOsd(`Added ${newItems.length} media file(s)`);
    }
  };

  // Open file dialogs (Electron Native or HTML5 Web input)
  const handleOpenFile = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openFileDialog({ multiSelections: true });
      if (!result.canceled && result.files.length > 0) {
        setMediaList(prev => [...result.files, ...prev]);
        setCurrentMedia(result.files[0]);
        setIsPlaying(true);
        setActiveTab('home');
        showOsd(`Opened ${result.files[0].name}`);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleOpenFolder = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openFolderDialog();
      if (!result.canceled && result.files.length > 0) {
        setMediaList(prev => [...result.files, ...prev]);
        setCurrentMedia(result.files[0]);
        setIsPlaying(true);
        setActiveTab('home');
        showOsd(`Loaded ${result.files.length} items from folder`);
      }
    } else {
      folderInputRef.current?.click();
    }
  };

  const handleOpenSubtitle = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openSubtitleDialog();
      if (!result.canceled && result.content) {
        const cues = parseSubtitleText(result.content);
        const newTrack: SubtitleTrack = {
          id: 'sub-' + Date.now(),
          label: result.fileName || 'Subtitle File',
          language: 'local',
          cues
        };
        setSubtitleTracks(prev => [...prev, newTrack]);
        setActiveSubtitleId(newTrack.id);
        showOsd(`Loaded Subtitle: ${result.fileName}`);
      }
    } else {
      subtitleInputRef.current?.click();
    }
  };

  const handleLoadSamples = () => {
    setMediaList(INITIAL_SAMPLE_MEDIA);
    setCurrentMedia(INITIAL_SAMPLE_MEDIA[0]);
    setIsPlaying(false);
    showOsd('Loaded Showcase Demo Media');
  };

  const handleClearLibrary = () => {
    setMediaList([]);
    setCurrentMedia(null);
    setIsPlaying(false);
    showOsd('Cleared Media Library');
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
    if (currentMedia?.id === id) {
      setCurrentMedia(null);
      setIsPlaying(false);
    }
    showOsd('Item removed');
  };

  const handleMovePlaylistItem = (fromIdx: number, toIdx: number) => {
    setMediaList(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  const handleCreatePlaylist = () => {
    const name = prompt('Enter new playlist name:', 'New Playlist');
    if (name && name.trim()) {
      const newPl: Playlist = {
        id: 'pl-' + Date.now(),
        name: name.trim(),
        itemIds: currentMedia ? [currentMedia.id] : [],
        createdAt: Date.now()
      };
      setPlaylists(prev => [...prev, newPl]);
      setSelectedPlaylistId(newPl.id);
      showOsd(`Created playlist "${name.trim()}"`);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    showOsd('Playlist deleted');
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside text input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeekRelative(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeekRelative(5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeStep(0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeStep(-0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        handleStop();
      } else if (e.key === 'n' || e.key === 'N') {
        handleNext();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePrev();
      } else if (e.key === ']') {
        handleSpeedChange(Math.min(2.5, +(speed + 0.25).toFixed(2)));
      } else if (e.key === '[') {
        handleSpeedChange(Math.max(0.25, +(speed - 0.25).toFixed(2)));
      } else if (e.key === '=') {
        handleSpeedChange(1.0);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          handleToggleFullscreen();
        } else {
          setShowEqualizer(false);
          setShowVideoEffects(false);
          setShowCodecInfo(false);
          setShowShortcuts(false);
          setShowAbout(false);
          setShowPlaylistDrawer(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, speed, currentMedia, isFullscreen]);

  // Toggle individual navigation tabs (Home, Videos, Music, etc.)
  const handleToggleNav = (key: string) => {
    setSettings(prev => {
      const currentVal = (prev.navigation as any)[key] ?? true;
      const updatedNav = { ...prev.navigation, [key]: !currentVal };
      showOsd(`${key.replace('show', '')} Tab: ${!currentVal ? 'Shown' : 'Hidden'}`);
      return { ...prev, navigation: updatedNav };
    });
  };

  // Toggle master navigation sidebar visibility
  const handleToggleSidebar = () => {
    setSettings(prev => {
      const currentShow = prev.navigation?.showSidebar ?? true;
      showOsd(`Sidebar: ${!currentShow ? 'Visible' : 'Hidden (Cinema)'}`);
      return {
        ...prev,
        navigation: {
          ...prev.navigation,
          showSidebar: !currentShow
        }
      };
    });
  };

  // Native Electron Menu Actions Listener
  useEffect(() => {
    if (window.electronAPI) {
      const unsubscribe = window.electronAPI.onMenuAction((action, payload) => {
        if (action === 'open-file') handleOpenFile();
        if (action === 'open-folder') handleOpenFolder();
        if (action === 'open-subtitle') handleOpenSubtitle();
        if (action === 'toggle-play') handleTogglePlay();
        if (action === 'stop') handleStop();
        if (action === 'next-track') handleNext();
        if (action === 'prev-track') handlePrev();
        if (action === 'seek-forward-5') handleSeekRelative(5);
        if (action === 'seek-backward-5') handleSeekRelative(-5);
        if (action === 'speed-up') handleSpeedChange(Math.min(2.5, speed + 0.25));
        if (action === 'speed-down') handleSpeedChange(Math.max(0.25, speed - 0.25));
        if (action === 'speed-normal') handleSpeedChange(1.0);
        if (action === 'volume-up') handleVolumeStep(0.05);
        if (action === 'volume-down') handleVolumeStep(-0.05);
        if (action === 'toggle-mute') handleToggleMute();
        if (action === 'toggle-equalizer') setShowEqualizer(prev => !prev);
        if (action === 'toggle-video-effects') setShowVideoEffects(prev => !prev);
        if (action === 'toggle-playlist') setShowPlaylistDrawer(prev => !prev);
        if (action === 'toggle-sidebar') handleToggleSidebar();
        if (action === 'toggle-fullscreen') handleToggleFullscreen();
        if (action === 'toggle-theme') setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
        if (action === 'open-about') setShowAbout(true);
        if (action === 'open-shortcuts') setShowShortcuts(true);
        if (action === 'aspect-ratio' && payload) setSettings(s => ({ ...s, aspectRatio: payload }));
      });
      return unsubscribe;
    }
  }, [speed, volume, isFullscreen]);

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden font-sans ${
      settings.theme === 'dark' ? 'bg-[#070b14] text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden Web File Inputs (Fallbacks for browser preview) */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="video/*,audio/*,.srt,.vtt,.mkv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFilesToLibrary(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={folderInputRef}
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFilesToLibrary(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={subtitleInputRef}
        accept=".srt,.vtt"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFilesToLibrary(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Top Application Title & Menu Bar */}
      <TitleBar
        currentTitle={currentMedia ? currentMedia.title : 'VLC 11 Player'}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        onNext={handleNext}
        onPrev={handlePrev}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onOpenSubtitle={handleOpenSubtitle}
        onOpenEqualizer={() => setShowEqualizer(true)}
        onOpenVideoEffects={() => setShowVideoEffects(true)}
        onOpenCodecInfo={() => setShowCodecInfo(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onOpenAbout={() => setShowAbout(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onTogglePlaylist={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
        onToggleSidebar={handleToggleSidebar}
        onToggleNav={handleToggleNav}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleTheme={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}
        onLoadSamples={handleLoadSamples}
        onClearLibrary={handleClearLibrary}
        onSetSpeed={handleSpeedChange}
        onSetAspectRatio={(ratio: AspectRatioMode) => setSettings(s => ({ ...s, aspectRatio: ratio }))}
        theme={settings.theme}
        navigation={settings.navigation}
      />

      {/* Main Player & Sidebar Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Left Navigation Sidebar (respects showSidebar and tab toggles) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          playlists={playlists}
          onSelectPlaylist={setSelectedPlaylistId}
          selectedPlaylistId={selectedPlaylistId}
          onCreatePlaylist={handleCreatePlaylist}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          videoCount={mediaList.filter(m => m.type === 'video').length}
          musicCount={mediaList.filter(m => m.type === 'audio').length}
          totalMediaCount={mediaList.length}
          onOpenEqualizer={() => setShowEqualizer(true)}
          navigation={settings.navigation}
        />

        {/* Central View Area: Video Player or Other Tab Views */}
        {activeTab === 'home' ? (
          <VideoPlayer
            currentMedia={currentMedia}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            muted={muted}
            speed={speed}
            subtitleText={activeSubtitleText}
            videoFilters={videoFilters}
            aspectRatio={settings.aspectRatio}
            enableVisualizer={settings.enableVisualizer || (currentMedia?.type === 'audio')}
            onTogglePlay={handleTogglePlay}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
            onEnded={handleEnded}
            onWaiting={() => {}}
            onPlaying={() => setIsPlaying(true)}
            onError={(e) => {
              console.warn('Playback error:', e);
              showOsd('Error playing media format');
            }}
            onFileDrop={addFilesToLibrary}
            onToggleFullscreen={handleToggleFullscreen}
            videoRef={videoRef}
            osdMessage={osdMessage}
          />
        ) : (
          <MediaViews
            activeTab={activeTab}
            mediaList={mediaList}
            playlists={playlists}
            currentMediaId={currentMedia?.id}
            selectedPlaylistId={selectedPlaylistId}
            settings={settings}
            subtitleTracks={subtitleTracks}
            activeSubtitleId={activeSubtitleId}
            onPlayMedia={(item) => {
              setCurrentMedia(item);
              setIsPlaying(true);
              setActiveTab('home');
              showOsd(`Playing: ${item.title}`);
            }}
            onRemoveMedia={handleRemoveMedia}
            onOpenFile={handleOpenFile}
            onOpenFolder={handleOpenFolder}
            onOpenSubtitle={handleOpenSubtitle}
            onOpenEqualizer={() => setShowEqualizer(true)}
            onOpenVideoEffects={() => setShowVideoEffects(true)}
            onOpenCodecInfo={() => setShowCodecInfo(true)}
            onOpenShortcuts={() => setShowShortcuts(true)}
            onOpenAbout={() => setShowAbout(true)}
            onCreatePlaylist={handleCreatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onSelectSubtitleTrack={setActiveSubtitleId}
            onUpdateSettings={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))}
          />
        )}

        {/* Right Slide-Out Playlist Queue Drawer */}
        <PlaylistDrawer
          isOpen={showPlaylistDrawer}
          onClose={() => setShowPlaylistDrawer(false)}
          playlistName="Active Playback Queue"
          items={mediaList}
          currentMediaId={currentMedia?.id}
          onSelectItem={(item) => {
            setCurrentMedia(item);
            setIsPlaying(true);
            showOsd(`Playing: ${item.title}`);
          }}
          onRemoveItem={handleRemoveMedia}
          onMoveItem={handleMovePlaylistItem}
          onOpenFile={handleOpenFile}
          onClearQueue={handleClearLibrary}
        />
      </div>

      {/* Bottom Playback Control Bar (Matches Reference Image) */}
      <ControlBar
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        muted={muted}
        repeatMode={repeatMode}
        shuffle={shuffle}
        isFullscreen={isFullscreen}
        subtitleTracks={subtitleTracks}
        activeSubtitleId={activeSubtitleId}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        onSeek={handleSeek}
        onPrev={handlePrev}
        onNext={handleNext}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onToggleFullscreen={handleToggleFullscreen}
        onTogglePiP={handleTogglePiP}
        onOpenEqualizer={() => setShowEqualizer(true)}
        onOpenVideoEffects={() => setShowVideoEffects(true)}
        onSelectSubtitleTrack={setActiveSubtitleId}
        onTogglePlaylist={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
      />

      {/* Floating Dialogs and Utility Modals */}
      <EqualizerModal
        isOpen={showEqualizer}
        onClose={() => setShowEqualizer(false)}
      />

      <VideoEffectsModal
        isOpen={showVideoEffects}
        onClose={() => setShowVideoEffects(false)}
        filters={videoFilters}
        onChange={setVideoFilters}
        onReset={() => setVideoFilters(DEFAULT_FILTERS)}
      />

      <CodecInfoModal
        isOpen={showCodecInfo}
        onClose={() => setShowCodecInfo(false)}
      />

      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </div>
  );
}
