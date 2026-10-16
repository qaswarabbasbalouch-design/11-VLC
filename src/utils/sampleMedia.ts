import { MediaItem, SubtitleCue } from '../types/player.ts';

export const SAMPLE_SUBTITLES: SubtitleCue[] = [
  { start: 1, end: 4, text: "VLC 11 Player — Next-Generation Media Playback" },
  { start: 5, end: 9, text: "Engineered for Windows 10 & 11 x64 Desktop" },
  { start: 10, end: 15, text: "Supports Hardware-Accelerated Video, Audio Equalizer & Subtitles" },
  { start: 16, end: 22, text: "Drag and drop any local file or open from the desktop menu" },
  { start: 23, end: 28, text: "Press Space to Pause, Arrow Keys to Seek, and F for Fullscreen" },
  { start: 29, end: 35, text: "Adjust 10-Band Graphic Equalizer presets in real time" }
];

export const INITIAL_SAMPLE_MEDIA: MediaItem[] = [
  {
    id: 'sample-video-1',
    title: 'Big Buck Bunny (4K Open Showcase)',
    name: 'Big_Buck_Bunny_1080p.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    duration: 596,
    size: 158000000,
    artist: 'Blender Foundation',
    album: 'Open Source Films',
    codec: 'H.264 / AAC',
    resolution: '1920x1080 @ 60fps',
    sampleRate: '48.0 kHz Stereo',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
    addedAt: Date.now() - 3600000
  },
  {
    id: 'sample-video-2',
    title: 'Elephants Dream (Sci-Fi Animation)',
    name: 'Elephants_Dream_HD.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'video',
    duration: 653,
    size: 172000000,
    artist: 'Orange Open Movie Project',
    album: 'Open Source Cinema',
    codec: 'H.264 / AAC',
    resolution: '1920x1080 @ 24fps',
    sampleRate: '48.0 kHz 5.1',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    addedAt: Date.now() - 7200000
  },
  {
    id: 'sample-video-3',
    title: 'Tears of Steel (VFX Future Laboratory)',
    name: 'Tears_Of_Steel_SciFi.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'video',
    duration: 734,
    size: 210000000,
    artist: 'Mango Project',
    album: 'Blender Institute',
    codec: 'H.264 / AAC',
    resolution: '1920x800 @ 24fps',
    sampleRate: '48.0 kHz Stereo',
    thumbnail: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80',
    addedAt: Date.now() - 10800000
  },
  {
    id: 'sample-audio-1',
    title: 'Cybernetic Horizon (Deep Wave)',
    name: 'Cybernetic_Horizon.mp3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', // Safe audio-visual stream
    type: 'audio',
    duration: 32,
    size: 6400000,
    artist: 'VLC 11 Audio Lab',
    album: 'Synthesized Frequencies',
    codec: 'MPEG-4 Audio / AAC',
    resolution: 'Audio Track',
    sampleRate: '44.1 kHz Stereo',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    addedAt: Date.now() - 14400000
  }
];
