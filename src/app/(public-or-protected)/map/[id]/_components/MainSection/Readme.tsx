// LIBRARIES
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Save,
  X,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Highlighter as HighlightIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table as TableExtension } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import UnderlineExtension from "@tiptap/extension-underline";
import HighlightExtension from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import { createLowlight } from "lowlight";
import { marked } from "marked";
import TurndownService from "turndown";
import { DOMParser } from "prosemirror-model";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";

/*======= MARKDOWN UTILITIES =======*/
// Initialize Turndown service for HTML to Markdown conversion
const turndown_service = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
});

// Configure marked for Markdown to HTML conversion
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Convert HTML to Markdown
const html_to_markdown = (html: string): string => {
  if (!html || html.trim() === "") return "";
  return turndown_service.turndown(html);
};

// Convert Markdown to HTML
const markdown_to_html = (markdown: string): string => {
  if (!markdown || markdown.trim() === "") return "";
  return marked.parse(markdown) as string;
};

// Check if text looks like markdown
const is_markdown_text = (text: string): boolean => {
  if (!text || text.trim() === "") return false;

  const lines = text.split("\n");
  const markdownPatterns = [
    /^#{1,6}\s+/, // Headers (# ## ### etc.)
    /^\*\s+/, // Unordered lists (* item)
    /^-\s+/, // Unordered lists (- item)
    /^\+\s+/, // Unordered lists (+ item)
    /^\d+\.\s+/, // Ordered lists (1. item)
    /^\>\s+/, // Blockquotes (> quote)
    /```/, // Code blocks
    /`[^`]+`/, // Inline code
    /\[([^\]]+)\]\(([^)]+)\)/, // Links [text](url)
    /\*\*[^*]+\*\*/, // Bold **text**
    /\*[^*]+\*/, // Italic *text*
    /__[^_]+__/, // Bold __text__
    /_[^_]+_/, // Italic _text_
    /^\|.*\|/, // Tables
    /^---+$/, // Horizontal rules
  ];

  // Check if any line matches markdown patterns
  return lines.some((line) =>
    markdownPatterns.some((pattern) => pattern.test(line.trim()))
  );
};

/*======= LANGUAGE SELECTOR COMPONENT =======*/
interface LanguageSelectorProps {
  editor: any;
}

