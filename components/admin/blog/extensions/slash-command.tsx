import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import {
  AlertTriangle,
  CheckCircle,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Info,
  Lightbulb,
  List,
  ListOrdered,
  Quote,
  Table,
  Youtube,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import tippy from "tippy.js";

const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length,
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-md transition-all dark:border-slate-800 dark:bg-slate-900">
      {props.items.map((item: any, index: number) => (
        <button
          className={`flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 ${
            index === selectedIndex ? "bg-slate-100 dark:bg-slate-800" : ""
          }`}
          key={index}
          onClick={() => selectItem(index)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            {item.icon}
          </div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = "CommandList";

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: any) => {
      component?.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup?.[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown: (props: any) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();
        return true;
      }
      return (component?.ref as any)?.onKeyDown?.(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Heading 1",
      description: "Big section heading",
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading",
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list",
      searchTerms: ["unordered", "point"],
      icon: <List className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering",
      searchTerms: ["ordered"],
      icon: <ListOrdered className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote",
      searchTerms: ["blockquote"],
      icon: <Quote className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: "Image",
      description: "Upload an image from your computer",
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).run();
        // Trigger image upload dialog via custom event or prop
        const event = new CustomEvent("open-image-dialog");
        window.dispatchEvent(event);
      },
    },
    {
      title: "Youtube",
      description: "Embed a Youtube video",
      searchTerms: ["video", "youtube", "embed"],
      icon: <Youtube className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        const url = prompt("Enter Youtube URL");
        if (url) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setYoutubeVideo({ src: url })
            .run();
        }
      },
    },
    {
      title: "Table",
      description: "Insert a table",
      searchTerms: ["table"],
      icon: <Table className="h-4 w-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
    {
      title: "Info Callout",
      description: "Blue info box",
      searchTerms: ["alert", "info", "box"],
      icon: <Info className="h-4 w-4 text-blue-500" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setCallout({ type: "info" })
          .run();
      },
    },
    {
      title: "Warning Callout",
      description: "Orange warning box",
      searchTerms: ["alert", "warning", "box"],
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setCallout({ type: "warning" })
          .run();
      },
    },
    {
      title: "Success Callout",
      description: "Green success box",
      searchTerms: ["alert", "success", "box"],
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setCallout({ type: "success" })
          .run();
      },
    },
    {
      title: "Tip Callout",
      description: "Purple tip box",
      searchTerms: ["alert", "tip", "box"],
      icon: <Lightbulb className="h-4 w-4 text-purple-500" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setCallout({ type: "tip" })
          .run();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

export const slashCommandConfig = {
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
};
