# Run — Sign in page, Figma design (2026-05-26)

Plan: `/Users/MiggleWork/.claude/plans/linked-riding-scroll.md`

## Outcome

Authored a new Sign-in page in the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`) on the existing "Desktop App" page (node `27464:128248`). The work landed inside a new `Sign in` section anchored to the right of the existing product frames.

### Nodes produced

| Frame | Node ID | Notes |
| --- | --- | --- |
| Section "Sign in" | `27927:1025655` | container for everything below |
| `Sign in — Light` (1440×900) | `27927:1025656` | main page; split-screen 720 + 720 |
| `Anatomy — Sign in` + label sidebar | `27927:1026160` / `27927:1026194` | annotated clone + 12 labeled regions |
| `States — Form panel` (5 cards) | `27927:1026640` | Default / Email focused / Invalid email error / Submitting (loading) / Disabled (no input) |
| `Tokens` sticker sheet | `27927:1028311` | color + spacing + typography + deferred-items panel |

### Design summary

- **Layout**: split-screen — left brand panel (`primary-background-color`) with wordmark + marketing headline + copyright; right form panel (`ui-background-color`) with the form column centered at 400px wide.
- **Form column** (top → bottom): h2 heading + t2 subtitle → 3 social Buttons (Kind=Secondary, Size=Large, Icon=Left) → hairline divider with "or continue with email" → Email TextField → Password TextField (with trailing icon) → Remember-me Checkbox + Forgot-password Link in a space-between row → primary full-width Submit Button → "Don't have an account? Sign up" footer.
- **Theme**: light only for v1.
- **DS instances used**: Button (`46939:91505`), Text Field (`46949:33152`), Checkbox (`46939:96347`), Link (`46946:16984`). All are real DS instances, not detached.

## Token discipline

Spot-checked the main frame walking only locally-authored nodes (instances skipped — DS owns their internals): **15 bindings present, 0 raw color values**.

Variables consumed:
- **Color**: `ui-background-color`, `primary-color`, `primary-background-color`, `primary-text-color`, `secondary-text-color`, `ui-border-color` (plus indirect via DS instances: `link-color`, `icon-color`, `placeholder-color`, `disabled-background-color`, `disabled-text-color`, `negative-color`, `text-color-on-primary`).
- **Spacing**: `space-4`, `space-8`, `space-12`, `space-16`, `space-20`, `space-24`, `space-32`, `space-40`, `space-48`, `space-64`, `space-80`.
- **Text styles**: every locally-authored text node (67 in total) binds to a DS text style — `H1/Bold` (marketing headline), `H2/Bold` (wordmark + "Sign in" heading), `H3/Medium` (Anatomy / States / Tokens section headers), `Text1/Normal` (brand subhead), `Text2/Normal` (subtitle + footer copy), `Text3/Normal` / `Text3/Medium` (divider label, copyright, anatomy descriptors). DS instances pull their own typography internally.

## Deferred / follow-ups (also shown on the Tokens frame)

1. **Brand-mark icons (Google / Apple / Microsoft)** — DS has no brand-mark icons in the canonical 298-icon library at `25336:96509`. Social buttons currently inherit the DS default left-icon slot as a placeholder. Promote before shipping (likely as a new `BrandIcon` family or raster assets); flag if a token replacement is preferred.
2. **`SocialButton` DS component** — currently composed from `Button(Kind=Secondary, Size=Large, Icon=Left)`. If social sign-in expands, promote to a dedicated component to standardize spacing + icon binding.
3. **Marketing headline** was originally drawn at 48px raw; now bound to `H1/Bold` (32px) so it tracks a DS text style. If we want a larger marketing tier, add an `H0` style to `Global.json` via Tokens Studio.
4. **Dark / Black theme variants** of the page are out of scope for v1; semantic variable bindings should make the variant trivial in code (set `data-theme`).
5. **Forgot-password & Sign-up destinations** — currently just links; design those screens in a follow-up.
6. **Button `Loading` variant** — DS Button has no Loading state; we used `State=Disabled` with the label "Signing in…" as a stand-in. If we want a true loading affordance, add a spinner-icon variant.

## Hand-off

When ready, run `figma-to-code` against the `Sign in — Light` frame to scaffold the React page. The Anatomy sidebar labels describe each region and what DS component it should map to; the States cards drive the prop-state matrix.
