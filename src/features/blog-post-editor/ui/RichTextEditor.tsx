import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

type RichTextEditorProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write content...',
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
      </Stack>
      <EditorContent editor={editor} />
    </Box>
  );
};