function LanguageSelector({ editor }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: null, label: "Plain Text" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "json", label: "JSON" },
    { value: "sql", label: "SQL" },
    { value: "css", label: "CSS" },
    { value: "html", label: "HTML" },
    { value: "bash", label: "Bash" },
  ];

  const isInCodeBlock = editor.isActive("codeBlock");
  const currentLanguage = isInCodeBlock
    ? editor.getAttributes("codeBlock").language
    : null;
  const currentLabel =
    languages.find((lang) => lang.value === currentLanguage)?.label ||
    "Plain Text";

  const setLanguage = (language: string | null) => {
    if (isInCodeBlock) {
      if (language) {
        editor
          .chain()
          .focus()
          .updateAttributes("codeBlock", { language })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .updateAttributes("codeBlock", { language: null })
          .run();
      }
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Always show the selector, but disable when not in code block
  if (!isInCodeBlock) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[100px] justify-between"
      >
        {currentLabel}
        <ChevronDown className="size-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-md z-50 min-w-[120px]">
          {languages.map((language) => (
            <button
              key={language.value || "plain"}
              className="w-full text-left px-3 py-2 text-sm hover:bg-hover hover:text-hover-foreground first:rounded-t-md last:rounded-b-md"
              onClick={() => setLanguage(language.value)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/*======= TOOLBAR COMPONENT =======*/
interface ToolbarProps {
  editor: any;
}

function EditorToolbar({ editor }: ToolbarProps) {
  const [, forceUpdate] = useState({});

  if (!editor) return null;

  // Force re-render when editor selection changes to update active states
  useEffect(() => {
    const updateHandler = () => forceUpdate({});
    editor.on("selectionUpdate", updateHandler);
    editor.on("transaction", updateHandler);

    return () => {
      editor.off("selectionUpdate", updateHandler);
      editor.off("transaction", updateHandler);
    };
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("highlight") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
      >
        <HighlightIcon className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("code") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
      >
        <Code className="size-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Headings */}
      <Button
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="size-4" />
      </Button>

      <Button
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </Button>

      <Button
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </Button>

      <Button
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Code Block */}
      <Button
        variant={editor.isActive("codeBlock") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="size-4" />
        Block
      </Button>

      {/* Language Selector - only show when code block is active */}
      <LanguageSelector editor={editor} />

      {/* Link */}
      <Button
        variant={editor.isActive("link") ? "default" : "outline"}
        size="sm"
        onClick={addLink}
      >
        <LinkIcon className="size-4" />
      </Button>

      {/* Table */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="size-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Alignment */}
      <Button
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-4" />
      </Button>

      <Button
        variant={
          editor.isActive({ textAlign: "center" }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-4" />
      </Button>

      <Button
        variant={
          editor.isActive({ textAlign: "right" }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="size-4" />
      </Button>
    </div>
  );
}

/*======= PROPS =======*/
interface ReadmeProps {
  is_editing: boolean;
  set_editing: (is_editing: boolean) => void;
}

/*======= COMPONENT =======*/
export default function Readme({ is_editing, set_editing }: ReadmeProps) {
  /*------- ATTRIBUTS -------*/
  const [readme_markdown, update_map] = useMapStore((state) => [
    state.map?.readme, // This will now store markdown string
    state.update_map,
  ]);
  const [is_saving, set_saving] = useState(false);

  // Create a stable lowlight instance
  const lowlight = useMemo(() => {
    const instance = createLowlight();

    // Register languages immediately with dynamic imports
    const setupLanguages = async () => {
      try {
        const [javascript, typescript, python, json, sql, css, xml, bash] =
          await Promise.all([
            import("highlight.js/lib/languages/javascript"),
            import("highlight.js/lib/languages/typescript"),
            import("highlight.js/lib/languages/python"),
            import("highlight.js/lib/languages/json"),
            import("highlight.js/lib/languages/sql"),
            import("highlight.js/lib/languages/css"),
            import("highlight.js/lib/languages/xml"),
            import("highlight.js/lib/languages/bash"),
          ]);

        instance.register("javascript", javascript.default);
        instance.register("typescript", typescript.default);
        instance.register("python", python.default);
        instance.register("json", json.default);
        instance.register("sql", sql.default);
        instance.register("css", css.default);
        instance.register("html", xml.default);
        instance.register("bash", bash.default);
      } catch (error) {
        console.error("Failed to load syntax highlighting languages:", error);
      }
    };

    setupLanguages();
    return instance;
  }, []);

  // Convert markdown to HTML for editor initialization
  const initial_html_content = useMemo(() => {
    if (!readme_markdown) return "";
    return markdown_to_html(readme_markdown);
  }, [readme_markdown]);

  // TipTap Editor Configuration
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit,
      UnderlineExtension,
      HighlightExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableExtension.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto",
        },
        defaultLanguage: null,
      }),
    ],
    content: initial_html_content,
    editable: is_editing,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "prose-headings:text-foreground prose-headings:font-semibold",
          "prose-p:text-foreground prose-p:leading-7",
          "prose-a:text-primary prose-a:underline prose-a:underline-offset-2",
          "prose-strong:text-foreground prose-em:text-foreground",
          "prose-code:bg-muted prose-code:text-foreground prose-code:rounded prose-code:px-1",
          "prose-pre:bg-muted prose-pre:text-foreground",
          "prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-muted/40 prose-blockquote:pl-4 prose-blockquote:py-2",
          "prose-ul:list-disc prose-ol:list-decimal prose-li:text-foreground",
          "prose-table:border prose-table:rounded-sm prose-th:bg-muted prose-th:border prose-th:px-3 prose-th:py-2",
          "prose-td:border prose-td:px-4 prose-td:py-2 prose-td:text-foreground",
          "min-h-[400px] p-4"
        ),
      },
      handlePaste: (view, event, slice) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const pastedText = clipboardData.getData("text/plain");
        if (!pastedText) return false;

        // Check if the pasted text looks like markdown
        const isMarkdown = is_markdown_text(pastedText);

        if (isMarkdown) {
          // Convert markdown to HTML
          const htmlContent = markdown_to_html(pastedText);

          // Use TipTap's built-in HTML parsing to insert the content
          const { state, dispatch } = view;
          const { from, to } = state.selection;

          // Create a temporary element to hold the HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlContent;

          // Use TipTap's HTML parser to convert HTML to ProseMirror nodes
          // We'll use the editor's built-in HTML parsing capabilities
          const parser = DOMParser.fromSchema(state.schema);
          const dom = tempDiv;
          const parsedContent = parser.parse(dom);

          // Replace the selection with the parsed content
          const tr = state.tr.replaceWith(from, to, parsedContent.content);
          dispatch(tr);

          return true; // Prevent default paste behavior
        }

        return false; // Allow default paste behavior for non-markdown
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save functionality could be added here if desired
    },
  });

  /*------- EFFECTS -------*/
  useEffect(() => {
    if (editor && readme_markdown !== undefined) {
      const html_content = markdown_to_html(readme_markdown || "");
      editor.commands.setContent(html_content);
    }
  }, [editor, readme_markdown]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(is_editing);
      if (is_editing) {
        editor.commands.focus();
      }
    }
  }, [editor, is_editing]);

  // Simple re-highlighting when content changes or tab becomes visible
  useEffect(() => {
    const triggerHighlighting = () => {
      if (editor && editor.view) {
        // Wait for lowlight languages to be registered
        setTimeout(() => {
          // Force the editor to re-process all code blocks
          const { state } = editor.view;
          const { tr } = state;

          // Find all code blocks and trigger their re-rendering
          state.doc.descendants((node, pos) => {
            if (node.type.name === "codeBlock" && node.attrs.language) {
              // Force re-render by updating the node (even with same attributes)
              tr.setNodeMarkup(pos, undefined, { ...node.attrs });
            }
          });

          if (tr.docChanged) {
            editor.view.dispatch(tr);
          }
        }, 200); // Give time for languages to load
      }
    };

    // Trigger on content load
    if (editor && readme_markdown) {
      triggerHighlighting();
    }

    // Trigger on visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        triggerHighlighting();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [editor, readme_markdown]);

  /*------- METHODS -------*/
  const handle_save = async () => {
    if (!editor) return;

    set_saving(true);

    try {
      const html_content = editor.getHTML();
      const markdown_content = html_to_markdown(html_content);
      await update_map({
        readme: markdown_content,
      });
      set_editing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to save readme",
      });
    } finally {
      set_saving(false);
    }
  };

  const handle_cancel = () => {
    if (editor) {
      const html_content = markdown_to_html(readme_markdown || "");
      editor.commands.setContent(html_content);
    }
    set_editing(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!is_editing) return;

      // Ctrl+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handle_save();
      }
      // Esc to cancel
      if (event.key === "Escape") {
        event.preventDefault();
        handle_cancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [is_editing, editor, readme_markdown]);

  /*------- RENDERER -------*/
  if (!editor) {
    return (
      <div className="h-full p-4 overflow-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {is_editing ? (
        <>
          {/* Toolbar */}
          <EditorToolbar editor={editor} />

          {/* Editor */}
          <div className="flex-1 overflow-auto">
            <EditorContent editor={editor} className="h-full" />
          </div>

          {/* Footer with actions */}
          <div className="border-t border-border p-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Rich text editor • Use toolbar for formatting
            </span>

            <div className="flex items-center gap-x-2">
              <Button
                variant="outline"
                onClick={handle_cancel}
                disabled={is_saving}
              >
                Cancel
                <X className="size-4" />
              </Button>

              <Button
                variant="primary"
                onClick={handle_save}
                disabled={is_saving}
              >
                {is_saving ? "Saving..." : "Save"}
                <Save className="size-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full overflow-auto">
          {readme_markdown ? (
            <div
              className={cn(
                "prose prose-sm max-w-none",
                "prose-headings:text-foreground prose-headings:font-semibold",
                "prose-p:text-foreground prose-p:leading-7",
                "prose-a:text-primary prose-a:underline prose-a:underline-offset-2",
                "prose-strong:text-foreground prose-em:text-foreground",
                "prose-code:bg-muted prose-code:text-foreground prose-code:rounded prose-code:px-1",
                "prose-pre:bg-muted prose-pre:text-foreground",
                "prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-muted/40 prose-blockquote:pl-4 prose-blockquote:py-2",
                "prose-ul:list-disc prose-ol:list-decimal prose-li:text-foreground",
                "prose-table:border prose-table:rounded-sm prose-th:bg-muted prose-th:border prose-th:px-3 prose-th:py-2",
                "prose-td:border prose-td:px-4 prose-td:py-2 prose-td:text-foreground",
                "min-h-[400px] p-4"
              )}
              dangerouslySetInnerHTML={{
                __html: markdown_to_html(readme_markdown),
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm italic">No readme content available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
