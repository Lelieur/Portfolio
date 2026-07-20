"use client"

import type { JSONContent } from "@tiptap/core"
import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"
import { LinkPopover, LinkContent } from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import {
  ThemeToggle,
  getSystemTheme,
  type ThemeMode,
} from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import defaultContent from "@/components/tiptap-templates/simple/data/content.json"

function resolveDefaultTheme(): ThemeMode {
  const rootTheme = document.documentElement.dataset.theme

  if (rootTheme === "light" || rootTheme === "dark") {
    return rootTheme
  }

  return getSystemTheme()
}

const MoreToolbarMenu = ({ theme }: { theme: ThemeMode }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="small"
        aria-label="More formatting options"
        tooltip="More"
      >
        <span className="tiptap-button-text">More</span>
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className={theme === "dark" ? "dark" : undefined}
    >
      <DropdownMenuLabel>Formatting</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <BlockquoteButton text="Blockquote" showTooltip={false} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CodeBlockButton text="Code block" showTooltip={false} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <MarkButton type="strike" text="Strike" showTooltip={false} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <MarkButton type="code" text="Inline code" showTooltip={false} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <MarkButton type="underline" text="Underline" showTooltip={false} />
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
      <DropdownMenuLabel>Highlight</DropdownMenuLabel>
      <div className="px-1 py-1">
        <ColorHighlightPopover
          showTooltip={false}
          contentClassName={theme === "dark" ? "dark" : undefined}
        />
      </div>

      <DropdownMenuSeparator />
      <DropdownMenuLabel>Layout</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <MarkButton type="superscript" text="Superscript" showTooltip={false} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <MarkButton type="subscript" text="Subscript" showTooltip={false} />
        </DropdownMenuItem>
      </DropdownMenuGroup>

    </DropdownMenuContent>
  </DropdownMenu>
)

const MainToolbarContent = ({
  hideThemeToggle,
  theme,
  onToggleTheme,
}: {
  hideThemeToggle: boolean
  theme: ThemeMode
  onToggleTheme: () => void
}) => {
  return (
    <>
      <div></div>

      <div className="simple-editor-toolbar-main">
        <ToolbarGroup>
          <UndoRedoButton action="undo" size="small" />
          <UndoRedoButton action="redo" size="small" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} size="small" />
          <ListDropdownMenu
            modal={false}
            types={['bulletList', 'orderedList', 'taskList']}
            size="small"
          />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MarkButton type="bold" size="small" />
          <MarkButton type="italic" size="small" />
          <LinkPopover size="small" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <TextAlignButton align="left" size="small" />
          <TextAlignButton align="center" size="small" />
          <TextAlignButton align="right" size="small" />
          <TextAlignButton align="justify" size="small" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ImageUploadButton size="small" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MoreToolbarMenu theme={theme} />
        </ToolbarGroup>
      </div>

      {!hideThemeToggle ? (
        <div className="simple-editor-toolbar-toggle">
          <ToolbarGroup>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </ToolbarGroup>
        </div>
      ) : null}
    </>
  );
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        <LinkIcon className="tiptap-button-icon" />
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    <LinkContent />
  </>
)

export function SimpleEditor({
  content = defaultContent as JSONContent,
  onChange,
  hideThemeToggle = false,
  className = "",
}: {
  content?: JSONContent
  onChange?: (value: JSONContent) => void
  hideThemeToggle?: boolean
  className?: string
}) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "link">("main")
  const [theme, setTheme] = useState<ThemeMode>("light")
  const [hasLocalThemeOverride, setHasLocalThemeOverride] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getJSON())
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const root = document.documentElement

    const syncThemeFromApp = () => {
      if (hasLocalThemeOverride) return
      setTheme(resolveDefaultTheme())
    }

    syncThemeFromApp()

    const mediaHandler = () => syncThemeFromApp()
    const observer = new MutationObserver(syncThemeFromApp)

    mediaQuery.addEventListener("change", mediaHandler)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    })

    return () => {
      mediaQuery.removeEventListener("change", mediaHandler)
      observer.disconnect()
    }
  }, [hasLocalThemeOverride])

  useEffect(() => {
    if (!editor) return

    const next = JSON.stringify(content)
    const current = JSON.stringify(editor.getJSON())

    if (next !== current) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  const toggleTheme = () => {
    setHasLocalThemeOverride(true)
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
  }

  return (
    <div
      className={`simple-editor-wrapper ${theme === "dark" ? "dark" : ""} ${className}`.trim()}
      data-theme={theme}
    >
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              hideThemeToggle={hideThemeToggle}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          ) : (
            <MobileToolbarContent
              type="link"
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
