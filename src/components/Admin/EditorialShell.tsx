"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Drawer, useOverlayState } from "@/components/ui";
import { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

type OverlayState = ReturnType<typeof useOverlayState>;

function statusTone(status: "draft" | "published" | "draft+published") {
  if (status === "published") return "ui-status--published";
  if (status === "draft+published") return "ui-status--draft-published";
  return "ui-status--draft";
}

export function EditorialStatusBadge({
  status,
  label,
}: {
  status: "draft" | "published" | "draft+published";
  label?: string;
}) {
  return (
    <span
      className={`ui-control ui-status-badge ${statusTone(status)}`}
    >
      {label ?? status}
    </span>
  );
}

export function EditorialPageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="ui-page">
      <header className="ui-page-header">
        <div className="ui-page-header-content">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 className="text-3xl font-medium text-primary">{title}</h1>
          {description ? <div className="text-base text-secondary">{description}</div> : null}
        </div>
        {actions ? <div className="ui-page-actions shrink-0">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}

export function EditorialSettingsDrawer({
  state,
  title = "Settings",
  children,
  footer,
}: {
  state: OverlayState;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
          <Drawer.Content placement="right" className="ui-drawer-content">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>{title}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="ui-drawer-body">{children}</Drawer.Body>
            {footer ? <Drawer.Footer>{footer}</Drawer.Footer> : null}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export function EditorialEditorShell({
  title,
  description,
  status,
  statusLabel,
  message,
  actions,
  canvas,
  settings,
  settingsTitle,
  settingsContent,
  settingsFooter,
  hasUnsavedChanges = false,
}: {
  title: string;
  description?: ReactNode;
  status: "draft" | "published" | "draft+published";
  statusLabel?: string;
  message?: ReactNode;
  actions?: ReactNode;
  canvas: ReactNode;
  settings: OverlayState;
  settingsTitle?: string;
  settingsContent: ReactNode;
  settingsFooter?: ReactNode;
  hasUnsavedChanges?: boolean;
}) {
  useUnsavedChangesWarning(hasUnsavedChanges);

  return (
    <>
      <section className="ui-editor">
        <div className="ui-editor-header">
          <div className="ui-editor-header-content">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Edit</p>
            <h2 className="text-2xl font-medium text-primary">{title}</h2>
            {description ? <div className="text-sm text-secondary">{description}</div> : null}
          </div>
          <div className="ui-editor-header-meta">
            <EditorialStatusBadge status={status} label={statusLabel} />
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="ui-control ui-control--icon ui-editor-settings"
              aria-label="Open settings"
              onPress={settings.open}
            >
              <Cog6ToothIcon className="size-5" />
            </Button>
          </div>
          <div className="ui-editor-actions">
            {actions}
          </div>
        </div>
        {message ? <div aria-live="polite" className="text-sm text-secondary">{message}</div> : null}

        <section className="ui-card ui-editor-canvas">
          {canvas}
        </section>
      </section>

      <EditorialSettingsDrawer
        state={settings}
        title={settingsTitle}
        footer={settingsFooter}
      >
        {settingsContent}
      </EditorialSettingsDrawer>
    </>
  );
}

export function EditorialReadShell({
  title,
  description,
  status,
  statusLabel,
  backHref,
  editHref,
  publicHref,
  publicLabel = "View public",
  canvas,
  settings,
  settingsTitle,
  settingsContent,
}: {
  title: string;
  description?: ReactNode;
  status: "draft" | "published" | "draft+published";
  statusLabel?: string;
  backHref: string;
  editHref: string;
  publicHref?: string;
  publicLabel?: string;
  canvas: ReactNode;
  settings: OverlayState;
  settingsTitle?: string;
  settingsContent: ReactNode;
}) {
  return (
    <>
      <section className="ui-editor">
        <div className="ui-editor-header">
          <div className="ui-editor-header-content">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Read</p>
            <h2 className="text-2xl font-medium text-primary">{title}</h2>
            {description ? <div className="text-sm text-secondary">{description}</div> : null}
          </div>
          <div className="ui-editor-actions">
            <Link href={backHref} className="ui-control">Back to list</Link>
            <Link href={editHref} className="ui-control ui-control--primary">Edit</Link>
            {publicHref ? <Link href={publicHref} className="ui-control">{publicLabel}</Link> : null}
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="ui-control ui-control--icon"
              aria-label="Open settings"
              onPress={settings.open}
            >
              <Cog6ToothIcon className="size-5" />
            </Button>
            <EditorialStatusBadge status={status} label={statusLabel} />
          </div>
        </div>

        <section className="ui-card ui-editor-canvas">
          {canvas}
        </section>
      </section>

      <EditorialSettingsDrawer state={settings} title={settingsTitle}>
        {settingsContent}
      </EditorialSettingsDrawer>
    </>
  );
}
