import React from 'react';
import { 
  Home, 
  Film, 
  Music, 
  ListMusic, 
  FolderGit2, 
  FileText, 
  Settings, 
  Plus, 
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ActiveTab, Playlist, NavigationSettings } from '../types/player.ts';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  playlists: Playlist[];
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistId: string | null;
  onCreatePlaylist: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  videoCount: number;
  musicCount: number;
  totalMediaCount: number;
  onOpenEqualizer: () => void;
  navigation?: NavigationSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  playlists,
  onSelectPlaylist,
  selectedPlaylistId,
  onCreatePlaylist,
  collapsed,
  onToggleCollapse,
  videoCount,
  musicCount,
  totalMediaCount,
  onOpenEqualizer,
  navigation
}) => {
  // If user turned off sidebar entirely, do not render
  if (navigation && !navigation.showSidebar) {
    return null;
  }

  const allNavItems: { id: ActiveTab; label: string; icon: React.FC<any>; count?: number; visible?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home, visible: navigation ? navigation.showHome : true },
    { id: 'videos', label: 'Videos', icon: Film, count: videoCount, visible: navigation ? navigation.showVideos : true },
    { id: 'music', label: 'Music', icon: Music, count: musicCount, visible: navigation ? navigation.showMusic : true },
    { id: 'library', label: 'Library', icon: FolderGit2, count: totalMediaCount, visible: navigation ? navigation.showLibrary : true },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, count: playlists.length, visible: navigation ? navigation.showPlaylists : true },
    { id: 'subtitles', label: 'Subtitles', icon: FileText, visible: navigation ? navigation.showSubtitles : true },
    { id: 'settings', label: 'Settings', icon: Settings, visible: true }
  ];

  const mainNavItems = allNavItems.filter(item => item.visible !== false);

  return (
    <aside
      className={`h-full bg-[#080d19]/90 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between select-none z-30 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Upper Navigation */}
      <div className="flex-1 py-3 px-2 flex flex-col gap-1 overflow-y-auto">
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-800/60">
          {!collapsed && (
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Navigation
            </span>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Tabs */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.15)] border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Playlists Section */}
        {!collapsed && (
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                My Playlists
              </span>
              <button
                type="button"
                onClick={onCreatePlaylist}
                className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
                title="Create New Playlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              {playlists.map((pl) => {
                const isSelected = selectedPlaylistId === pl.id && activeTab === 'playlists';
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => {
                      onSelectTab('playlists');
                      onSelectPlaylist(pl.id);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="truncate">{pl.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {pl.itemIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lower Quick Tools Card */}
      {!collapsed && (
        <div className="p-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenEqualizer}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-slate-900 to-sky-950/40 border border-slate-800 hover:border-sky-500/40 text-xs text-slate-300 hover:text-sky-300 transition-all group"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-45 transition-transform" />
            <span className="font-medium">Audio Equalizer</span>
          </button>
        </div>
      )}
    </aside>
  );
};
