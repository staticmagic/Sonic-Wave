import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import WaveFake from "../components/WaveFake";
import { addComment, fetchComments, fetchLikeCount, likeTrack } from "../lib/api";

export default function Track({ tracks, refresh }) {
  const { id } = useParams();
  const p = usePlayer();

  const track = useMemo(() => tracks.find(t => t.id === id), [tracks, id]);

  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const [c, lc] = await Promise.all([
          fetchComments(id),
          fetchLikeCount(id)
        ]);
        setComments(c);
        setLikeCount(lc);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [id]);

  if (!track) return <div className="page"><h2>Track not found</h2></div>;

  async function doLike() {
    try {
      await likeTrack(id);
      const lc = await fetchLikeCount(id);
      setLikeCount(lc);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Like failed.");
    }
  }

  async function post() {
    const t = text.trim();
    if (!t) return;
    try {
      await addComment(id, name, t);
      setText("");
      const c = await fetchComments(id);
      setComments(c);
    } catch (e) {
      console.error(e);
      alert("Comment failed.");
    }
  }

  const uiTrack = {
    id: track.id,
    title: track.title,
    artist: track.artist,
    description: track.description,
    cover: track.cover_url,
    url: track.audio_url
  };

  return (
    <div className="page">
      <h2 style={{ marginBottom: 6 }}>{uiTrack.title}</h2>
      <div className="sub" style={{ marginTop: 0 }}>{uiTrack.artist}</div>

      <p style={{ opacity: 0.85, maxWidth: 760, lineHeight: 1.45 }}>
        {uiTrack.description || "No description provided."}
      </p>

      <div className="waveWrap" title="Visual waveform (demo)">
        <WaveFake />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
        <button className="btn" onClick={() => p.play(uiTrack)}>▶ Play</button>
        <button className="chip" onClick={doLike}>❤️ {likeCount}</button>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Comments</h3>

        <input
          className="input"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="btn" style={{ marginTop: 10 }} type="button" onClick={post}>
          Post Comment
        </button>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {comments.length === 0 ? (
            <div className="sub">No comments yet — be the first.</div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)"
                }}
              >
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ opacity: 0.9, marginTop: 4 }}>{c.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
