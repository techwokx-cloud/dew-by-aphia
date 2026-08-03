/**
 * Generates an original AI image via fal.ai's hosted Flux model — used as
 * an upgrade over the plain SVG graphic card when no rotation-eligible
 * photo is available. Real API call; returns null (caller falls back to
 * the SVG card) until FAL_KEY is set in your environment.
 * Get a key at https://fal.ai/dashboard/keys — fal.ai has a free trial
 * credit for new accounts.
 */
export async function generateFalImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: "square_hd",
        num_images: 1,
      }),
    });

    if (!res.ok) {
      console.error("fal.ai image generation failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.images?.[0]?.url ?? null;
  } catch (err) {
    console.error("fal.ai request failed:", err);
    return null;
  }
}

export const falConfigured = () => Boolean(process.env.FAL_KEY);
