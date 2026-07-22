# Consume a repository-owned UI component API

Application code will import interactive elements from the repository's own UI component layer, which internally composes HeroUI. This keeps HeroUI replaceable and makes UI customizations centrally enforceable without scattering library-specific props and styles across routes.
