# Shared UI visual bible

## Scope

The Public UI surface and Admin UI surface use one repository-owned visual token system and one shared interactive UI API. TipTap specialized controls are the explicit exception: they follow the global theme mode but keep their own editor tokens and primitives.

Pages consume semantic System UI classes and shared interactive components. Tailwind utilities remain an implementation detail of the UI layer; a repeated local exception becomes a system concept.

## Theme preference

The application has one global `Theme preference`: `System`, `Light`, or `Dark`. Public and Admin UI use the same active mode. TipTap translates the active mode into its own token system.

## Confirmed tokens

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#111110` | Main application canvas |
| `primary` | `#111110` | `#ededed` | Primary text, icons, and strong borders |
| `secondary` | `#272727` | `#b3b3b3` | Supporting text and metadata |
| `surface` | `background` | `background` | Default surface |
| `surface-raised` | `color-mix(in srgb, primary 5%, background)` | `color-mix(in srgb, primary 5%, background)` | Raised surface |
| `border` | `color-mix(in srgb, primary 15%, transparent)` | `color-mix(in srgb, primary 15%, transparent)` | Borders and dividers |
| `focus` | `primary` | `primary` | Visible keyboard focus |
| `action-background` | `primary` | `primary` | Primary action background |
| `action-foreground` | `background` | `background` | Primary action content |
| `accent` | `#6ee7b7` | `#6ee7b7` | Brand accent |
| `danger` | `#b91c1c` | `#fca5a5` | Errors and destructive actions |
| `success` | `#047857` | `#34d399` | Confirmations and published states |
| `warning` | `#b45309` | `#fcd34d` | Pending and mixed states |
| `scrim` | `rgb(0 0 0 / 40%)` | `rgb(0 0 0 / 60%)` | Dialog and drawer backdrop |
| `hover-background` | `color-mix(in srgb, primary 6%, transparent)` | `color-mix(in srgb, primary 6%, transparent)` | Subtle hover surface |

## Alias migration

The existing public aliases map to the closed vocabulary as follows:

| Existing alias | Action | Replacement |
| --- | --- | --- |
| `text` | Remove | `primary` |
| `text-muted` | Remove | `secondary` |
| `emerald` | Remove | `accent` |
| `gray` | Remove | `hover-background` |

The migration is intentionally deferred until the visual system implementation pass.

## Geometry and interaction

- `radius-control`: `0.375rem` for rectangular controls and fields.
- `radius-card`: `0.5rem` for cards and panels.
- `radius-dialog`: `0.75rem` for dialogs and modal surfaces.
- `radius-pill`: `9999px` only for badges, indicators, and intentional capsule controls.
- Use the existing 4px spacing scale: `0.25`, `0.5`, `0.75`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, and `6rem`.
- Use one system sans family; reserve monospace for code and technical data.
- Use Heroicons for Public/Admin UI. TipTap keeps its own icon set.
- Do not use shadows on cards or controls. Overlays may use a minimal shadow when borders and scrim are insufficient.

## Links

- Links inside text use a dotted underline by default with `text-underline-offset`.
- Navigation and action links have no underline by default and use underline on hover/focus.
- The footer keeps its current secondary-link treatment and has no active-link state.
- Do not add active-link styling until a persistent navigation needs it.

## Form fields

- Inputs and textareas use `surface`, `border`, `radius-control`, and `primary`.
- Placeholders use `secondary`.
- Focus uses the shared `focus` token.
- Validation errors use `danger`.
- Form controls are consumed through the shared UI API; pages do not style HeroUI directly.

## Component rules

- Generic controls expose `primary`, `secondary`, `ghost`, and `danger` variants, with `sm`, `md`, and `icon` sizes.
- Checkboxes use one shared component variant. Do not add a toggle until a real use case exists.
- Dialogs and drawers use `surface-raised`, `border`, `radius-dialog`, and `scrim`, with accessible focus and close behavior delegated to shared primitives.
- Cards expose only `default` and `transparent` variants. `default` uses `surface-raised`, `border`, and `radius-card`; neither variant uses a shadow.
- Editorial status badges map `published` to `success`, `draft+published` to `warning`, and `draft` to `secondary`.
- Status surfaces and borders derive from their semantic token with `color-mix`; do not add status-specific token families.

## Accessibility and responsive behavior

- WCAG AA is the minimum contrast target: 4.5:1 for normal text and 3:1 for large text, controls, and meaningful graphics.
- Validation errors use `aria-invalid`, `aria-describedby`, visible messages, and `danger`; color is never the only signal.
- Non-essential animations respect `prefers-reduced-motion: reduce`.
- Layout is mobile-first and uses only the existing `640px` and `768px` breakpoints.
- The global shell remains `36rem` wide, centered, and editorial in density.

## Boundaries and exceptions

- The editor shell, admin actions, cards, drawers, and surrounding layout use Shared UI. TipTap canvas internals and specialized controls use TipTap tokens and primitives.
- Local route CSS is allowed only for a genuinely unique composition. It must not redefine shared tokens, states, radii, or controls; repeated needs become system concepts.
- Public/Admin UI uses Heroicons. TipTap keeps its own icon set.

## Pending implementation

The token migration and component API implementation remain to be completed in the implementation issue.
