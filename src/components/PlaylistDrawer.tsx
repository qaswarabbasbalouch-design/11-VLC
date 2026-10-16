import React, { useState } from 'react';
import { X, Play, Trash2, Plus, Film, Music, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { MediaItem } from '../types/player.ts';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  items: MediaItem[];
  currentMediaId?: string;
  onSelectItem: (item: MediaItem) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onOpenFile: () => void;
  onClearQueue: () => void;
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  playlistName,
  items,
  currentMediaId,
  onSelectItem,
  onRemoveItem,
  onMoveItem,
  onOpenFile,
  onClearQueue
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-[#080d19]/98 border-l border-slate-800 text-slate-200 z-50 flex flex-col shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="truncate">
          <h2 className="font-semibold text-sm text-slate-100 truncate">{playlistName}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} in queue
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
            title="Add Media Files"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tracks in playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-500 text-xs">
            {searchQuery ? 'No tracks match your query' : 'Playlist queue is empty'}
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isCurrent = item.id === currentMediaId;
            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  isCurrent
                    ? 'bg-sky-500/20 border border-sky-500/40 text-sky-200'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                {/* Clickable track info to play */}
                <div
                  className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                    ) : item.type === 'video' ? (
                      <Film className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
                    ) : (
                      <Music className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate leading-tight">{item.title}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                      {formatDuration(item.duration)} · {item.codec || item.type}
                    </p>
                  </div>
                </div>

                {/* Track actions (Reorder & Remove) */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => onMoveItem(idx, idx - 1)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                  )}
                  {idx < items.length - 1 && (
                    <button
                      type="button"
                      onClick={() => onMoveItem(idx, idx + 1)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-400"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onClearQueue}
          className="text-slate-400 hover:text-red-400 transition-colors"
        >
          Clear Queue
        </button>
        <span className="text-[11px] text-slate-500 font-mono">
          VLC 11 Queue
        </span>
      </div>
    </aside>
  );
};
