# Use HeroUI, TipTap, and settings drawers for editorial UI

The built-in admin will use HeroUI as its shared UI component library. Collection admin pages present published and draft content separately; published content is reordered by drag and drop, while editorial settings are opened from each card's overflow action.

Content editing uses TipTap as the document canvas. The document title is authored as the first `H1` block, body images are inserted inline in the canvas, and public rendering is derived from the rich document. The approved baseline interaction is the free official TipTap `Simple Editor` template installed through the CLI as editable source code. It must render contained inside the `Content` area of the editorial shell instead of taking over the full window. Slug, excerpt, cover image, publication date, and homepage featured state belong in a right-side Settings drawer. Slug and excerpt are generated from the document until the first saved manual override. The cover image defaults to the first image uploaded into the document, keeps following that first document image until the first saved manual override, and then stays manual until edited manually again. A new item must complete required editorial settings after its first successful canvas save.

This keeps domain editors focused on authored content while preserving the existing Draft/Published boundary. Collection and featured order are never editable as numeric settings.

The visual system keeps the portfolio's current monochrome palette, typography, and density. Global semantic tokens cover surfaces, text, borders, focus, actions, and radii. A future Header control will offer System, Light, and Dark preference states persisted in local storage and shared by public and admin views. Focus uses the primary neutral color; the green accent stays limited to its existing uses.

The Thoughts spike currently keeps text content as plain text while replacing the editing surface with TipTap. That is no longer the target end state. Thoughts should migrate to rich document storage, generated safe HTML, and inline image controls so the canvas becomes the source of truth rather than a styled plain-text field.

## Pending

The current `/admin/thoughts/new` and `/admin/thoughts/[id]/edit` routes are an interim editor, not the agreed creation/editing experience. Do not treat this spike as complete until TipTap stores a rich document; the document title comes from the first `H1`; inline images can be inserted from the canvas; the editor is rebuilt on top of the official free TipTap `Simple Editor` template inside the existing `Content` panel; cover image selection defaults from the first document image, follows it until manually overridden, and remains editable in Settings; the first save requires missing settings; and the settings workflow and media handling match the final editorial flow.

The broader `/admin` browsing experience still needs a separate design pass. The target direction is to reuse the public-site navigation and views as the base, then layer owner-only editing controls and editorial capabilities on top rather than maintaining a wholly separate admin-only information architecture.
