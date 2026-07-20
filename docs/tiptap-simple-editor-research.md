# TipTap Simple Editor Research

Date: 2026-07-20

## Goal

Document the official TipTap guidance that now defines the Thoughts editor baseline.

## Official findings

### 1. The free official baseline is `Simple Editor`

TipTap documents `Simple Editor` as a free template that can be installed through the official CLI and copied into the project as editable source code.

Source:
- https://tiptap.dev/docs/ui-components/templates/simple-editor

Confirmed points from the docs:
- `Simple Editor` is available for free.
- The template installs through `npx @tiptap/cli@latest add simple-editor`.
- The generated code lives in the application and is meant to be customized.

### 2. The repo baseline must stay on the free official template path

The approved baseline for this repo is the free official template path so the editor can be installed and maintained directly from TipTap's OSS-facing CLI flow.

## Product decision for this repo

- Use the official free TipTap `Simple Editor` template as the UI baseline.
- Keep the editor contained inside the existing `Content` block in the editorial shell rather than rendering a full-screen page.
- Continue treating slash menus, drag handles, and other premium block-editor behaviors as out of scope unless the product decision changes again.

## Implementation consequence

Any earlier custom editor work that targeted a different interaction model should be treated as debt from a superseded decision and may be discarded before rebuilding the editor on top of the official `Simple Editor` source.
