import { usePlayer } from "../context/PlayerContext";
import { Link } from "react-router-dom";

export default function TrackCard({ track, onLike }) {
  const p = usePlayer();

  return (
    <div className="card trackCard">
      <img className="trackCover" src={track.cover} alt="" />

      <div className="trackInfo">
        <h3>{track.title}</h3>
        <p className="artist">{track.artist}</p>
        <p className="desc">{track.description || "No description provided."}</p>

        <div className="actions">
          <button className="btn" onClick={() => p.play(track)}>▶ Play</button>
          <button className="chip" onClick={() => onLike(track.id)}>❤️ Like</button>
          <Link to={`/track/${track.id}`}>Open</Link>
        </div>
      </div>
    </div>
  );
}
