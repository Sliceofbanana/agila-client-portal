// src/components/dashboard/SystemSettings.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Save, Building2, Globe, Palette, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

/* ─── Mock — replace with real API call when main repo is connected ─ */
const BUSINESS_NAME_FROM_MAIN_REPO = 'Agila Tax Management Services';

export default function SystemSettings(): React.ReactNode {
  const { success } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [portalName, setPortalName] = useState('Agila Client Portal');
  const [logoPreview, setLogoPreview] = useState<string | null>('/images/client_portal_logo.png');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST to API with FormData when backend is ready
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    success('Settings saved', 'Your system settings have been updated successfully.');
    if (logoFile) {
      // persist preview URL so it doesn't revoke
      setLogoFile(null);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">

      {/* ── Business Identity (read-only from main repo) ─────── */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Business Identity</h2>
            <p className="text-xs text-muted-foreground">Sourced from the main repository — not editable here.</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Business Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3">
            <Building2 size={16} className="shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{BUSINESS_NAME_FROM_MAIN_REPO}</span>
            <span className="ml-auto flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
              <Info size={10} /> Read-only
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            This value is managed in the main Agila Tax Management System and synced here automatically.
          </p>
        </div>
      </section>

      {/* ── Portal Branding ───────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
            <Palette size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Portal Branding</h2>
            <p className="text-xs text-muted-foreground">Customise how this portal looks to employees.</p>
          </div>
        </div>

        {/* Portal Logo */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Portal Logo
          </label>
          <div className="flex items-center gap-5">
            {/* Preview */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted overflow-hidden">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Portal logo preview"
                  width={72}
                  height={72}
                  className="h-full w-full object-contain p-1"
                  unoptimized={logoPreview.startsWith('blob:')}
                />
              ) : (
                <Upload size={24} className="text-muted-foreground" />
              )}
            </div>

            {/* Upload controls */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <Upload size={15} /> Upload New Logo
              </button>
              <p className="text-[11px] text-muted-foreground">PNG, WEBP, or SVG · Max 2 MB · Recommended: 128×128 px</p>
              {logoFile && (
                <p className="text-[11px] font-medium text-blue-600">{logoFile.name} selected</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        {/* Portal Name */}
        <div className="space-y-1.5">
          <label htmlFor="portal-name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Portal Name
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
            <Globe size={16} className="shrink-0 text-muted-foreground" />
            <input
              id="portal-name"
              type="text"
              value={portalName}
              onChange={e => setPortalName(e.target.value)}
              placeholder="e.g. Agila Client Portal"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Shown in the browser tab and portal header.</p>
        </div>
      </section>

      {/* ── Save ─────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 active:scale-[0.97]"
        >
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

    </div>
  );
}
