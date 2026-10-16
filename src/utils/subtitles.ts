import { SubtitleCue } from '../types/player.ts';

/**
 * Parses timestamp string "00:01:23,456" or "00:01:23.456" or "01:23.456" to seconds
 */
function parseTimestamp(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().replace(',', '.');
  const parts = cleaned.split(':');

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseFloat(cleaned) || 0;
}

/**
 * Parses raw SRT or VTT subtitle text into an array of SubtitleCue
 */
export function parseSubtitleText(rawText: string): SubtitleCue[] {
  if (!rawText || typeof rawText !== 'string') return [];

  // Normalize line endings
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split(/\n\n+/);
  const cues: SubtitleCue[] = [];

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    // Look for arrow "-->" in lines
    let timeLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) continue;

    const timeLine = lines[timeLineIndex];
    const [startStr, endStr] = timeLine.split('-->').map(s => s.trim().split(' ')[0]);

    const start = parseTimestamp(startStr);
    const end = parseTimestamp(endStr);

    if (isNaN(start) || isNaN(end) || end < start) continue;

    // The text is whatever follows the timeLine
    const textLines = lines.slice(timeLineIndex + 1);
    // Strip HTML/WebVTT tags like <v ...>, <b>, <i>, <c.color> for clean rendering
    const text = textLines
      .join('\n')
      .replace(/<[^>]+>/g, '')
      .trim();

    if (text) {
      cues.push({
        start,
        end,
        text
      });
    }
  }

  // Sort by start time
  return cues.sort((a, b) => a.start - b.start);
}

/**
 * Finds the active subtitle text for the current playback time with optional offset
 */
export function getActiveSubtitleText(cues: SubtitleCue[], currentTime: number, offsetSeconds = 0): string | null {
  if (!cues || cues.length === 0) return null;
  const adjustedTime = currentTime + offsetSeconds;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (adjustedTime >= cue.start && adjustedTime <= cue.end) {
      return cue.text;
    }
  }
  return null;
}
