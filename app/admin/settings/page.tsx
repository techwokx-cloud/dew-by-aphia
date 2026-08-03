"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import type { Settings } from "@/lib/store/settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [cadence, setCadence] = useState(15);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d.item);
        setWhatsapp(d.item.ownerWhatsappOverride ?? "");
        setCadence(d.item.cadenceDays);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerWhatsappOverride: whatsapp || null, cadenceDays: cadence }),
    });
    const data = await res.json();
    setSettings(data.item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <p className="text-ink-soft text-sm">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-1">Settings</h1>
      <p className="text-ink-soft text-sm mb-8">Change these anytime — no redeploy needed</p>

      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.06em] text-ink-soft mb-2">
            Owner WhatsApp Number (for approval notifications)
          </label>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="233504115111 (leave blank to use environment default)"
            className="w-full border border-line px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
          <p className="text-xs text-ink-soft mt-2">
            No spaces or +, country code first. This overrides{" "}
            <code>WHATSAPP_OWNER_NUMBER</code> without needing a redeploy — still requires{" "}
            <code>WHATSAPP_BUSINESS_TOKEN</code> and <code>WHATSAPP_PHONE_NUMBER_ID</code> to
            actually send.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.06em] text-ink-soft mb-2">
            Content Generation Cadence
          </label>
          <select
            value={cadence}
            onChange={(e) => setCadence(Number(e.target.value))}
            className="w-full border border-line px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          >
            <option value={7}>Every 7 days (~4x/month)</option>
            <option value={15}>Every 15 days (~2x/month)</option>
            <option value={30}>Every 30 days (~1x/month)</option>
          </select>
          <p className="text-xs text-ink-soft mt-2">
            Only takes effect if the scheduled cron job is set up (see{" "}
            <code>/api/cron/generate-content</code>) — otherwise content is only generated
            when you click "Generate Draft" manually.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-cream px-6 py-3 text-sm tracking-[0.05em] uppercase hover:bg-primary-deep transition-colors"
        >
          {saved ? <Check size={15} strokeWidth={2} /> : <Save size={15} strokeWidth={1.75} />}
          {saved ? "Saved" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
