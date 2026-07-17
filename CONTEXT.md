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

**Derived homepage content**:
Homepage and navigation content that is generated from other content domains rather than authored separately. Changes to Projects, Thoughts, About, Now, and Experiments update these derived views.
_Avoid_: homepage CMS, nav CMS

**Featured content**:
Published collection content selected to appear on homepage sections. Featured content has its own manual homepage order within its content domain.
_Avoid_: homepage page data, promoted feed item

**Editorial settings**:
The non-body metadata of a content item: slug, excerpt, publication date, and whether it is featured on the homepage. Editorial settings are edited from Settings, never from the content canvas.
_Avoid_: body metadata, editor fields

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
