import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/store/settings";

export async function GET() {
  return NextResponse.json({ item: getSettings() });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const updated = updateSettings(body);
  return NextResponse.json({ item: updated });
}
