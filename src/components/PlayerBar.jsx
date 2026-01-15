import { usePlayer } from "../context/PlayerContext";

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const p = usePlayer();

  const hasTrack = !!p.current;
  const max = p.duration || 0;

  return (
    <div className="playerBar" style={{ gap: 14 }}>
      <button className="playerBtn" onClick={p.toggle} disabled={!hasTrack}>
        {p.playing ? "⏸" : "▶"}
      </button>

      <div className="playerGrow" style={{ minWidth: 260 }}>
        <div className="playerTitle" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.current ? p.current.title : "No track selected"}
        </div>
        <div className="playerSub" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.current ? p.current.artist : "Pick something to play"}
        </div>
      </div>

      {/* Scrub bar */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", width: 44, textAlign: "right" }}>
          {fmt(p.time)}
        </div>

        <input
          type="range"
          min="0"
          max={max}
          step="0.1"
          value={Math.min(p.time, max)}
          onChange={(e) => p.seek(Number(e.target.value))}
          disabled={!hasTrack || max === 0}
          style={{ width: "100%" }}
        />

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", width: 44 }}>
          {fmt(p.duration)}
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 160 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Vol</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={p.volume}
          onChange={(e) => p.setVolume(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
