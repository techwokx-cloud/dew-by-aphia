/**
 * Renders an actual MP4 reel from a script + images via json2video's cloud
 * renderer. Real integration; inert (returns { started: false }) until
 * JSON2VIDEO_API_KEY is set. Get a key at https://json2video.com — they
 * have a free tier.
 *
 * Rendering is async: submitRender() kicks off a job and returns a
 * project ID immediately; checkRenderStatus() polls it. The admin Reels
 * page polls every few seconds until the video URL is ready.
 */

const BASE_URL = "https://api.json2video.com/v2";

export interface ReelScene {
  imageUrl: string;
  text: string;
  durationSeconds: number;
}

export async function submitReelRender(scenes: ReelScene[]): Promise<{ started: boolean; projectId?: string }> {
  const apiKey = process.env.JSON2VIDEO_API_KEY;
  if (!apiKey) return { started: false };

  const movie = {
    resolution: "instagram-story",
    quality: "high",
    scenes: scenes.map((scene) => ({
      elements: [
        { type: "image", src: scene.imageUrl, duration: scene.durationSeconds },
        {
          type: "text",
          text: scene.text,
          duration: scene.durationSeconds,
          settings: { "font-size": "5vw", "font-weight": "bold", color: "#f8f5f0" },
          position: "center-bottom",
        },
      ],
    })),
  };

  try {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });
    if (!res.ok) {
      console.error("json2video render submission failed:", res.status, await res.text());
      return { started: false };
    }
    const data = await res.json();
    return { started: true, projectId: data.project };
  } catch (err) {
    console.error("json2video request failed:", err);
    return { started: false };
  }
}

export interface RenderStatus {
  done: boolean;
  videoUrl: string | null;
  failed: boolean;
}

export async function checkRenderStatus(projectId: string): Promise<RenderStatus> {
  const apiKey = process.env.JSON2VIDEO_API_KEY;
  if (!apiKey) return { done: false, videoUrl: null, failed: true };

  try {
    const res = await fetch(`${BASE_URL}/movies?project=${encodeURIComponent(projectId)}`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) return { done: false, videoUrl: null, failed: true };
    const data = await res.json();
    const movie = data.movie ?? data;
    if (movie?.url) return { done: true, videoUrl: movie.url, failed: false };
    if (movie?.status === "error" || data.error) return { done: true, videoUrl: null, failed: true };
    return { done: false, videoUrl: null, failed: false };
  } catch (err) {
    console.error("json2video status check failed:", err);
    return { done: false, videoUrl: null, failed: true };
  }
}

export const json2videoConfigured = () => Boolean(process.env.JSON2VIDEO_API_KEY);
