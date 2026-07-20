# Portfolio Content

This context covers the editable content managed by the portfolio site and its built-in admin. It defines what content exists, which parts are authored directly, and which public views are derived from authored content.

## Language

**Content item**:
An authored unit of portfolio content managed in the admin and stored by the application. A content item belongs to one content domain such as Project, Thought, Experiment, About, or Now.
_Avoid_: record, entry, page data

**Collection content**:
Content managed as multiple items of the same kind, where each item has its own identity and lifecycle. In this portfolio, Projects, Thoughts, and Experiments are collection content.
_Avoid_: list page, repeated page

**Singleton content**:
Content managed as one authoritative item for a domain rather than a list of items. In this portfolio, About and Now are singleton content.
_Avoid_: static page, one-off page

**Draft**:
Saved authored changes that are not yet visible on the public site. A draft may be edited over time and later published explicitly.
_Avoid_: autosave, preview version

**Published content**:
The live version of a content item that the public site reads. Published content stays unchanged while a newer draft is being edited.
_Avoid_: current draft, latest edit

**Unpublished changes**:
The editorial state where a content item has live published content and also a newer draft that is not yet public.
_Avoid_: draft+published, dual state

**Last public update**:
The timestamp of the most recent publish that changed the live version of a content item after its first publication. It does not change when only a draft is edited.
_Avoid_: last edit, updated draft date

**Derived homepage content**:
Homepage and navigation content that is generated from other content domains rather than authored separately. Changes to Projects, Thoughts, About, Now, and Experiments update these derived views.
_Avoid_: homepage CMS, nav CMS

**Featured content**:
Published collection content selected to appear on homepage sections. Featured content has its own manual homepage order within its content domain.
_Avoid_: homepage page data, promoted feed item

**Editorial settings**:
The non-canvas metadata of a content item: slug, excerpt, cover image, publication date, and whether it is featured on the homepage. Editorial settings are edited from Settings, never from the content canvas.
_Avoid_: body metadata, editor fields

**Document title**:
The primary title of a rich content item, authored as the first `H1` block in the content canvas rather than as a separate form field.
_Avoid_: title input, heading field

**Cover image**:
The representative image used for cards and social previews. It is selected from Settings, defaults to the first image uploaded into the content canvas when one exists, and keeps following that first document image until an editor explicitly overrides it. After a manual override is saved, the cover image stays fixed until edited manually again.
_Avoid_: hero field, thumbnail URL input

**Editorial override**:
A manual value saved in Settings for a derived editorial field such as slug, excerpt, or cover image. Automatic generation applies only until the first saved override; afterwards the field stays manual until edited manually again.
_Avoid_: reset to auto, sync toggle

**Slug redirect**:
The permanent forwarding from an older published slug to the current published slug of the same content item after a slug change is republished.
_Avoid_: broken old URL, alias without redirect

**Editorial order**:
The manual order of published collection content or of its featured subset. It is changed by dragging items in the relevant admin list, not through a settings field.
_Avoid_: order input, position metadata

**Theme preference**:
The global visual mode selected as System, Light, or Dark. System follows the device preference; an explicit selection applies to both public and admin views.
_Avoid_: admin theme, page theme

**Project detail field**:
An ordered labeled field attached to a Project for short metadata such as category, year, role, or external link. Project detail fields are edited as a list rather than stored as an unordered object.
_Avoid_: details object, metadata map

**Project section kind**:
The rendering shape of a Project section. In this portfolio, the allowed Project section kinds are `text`, `list`, `tags-grouped`, and `text-with-links`.
_Avoid_: arbitrary block, freeform section type
