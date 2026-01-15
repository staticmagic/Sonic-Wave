import { supabase } from "./supabaseClient";
import { getDeviceId } from "./device";

export async function fetchTracks() {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchComments(trackId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("track_id", trackId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchLikeCount(trackId) {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("track_id", trackId);

  if (error) throw error;
  return count || 0;
}

export async function likeTrack(trackId) {
  const deviceId = getDeviceId();
  const { error } = await supabase
    .from("likes")
    .insert({ track_id: trackId, device_id: deviceId });

  // Duplicate like = primary key conflict; ignore
  if (error && !String(error.message || "").toLowerCase().includes("duplicate")) {
    // Supabase often returns 409/duplicate key; this is fine to ignore.
    // If other error, throw.
    if (!String(error.code || "").includes("23505")) throw error;
  }
}

export async function addComment(trackId, name, text) {
  const payload = {
    track_id: trackId,
    name: name?.trim() ? name.trim() : "Anonymous",
    text: text.trim()
  };

  const { error } = await supabase.from("comments").insert(payload);
  if (error) throw error;
}

async function uploadToBucket(bucket, file, path) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createTrack({ title, artist, description, audioFile, coverFile }) {
  // 1) upload audio
  const audioPath = `${Date.now()}_${audioFile.name}`.replace(/\s+/g, "_");
  const audioUrl = await uploadToBucket("audio", audioFile, audioPath);

  // 2) upload cover (already 500x500 JPEG from client)
  const coverPath = `${Date.now()}_${coverFile.name}`.replace(/\s+/g, "_");
  const coverUrl = await uploadToBucket("covers", coverFile, coverPath);

  // 3) insert track row
  const { data, error } = await supabase
    .from("tracks")
    .insert({
      title: title.trim(),
      artist: artist.trim(),
      description: description?.trim() || "",
      audio_url: audioUrl,
      cover_url: coverUrl
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
