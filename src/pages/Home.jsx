import { useMemo, useState } from "react";
import TrackCard from "../components/TrackCard";
import { likeTrack } from "../lib/api";

export default function Home({ tracks, refresh }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tracks;
    return tracks.filter(t =>
      t.title.toLowerCase().includes(s) || t.artist.toLowerCase().includes(s)
    );
  }, [q, tracks]);

  async function like(id) {
    try {
      await likeTrack(id);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Like failed.");
    }
  }

  return (
    <div className="page">
      <div className="headerRow">
        <h1 style={{ margin: 0, letterSpacing: "-0.02em" }}>Sonic Wave</h1>
        <input
          className="search"
          placeholder="Search tracks or artists..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <p className="sub">Synced online: uploads, likes, and comments.</p>

      <div className="grid">
        {filtered.map(t => (
          <TrackCard
            key={t.id}
            track={{
              id: t.id,
              title: t.title,
              artist: t.artist,
              description: t.description,
              cover: t.cover_url,
              url: t.audio_url
            }}
            onLike={like}
          />
        ))}
      </div>
    </div>
  );
}
