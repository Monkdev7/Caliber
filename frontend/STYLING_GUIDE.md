# Caliber Auth Styling Guide (Dark-First)

This guide summarizes the current auth styling and how to extend it across the site. It is written to align future UI with the same tone: calm, trustworthy, and understated.

## Design Intent
- Calm, restrained, and professional.
- Neutral-first palette with a single muted accent color.
- No gradients, no glow, no glassmorphism, no heavy blur.
- Clear hierarchy created by spacing and type, not color overload.

## Current Color System (Dark Mode)
- Base background: deep slate (`bg-slate-950`).
- Surface background: slightly lighter slate (`bg-slate-900`).
- Borders: `border-slate-800`.
- Primary text: `text-slate-100`.
- Secondary text: `text-slate-400`.
- Muted text: `text-slate-500`.
- Accent (single color): `accent` token (currently `#4f46e5`).
- Error text: `text-rose-500`.

### Usage Notes
- Use the accent color only for actions, focus rings, and small highlights.
- Buttons are solid accent, no gradients.
- Avoid colored shadows or glowing effects.

## Typography
- Font: Inter (defined in Tailwind `fontFamily.sans`).
- Headings: `font-semibold` with moderate sizes.
- Avoid oversized headings or decorative text effects.
- Trackable uppercase labels are used sparingly for small labels only.

## Layout and Spacing
- Auth screens use a split layout for login/signup.
- Card surfaces are subtle (rounded-lg, shadow-md, no blur).
- Prefer `space-y-4` for form vertical rhythm.
- Avoid excess empty space; use simple dividers (`bg-slate-800`) to structure sections.

## Form and Component Styling
- Inputs: `auth-input` class (rounded-lg, subtle border, accent focus ring).
- Buttons: `auth-button` class (solid accent, disabled state, no scaling).
- Links: `auth-link` class (accent text, subtle hover).
- Error copy: inline and calm (`text-rose-500`).

## Light Mode Conversion (If You Switch)
When switching to light mode, keep the same intent and only flip the neutrals:

### Light Mode Base Tokens
- Base background: `bg-white` or `bg-slate-50`.
- Surface background: `bg-white` or `bg-slate-100`.
- Borders: `border-slate-200`.
- Primary text: `text-slate-900`.
- Secondary text: `text-slate-600`.
- Muted text: `text-slate-500`.
- Accent: keep the same `accent` token.
- Error text: keep `text-rose-500`.

### Light Mode Rules
- Keep the accent usage limited (CTAs, focus rings, small highlights).
- Keep the same spacing and hierarchy.
- Replace dark surfaces with light surfaces but do not add gradients.

## What to Avoid (Strict)
- No gradients (unless extremely subtle, but recommended to avoid entirely).
- No neon glow, no shimmer, no glassmorphism.
- No multiple accent colors or loud palettes.
- No oversized hero-style typography or flashy effects.

## Tailwind Tokens to Reuse
- Accent color token: `accent` (single accent).
- Font: `font-sans` (Inter).
- Borders: `border-slate-800` (dark) / `border-slate-200` (light).
- Surfaces: `bg-slate-900` (dark) / `bg-white` (light).
- Text: `text-slate-100` (dark) / `text-slate-900` (light).

## Practical Extension Rules
- New components should follow the same border radius (rounded-lg) and shadow style (shadow-md).
- Use 1-2 layers of depth max; avoid stacked translucent layers.
- Keep interface quiet: spacing and text clarity before decoration.

---

If you want a light mode theme officially added, create a second token set in Tailwind and switch via a `data-theme` attribute or class on the root.
