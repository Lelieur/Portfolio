# Centralize structural UI classes

Pages and shared UI components will not compose raw Tailwind utility classes. They will use centrally defined System UI classes, with a narrowly scoped local exception only for a genuinely one-off visual need that is not yet a system concept. Tailwind remains an implementation detail of the UI layer.
