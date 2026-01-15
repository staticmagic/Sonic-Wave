import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { PlayerProvider } from "./context/PlayerContext";
import { fetchTracks } from "./lib/api";

function Root() {
  const [tracks, setTracks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      const t = await fetchTracks();
      setTracks(t);
    } catch (e) {
      console.error(e);
      alert("Failed to load tracks from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <BrowserRouter>
      <PlayerProvider>
        <App tracks={tracks} refresh={refresh} loading={loading} />
      </PlayerProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
