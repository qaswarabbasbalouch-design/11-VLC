import React, { useState } from 'react';
import { 
  Film, 
  Music, 
  FolderOpen, 
  Play, 
  Trash2, 
  Search, 
  Plus, 
  Clock, 
  Sliders, 
  Sparkles, 
  FileText, 
  Settings as SettingsIcon,
  Sun,
  Moon,
  Info,
  Keyboard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ActiveTab, MediaItem, Playlist, PlayerSettings, SubtitleTrack } from '../types/player.ts';

interface MediaViewsProps {
  activeTab: ActiveTab;
  mediaList: MediaItem[];
  playlists: Playlist[];
  currentMediaId?: string;
  selectedPlaylistId: string | null;
  settings: PlayerSettings;
  subtitleTracks: SubtitleTrack[];
  activeSubtitleId: string | null;
  onPlayMedia: (item: MediaItem) => void;
  onRemoveMedia: (id: string) => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onOpenSubtitle: () => void;
  onOpenEqualizer: () => void;
  onOpenVideoEffects: () => void;
  onOpenCodecInfo: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onCreatePlaylist: () => void;
  onDeletePlaylist: (id: string) => void;
  onSelectSubtitleTrack: (id: string | null) => void;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '--';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export const MediaViews: React.FC<MediaViewsProps> = ({
  activeTab,
  mediaList,
  playlists,
  currentMediaId,
  selectedPlaylistId,
  settings,
  subtitleTracks,
  activeSubtitleId,
  onPlayMedia,
  onRemoveMedia,
  onOpenFile,
  onOpenFolder,
  onOpenSubtitle,
  onOpenEqualizer,
  onOpenVideoEffects,
  onOpenCodecInfo,
  onOpenShortcuts,
  onOpenAbout,
  onCreatePlaylist,
  onDeletePlaylist,
  onSelectSubtitleTrack,
  onUpdateSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio'>('all');

  const videoItems = mediaList.filter(item => item.type === 'video');
  const audioItems = mediaList.filter(item => item.type === 'audio');

  const filteredLibrary = mediaList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || playlists[0];
  const playlistItems = selectedPlaylist
    ? selectedPlaylist.itemIds.map(id => mediaList.find(m => m.id === id)).filter(Boolean) as MediaItem[]
    : [];

  // ===================== VIDEOS VIEW =====================
  if (activeTab === 'videos') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Film className="w-5 h-5 text-sky-400" />
              <span>Video Library</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {videoItems.length} {videoItems.length === 1 ? 'video' : 'videos'} available in library
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFile}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Open Video</span>
          </button>
        </div>

        {videoItems.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Film className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No videos imported yet</p>
            <button
              onClick={onOpenFile}
              className="mt-3 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs transition-colors"
            >
              Select Video File
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videoItems.map((video) => {
              const isPlaying = video.id === currentMediaId;
              return (
                <div
                  key={video.id}
                  onClick={() => onPlayMedia(video)}
                  className={`group relative rounded-xl bg-slate-900/60 border overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${
                    isPlaying ? 'border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail / Aspect Container */}
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Film className="w-10 h-10 text-slate-700 group-hover:text-sky-500 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-sky-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                      {formatDuration(video.duration)}
                    </span>
                  </div>

                  {/* Video Meta */}
                  <div className="p-3">
                    <p className="font-semibold text-xs text-slate-100 truncate">{video.title}</p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{video.resolution || 'HD Video'}</span>
                      <span className="font-mono">{formatFileSize(video.size)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ===================== MUSIC VIEW =====================
  if (activeTab === 'music') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              <span>Music & Audio Tracks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              High-fidelity audio playback with 10-band DSP equalizer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenEqualizer}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Equalizer</span>
            </button>
            <button
              type="button"
              onClick={onOpenFile}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Open Audio</span>
            </button>
          </div>
        </div>

        {audioItems.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Music className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No audio tracks loaded</p>
            <button
              onClick={onOpenFile}
              className="mt-3 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs transition-colors"
            >
              Select Audio File
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {audioItems.map((audio, idx) => {
              const isPlaying = audio.id === currentMediaId;
              return (
                <div
                  key={audio.id}
                  onClick={() => onPlayMedia(audio)}
                  className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isPlaying
                      ? 'bg-sky-500/15 border-sky-500/50 text-sky-200'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono text-slate-500 w-5 text-center">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-slate-100 truncate">{audio.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {audio.artist || 'Unknown Artist'} · {audio.album || 'Audio Album'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span>{audio.sampleRate || '44.1 kHz'}</span>
                    <span className="w-12 text-right">{formatDuration(audio.duration)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ===================== PLAYLISTS VIEW =====================
  if (activeTab === 'playlists') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Playlists Manager</h2>
            <p className="text-xs text-slate-400 mt-1">Organize your media collections</p>
          </div>
          <button
            type="button"
            onClick={onCreatePlaylist}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">{selectedPlaylist?.name || 'Current Playlist'}</h3>
          {playlistItems.length === 0 ? (
            <div className="p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
              No media added to this playlist yet. Add files from the library or drop media here.
            </div>
          ) : (
            <div className="space-y-1.5">
              {playlistItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onPlayMedia(item)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-slate-500 w-5">{idx + 1}</span>
                    <span className="font-medium text-slate-200 truncate">{item.title}</span>
                  </div>
                  <span className="font-mono text-slate-400">{formatDuration(item.duration)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== LIBRARY VIEW =====================
  if (activeTab === 'library') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Media Library</h2>
            <p className="text-xs text-slate-400 mt-1">
              {mediaList.length} total files ({videoItems.length} videos, {audioItems.length} audio)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenFolder}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-sky-400" />
              <span>Scan Folder</span>
            </button>
            <button
              type="button"
              onClick={onOpenFile}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Files</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filterType === 'all' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({mediaList.length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filterType === 'video' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Videos ({videoItems.length})
            </button>
            <button
              onClick={() => setFilterType('audio')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filterType === 'audio' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Audio ({audioItems.length})
            </button>
          </div>
        </div>

        {/* Library Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3 w-10">Type</th>
                <th className="p-3">Title / Filename</th>
                <th className="p-3">Codec / Format</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Size</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLibrary.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => onPlayMedia(item)}
                >
                  <td className="p-3">
                    {item.type === 'video' ? (
                      <Film className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Music className="w-4 h-4 text-amber-400" />
                    )}
                  </td>
                  <td className="p-3 font-medium text-slate-100 max-w-xs truncate">{item.title}</td>
                  <td className="p-3 font-mono text-slate-400">{item.codec || item.type.toUpperCase()}</td>
                  <td className="p-3 font-mono text-slate-400">{formatDuration(item.duration)}</td>
                  <td className="p-3 font-mono text-slate-400">{formatFileSize(item.size)}</td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onRemoveMedia(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove from library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===================== SUBTITLES VIEW =====================
  if (activeTab === 'subtitles') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              <span>Subtitles & Captioning</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supports SubRip (.srt) and WebVTT (.vtt) format parsing
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSubtitle}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Load Subtitle File</span>
          </button>
        </div>

        <div className="mt-6 max-w-xl space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="font-semibold text-xs text-slate-300">Active Subtitle Track</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSelectSubtitleTrack(null)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  activeSubtitleId === null ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold' : 'border-slate-800 text-slate-400'
                }`}
              >
                Disabled (No Subtitles)
              </button>
              {subtitleTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => onSelectSubtitleTrack(track.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    activeSubtitleId === track.id ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{track.label}</span>
                  <span className="font-mono text-[10px] text-slate-500">{track.cues.length} cues</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle Offset Adjustment */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Subtitle Synchronization Delay:</span>
              <span className="font-mono text-sky-400">{settings.subtitleOffset.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={settings.subtitleOffset}
              onChange={(e) => onUpdateSettings({ subtitleOffset: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Shift subtitles earlier (negative) or later (positive) to align with audio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================== SETTINGS VIEW =====================
  if (activeTab === 'settings') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#070b14] text-slate-200">
        <div className="pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-sky-400" />
            <span>Player Preferences & Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure VLC 11 desktop playback and interface</p>
        </div>

        <div className="mt-6 max-w-2xl space-y-5 text-xs">
          {/* Theme Configuration */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Interface Theme</p>
              <p className="text-slate-400 mt-0.5">Toggle between deep dark and light workspace</p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium flex items-center gap-2 transition-colors"
            >
              {settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="capitalize">{settings.theme} Theme</span>
            </button>
          </div>

          {/* Navigation Bar Customization (Home, Videos, Music, etc.) */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200 text-sm">Navigation Menu Display</p>
                <p className="text-slate-400 mt-0.5 text-xs">
                  Choose which navigation tabs to show or hide in the sidebar. Turn off for a clean cinematic view.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentShow = settings.navigation?.showSidebar ?? true;
                  onUpdateSettings({
                    navigation: {
                      ...settings.navigation,
                      showSidebar: !currentShow
                    }
                  });
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  (settings.navigation?.showSidebar ?? true)
                    ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Sidebar: {(settings.navigation?.showSidebar ?? true) ? 'Visible' : 'Hidden'}
              </button>
            </div>

            {/* Individual Navigation Items Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { key: 'showHome', label: 'Home', icon: '🏠', desc: 'Main video player and recent clips' },
                { key: 'showVideos', label: 'Videos', icon: '🎬', desc: 'Video gallery & local files' },
                { key: 'showMusic', label: 'Music', icon: '🎵', desc: 'Audio tracks & equalizer presets' },
                { key: 'showPlaylists', label: 'Playlists', icon: '📋', desc: 'Custom media collections' },
                { key: 'showLibrary', label: 'Library', icon: '📁', desc: 'All loaded media database' },
                { key: 'showSubtitles', label: 'Subtitles', icon: '💬', desc: 'Subtitle files & sync delay' }
              ].map((navItem) => {
                const isShown = settings.navigation ? (settings.navigation as any)[navItem.key] !== false : true;
                return (
                  <div
                    key={navItem.key}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{navItem.icon}</span>
                      <div className="truncate">
                        <p className="font-medium text-slate-200 truncate">{navItem.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{navItem.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdateSettings({
                          navigation: {
                            ...settings.navigation,
                            [navItem.key]: !isShown
                          }
                        });
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors shrink-0 ml-2 ${
                        isShown
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:text-slate-200'
                      }`}
                    >
                      {isShown ? 'Shown' : 'Hidden'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400">Quick presets:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      navigation: {
                        showSidebar: true,
                        showHome: true,
                        showVideos: true,
                        showMusic: true,
                        showPlaylists: true,
                        showLibrary: true,
                        showSubtitles: true
                      }
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                >
                  Show All Tabs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      navigation: {
                        showSidebar: false,
                        showHome: true,
                        showVideos: false,
                        showMusic: false,
                        showPlaylists: false,
                        showLibrary: false,
                        showSubtitles: false
                      }
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cinema Mode (Hide Sidebar)
                </button>
              </div>
            </div>
          </div>

          {/* Audio Visualizer Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Real-Time Audio Visualizer</p>
              <p className="text-slate-400 mt-0.5">Show animated frequency bars over audio and video tracks</p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ enableVisualizer: !settings.enableVisualizer })}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                settings.enableVisualizer ? 'bg-sky-500 text-slate-950 font-semibold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.enableVisualizer ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Quick Links */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <p className="font-semibold text-slate-200">Help & Diagnostics</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={onOpenCodecInfo}
                className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <Info className="w-4 h-4 text-sky-400 mb-1" />
                <p className="font-medium text-slate-200">Codec Guide</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Formats & compatibility</p>
              </button>

              <button
                type="button"
                onClick={onOpenShortcuts}
                className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <Keyboard className="w-4 h-4 text-sky-400 mb-1" />
                <p className="font-medium text-slate-200">Shortcuts</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Keyboard cheat sheet</p>
              </button>

              <button
                type="button"
                onClick={onOpenAbout}
                className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-400 mb-1" />
                <p className="font-medium text-slate-200">About VLC 11</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Version & Build info</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
