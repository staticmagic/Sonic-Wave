import { useState } from "react";
import { createTrack } from "../lib/api";

export default function Upload({ onCreated }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");

  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [busy, setBusy] = useState(false);

  function handleAudio(file) {
    if (!file) return;
    setAudioFile(file);
  }

  function handleCover(file) {
    if (!file) return;

    // Validate & resize to 500x500 using canvas, then convert to a real File for upload
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => (img.src = e.target.result);

    img.onload = async () => {
      if (img.width !== img.height) {
        alert("Cover image must be square (1:1). Crop it to a square first.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 500, 500);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );

      const resizedFile = new File([blob], `cover_${Date.now()}.jpg`, {
        type: "image/jpeg"
      });

      setCoverFile(resizedFile);
      setCoverPreview(URL.createObjectURL(resizedFile));
    };

    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();

    if (!title.trim() || !artist.trim()) {
      alert("Please enter a Track title and Artist name.");
      return;
    }
    if (!audioFile) {
      alert("Please upload an audio file (mp3/wav/ogg).");
      return;
    }
    if (!coverFile) {
      alert("Please upload a square cover image (1:1).");
      return;
    }

    try {
      setBusy(true);

      await createTrack({
        title,
        artist,
        description,
        audioFile,
        coverFile
      });

      setTitle("");
      setArtist("");
      setDescription("");
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview("");

      alert("Published ✅ (Synced online)");
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Upload</h1>
      <p className="sub">
        This upload is synced online via Supabase (audio + cover + metadata).
      </p>

      <form className="card" onSubmit={submit}>
        <input
          className="input"
          placeholder="Track title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={busy}
        />

        <input
          className="input"
          placeholder="Artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          disabled={busy}
        />

        <div style={{ marginTop: 10 }}>
          <div style={{ opacity: 0.85 }}>Audio file (mp3/wav/ogg)</div>
          <input
            className="input"
            type="file"
            accept="audio/*,.mp3,.wav,.ogg"
            onChange={(e) => handleAudio(e.target.files?.[0])}
            disabled={busy}
          />
          <div className="sub" style={{ marginTop: 6 }}>
            {audioFile ? `Selected: ${audioFile.name}` : "No audio selected yet."}
          </div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "180px 1fr", gap: 14 }}>
          <div>
            <div style={{ opacity: 0.85 }}>Cover image (square 1:1 → 500×500)</div>

            <div
              style={{
                width: 180,
                height: 180,
                marginTop: 10,
                borderRadius: 14,
                border: "1px dashed rgba(77,163,255,0.45)",
                background: coverPreview
                  ? "transparent"
                  : "linear-gradient(135deg, rgba(77,163,255,0.25), rgba(43,124,255,0.15))",
                boxShadow: coverPreview ? "none" : "0 0 18px rgba(77,163,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.75)",
                textAlign: "center",
                overflow: "hidden"
              }}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div>
                  <div style={{ fontWeight: 700 }}>500 × 500</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Cover Preview</div>
                </div>
              )}
            </div>

            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => handleCover(e.target.files?.[0])}
              disabled={busy}
            />
          </div>

          <div>
            <textarea
              className="input"
              placeholder="Description (vibe, genre, story, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={busy}
            />
          </div>
        </div>

        <button className="btn" style={{ marginTop: 12 }} type="submit" disabled={busy}>
          {busy ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
