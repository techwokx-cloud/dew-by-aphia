import { ShoppingBag } from "lucide-react";
import { whatsappOrderLink, WHATSAPP_NUMBER } from "@/lib/business-info";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-1">Orders</h1>
      <p className="text-ink-soft text-sm mb-8">
        Orders currently come in via WhatsApp, not through the site directly.
      </p>

      <div className="border border-line rounded-[var(--radius)] bg-white p-10 text-center">
        <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <ShoppingBag size={22} strokeWidth={1.5} />
        </span>
        <p className="font-display text-xl text-ink mb-2">No orders tracked here yet</p>
        <p className="text-ink-soft text-sm max-w-md mx-auto leading-relaxed mb-4">
          Every product page sends customers to WhatsApp ({WHATSAPP_NUMBER}) to place an order
          and pay the 50% deposit. To track orders inside this dashboard, the next step is
          building an Orders table that a team member logs each WhatsApp order into — or
          eventually a real checkout flow with payment collection built in.
        </p>
        <a
          href={whatsappOrderLink("Hi, checking in on the orders inbox.")}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-primary underline underline-offset-2"
        >
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}
