import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);

  // playback stats
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // volume 0..1
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("sonicwave_volume");
    const v = saved ? Number(saved) : 0.9;
    return Number.isFinite(v) ? clamp(v, 0, 1) : 0.9;
  });

  // attach listeners once
  useEffect(() => {
    const a = audioRef.current;

    // set initial volume
    a.volume = volume;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setTime(a.currentTime || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  // volume updates
  useEffect(() => {
    const a = audioRef.current;
    a.volume = volume;
    localStorage.setItem("sonicwave_volume", String(volume));
  }, [volume]);

  function play(track) {
    if (!track) return;
    const a = audioRef.current;

    // reset timers for UI
    setTime(0);
    setDuration(0);

    a.src = track.url;
    a.load();

    a.play().catch((err) => {
      console.error("Audio play failed:", err);
      setPlaying(false);
      alert("Audio couldn't play (check console).");
    });

    setCurrent(track);
  }

  function toggle() {
    const a = audioRef.current;
    if (!current) return;

    if (a.paused) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }

  function seek(seconds) {
    const a = audioRef.current;
    if (!Number.isFinite(seconds)) return;
    const s = clamp(seconds, 0, duration || 0);
    a.currentTime = s;
    setTime(s);
  }

  function setVolume(v) {
    const nv = clamp(v, 0, 1);
    setVolumeState(nv);
  }

  const api = useMemo(
    () => ({
      current,
      playing,
      time,
      duration,
      volume,
      play,
      toggle,
      seek,
      setVolume
    }),
    [current, playing, time, duration, volume]
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
