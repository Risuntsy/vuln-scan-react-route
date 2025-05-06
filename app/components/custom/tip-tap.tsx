import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "#/lib/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import yaml from "highlight.js/lib/languages/yaml";

import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
lowlight.register("yaml", yaml);

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function Tiptap({ content, onChange, className }: TiptapProps) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: false
        }),
        CodeBlockLowlight.configure({ lowlight })
      ],
      content: `<pre><code class="language-yaml">${content}</code></pre>`,
      onUpdate: ({ editor }) => {
        onChange(editor.getText());
      },
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm max-w-none w-full max-w-full min-h-[200px] max-h-[600px] overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )
        }
      }
    },
    [content]
  );

  return <EditorContent editor={editor} />;
}
