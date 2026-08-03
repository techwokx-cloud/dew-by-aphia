import { NextRequest, NextResponse } from "next/server";
import { listContentPosts, updateContentPost } from "@/lib/store/content-queue";
import { publishInstagramPost } from "@/lib/instagram-client";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (body.action === "approve") {
    const existing = listContentPosts().find((p) => p.id === id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const imageUrl = new URL(existing.image, request.nextUrl.origin).toString();
    const captionWithTags = `${existing.caption}\n\n${existing.hashtags.map((h) => `#${h}`).join(" ")}`;
    const result = await publishInstagramPost(imageUrl, captionWithTags);

    const post = updateContentPost(id, { status: result.sent ? "posted" : "approved" });
    return NextResponse.json({ item: post, instagram: result });
  }

  if (body.action === "reject") {
    const post = updateContentPost(id, { status: "rejected" });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: post });
  }

  // Plain edit (caption/hashtags tweak before approval)
  const post = updateContentPost(id, {
    caption: body.caption,
    hashtags: body.hashtags,
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: post });
}
