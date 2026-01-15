import { Link } from "react-router-dom";
import { getWeeklyFeatured } from "../lib/featured";

export default function Featured({ tracks }) {
  const t = getWeeklyFeatured(tracks);

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Weekly Featured Artist</h1>
      <p className="sub">Rotates weekly (date-based logic). Highlights smaller creators.</p>

      <div className="card">
        {t ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img className="trackCover" src={t.cover_url} alt="" />
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t.artist}</div>
              <div className="sub" style={{ margin: "6px 0 0" }}>{t.title}</div>
              <div className="sub" style={{ margin: "6px 0 0", maxWidth: 620 }}>
                {t.description || "No description provided."}
              </div>
              <div style={{ marginTop: 10 }}>
                <Link to={`/track/${t.id}`}>Open featured track →</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="sub">No tracks yet — upload one!</div>
        )}
      </div>
    </div>
  );
}
