export interface Settings {
  ownerWhatsappOverride: string | null;
  cadenceDays: number;
  maxApprovalsPerMonth: number;
}

// Phase 1: in-memory, resets on restart (falls back to env vars when unset).
// Phase 2: persist to Supabase so this survives restarts.
const settings: Settings = {
  ownerWhatsappOverride: null,
  cadenceDays: 15,
  maxApprovalsPerMonth: 2,
};

export function getSettings(): Settings {
  return { ...settings };
}

export function updateSettings(patch: Partial<Settings>): Settings {
  Object.assign(settings, patch);
  return { ...settings };
}

export function getOwnerWhatsappNumber(): string | null {
  return settings.ownerWhatsappOverride || process.env.WHATSAPP_OWNER_NUMBER || null;
}
