# Use HeroUI, TipTap, and settings drawers for editorial UI

The built-in admin will use HeroUI as its shared UI component library. Collection admin pages present published and draft content separately; published content is reordered by drag and drop, while editorial settings are opened from each card's overflow action.

Content editing uses TipTap as the document canvas. Title, images, and previewed content belong in the canvas. Slug, excerpt, publication date, and homepage featured state belong in a right-side Settings drawer. A new item must complete required editorial settings after its first successful canvas save.

This keeps domain editors focused on authored content while preserving the existing Draft/Published boundary. Collection and featured order are never editable as numeric settings.

The visual system keeps the portfolio's current monochrome palette, typography, and density. Global semantic tokens cover surfaces, text, borders, focus, actions, and radii. A future Header control will offer System, Light, and Dark preference states persisted in local storage and shared by public and admin views. Focus uses the primary neutral color; the green accent stays limited to its existing uses.

The Thoughts spike currently keeps text content as plain text while replacing the editing surface with TipTap. JSON storage, generated safe HTML, and inline image controls are the next migration step, not an implicit format change.

## Pending

The current `/admin/thoughts/new` and `/admin/thoughts/[id]/edit` routes are an interim editor, not the agreed creation/editing experience. Do not treat this spike as complete until TipTap owns title, images, and previewed content; the first save requires its missing settings; and the settings workflow and media handling match the final editorial flow.
