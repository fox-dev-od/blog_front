import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
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
  placeholder = 'Напишіть контент...',
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

  // Keep editor content in sync with external values (e.g. when initialValue loads)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, bgcolor: 'background.paper' }}>
      <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        <Button
          size="small"
          variant={editor?.isActive('bold') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          sx={{ textTransform: 'none', minWidth: 40 }}
        >
          <b>B</b>
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('italic') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          sx={{ textTransform: 'none', minWidth: 40 }}
        >
          <i>I</i>
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('strike') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          sx={{ textTransform: 'none', minWidth: 40 }}
        >
          <s>S</s>
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Button
          size="small"
          variant={editor?.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          sx={{ textTransform: 'none', px: 1 }}
        >
          H1
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          sx={{ textTransform: 'none', px: 1 }}
        >
          H2
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          sx={{ textTransform: 'none', px: 1 }}
        >
          H3
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Button
          size="small"
          variant={editor?.isActive('bulletList') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          sx={{ textTransform: 'none' }}
        >
          • Список
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('orderedList') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          sx={{ textTransform: 'none' }}
        >
          1. Список
        </Button>
        <Button
          size="small"
          variant={editor?.isActive('blockquote') ? 'contained' : 'outlined'}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          sx={{ textTransform: 'none' }}
        >
          Цитата
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
          sx={{ textTransform: 'none' }}
        >
          Очистити
        </Button>
      </Stack>
      <Box sx={{
        minHeight: 180,
        outline: 'none',
        '& .ProseMirror': {
          outline: 'none',
          minHeight: 180,
          fontFamily: 'inherit',
          fontSize: '15px',
          lineHeight: '1.6',
        },
        '& .ProseMirror p.is-editor-empty:first-of-type::before': {
          color: 'text.secondary',
          content: 'attr(data-placeholder)',
          float: 'left',
          height: 0,
          pointerEvents: 'none',
        }
      }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};
