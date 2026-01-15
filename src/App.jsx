import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Track from "./pages/Track";
import Upload from "./pages/Upload";
import Featured from "./pages/Featured";
import PlayerBar from "./components/PlayerBar";

export default function App({ tracks, refresh, loading }) {
  return (
    <>
      <nav>
        <Link className="brand" to="/">Sonic Wave</Link>

        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/featured">Featured</Link>
          <Link to="/upload">Upload</Link>
        </div>
      </nav>

      {loading && (
        <div className="page">
          <div className="sub">Loading tracks…</div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home tracks={tracks} refresh={refresh} />} />
        <Route path="/track/:id" element={<Track tracks={tracks} refresh={refresh} />} />
        <Route path="/upload" element={<Upload onCreated={refresh} />} />
        <Route path="/featured" element={<Featured tracks={tracks} />} />
      </Routes>

      <PlayerBar />
    </>
  );
}
