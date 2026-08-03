"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Product, CollectionSlug } from "@/lib/types";

const CATEGORIES: CollectionSlug[] = ["executive-wear", "evening-wear", "bridal", "corporate-chic", "accessories"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink mb-1">Products</h1>
          <p className="text-ink-soft text-sm">{products.length} products live on the storefront</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-cream px-5 py-2.5 text-sm tracking-[0.05em] uppercase hover:bg-primary-deep transition-colors"
        >
          <Plus size={15} strokeWidth={2} />
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-ink-soft text-sm">Loading...</p>
      ) : (
        <div className="border border-line rounded-[var(--radius)] overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-primary/[0.03] text-left">
                <th className="px-5 py-3 font-medium text-ink-soft">Name</th>
                <th className="px-5 py-3 font-medium text-ink-soft">Category</th>
                <th className="px-5 py-3 font-medium text-ink-soft">Price</th>
                <th className="px-5 py-3 font-medium text-ink-soft">Featured</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-ink font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{p.category}</td>
                  <td className="px-5 py-3 text-ink-soft">${p.price}</td>
                  <td className="px-5 py-3 text-ink-soft">{p.featured ? "Yes" : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      aria-label="Delete product"
                      className="text-ink-soft hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <NewProductModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function NewProductModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0],
    price: "",
    fabric: "",
    description: "",
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
      <div className="w-full max-w-md bg-white rounded-[var(--radius)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Add Product</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as CollectionSlug })}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="Price (USD)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            placeholder="Fabric"
            value={form.fabric}
            onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
          />
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Feature on homepage
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-cream py-3 text-sm tracking-[0.05em] uppercase hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
