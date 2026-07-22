# Use HeroUI as the interactive UI foundation

All generic interactive UI elements in the Shared UI system will be based on HeroUI. Repository-specific UI customizations must be implemented once in the shared component layer and reused across the application, rather than patched at individual call sites. TipTap specialized controls remain editor-owned exceptions because they are coupled to editor state and interaction primitives.
