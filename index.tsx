import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { CustomImage } from './CustomImage';
import Toolbar from './Toolbar';
import './editor.css';

interface RichEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = '开始输入内容…支持从 Word 直接粘贴，图片可拖拽或粘贴上传',
  minHeight = 500,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit 内置 History，不需要额外引入
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      CustomImage.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content',
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-editor-wrapper">
      <Toolbar editor={editor} />
      <div className="editor-body">
        <EditorContent editor={editor} />
      </div>
      <div className="editor-footer">
        <span className="word-count">
          字符数：{editor.storage.characterCount?.characters?.() ?? editor.getText().length}
        </span>
        <span className="hint">支持拖拽图片 · 粘贴截图 · Word 内容直接粘贴</span>
      </div>
    </div>
  );
};

export default RichEditor;
