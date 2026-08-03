/**
 * Thin wrapper around Meta's Instagram Graph API. This is real,
 * production-shaped integration code — but every function is a no-op
 * (returns { sent: false, reason: "not_configured" }) until these env
 * vars exist in Render:
 *
 *   IG_ACCESS_TOKEN        long-lived token for the connected IG Business Account
 *   IG_BUSINESS_ACCOUNT_ID the IG Business Account's numeric ID
 *   IG_WEBHOOK_VERIFY_TOKEN a string you choose, entered in the Meta App's webhook config
 *
 * Getting those requires, on your end: a Meta Developer App, an Instagram
 * Business Account linked to a Facebook Page, and Meta's app review for the
 * instagram_business_manage_messages / content_publish permissions. None of
 * that can be done from here — this file is ready for the moment it is.
 */

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

function isConfigured() {
  return Boolean(process.env.IG_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID);
}

export async function publishInstagramPost(imageUrl: string, caption: string) {
  if (!isConfigured()) {
    return { sent: false, reason: "not_configured" as const };
  }
  const accountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const token = process.env.IG_ACCESS_TOKEN;

  // Two-step publish per Meta's Content Publishing API: create a media
  // container, then publish it.
  const container = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
  }).then((r) => r.json());

  if (!container.id) return { sent: false, reason: "container_failed" as const, detail: container };

  const publish = await fetch(`${GRAPH_API_BASE}/${accountId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: container.id, access_token: token }),
  }).then((r) => r.json());

  return { sent: Boolean(publish.id), postId: publish.id, reason: publish.id ? undefined : ("publish_failed" as const) };
}

export async function sendInstagramDM(recipientIgsid: string, text: string) {
  if (!isConfigured()) {
    return { sent: false, reason: "not_configured" as const };
  }
  const accountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const token = process.env.IG_ACCESS_TOKEN;

  const res = await fetch(`${GRAPH_API_BASE}/${accountId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipient: { id: recipientIgsid }, message: { text }, access_token: token }),
  }).then((r) => r.json());

  return { sent: Boolean(res.message_id), messageId: res.message_id, reason: res.message_id ? undefined : ("send_failed" as const) };
}

export const instagramConfigured = isConfigured;
