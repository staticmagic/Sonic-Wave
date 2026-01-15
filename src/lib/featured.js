export function getWeeklyFeatured(tracks) {
  if (!tracks?.length) return null;
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  return tracks[week % tracks.length];
}
