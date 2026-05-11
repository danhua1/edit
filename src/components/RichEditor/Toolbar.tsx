import { useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import { Button, ColorPicker, Divider, Select, Space, Tooltip, Upload } from 'antd';
import type { Color } from 'antd/es/color-picker';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CodeOutlined,
  FontColorsOutlined,
  HighlightOutlined,
  ItalicOutlined,
  LinkOutlined,
  MinusOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  TableOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

interface ToolbarProps {
  editor: Editor;
}

const HEADING_OPTIONS = [
  { label: '正文', value: 'paragraph' },
  { label: '标题 1', value: 'h1' },
  { label: '标题 2', value: 'h2' },
  { label: '标题 3', value: 'h3' },
  { label: '标题 4', value: 'h4' },
];

const FONT_FAMILY_OPTIONS = [
  { label: '衬线正文', value: 'Georgia, serif' },
  { label: '无衬线', value: 'Arial, Helvetica, sans-serif' },
  { label: '宋体', value: '"SimSun", "Songti SC", serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '等宽', value: '"SFMono-Regular", Consolas, monospace' },
];

const FONT_SIZE_OPTIONS = ['12px', '14px', '15px', '16px', '18px', '20px', '24px', '28px'];

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const Toolbar = ({ editor }: ToolbarProps) => {
  const currentHeading = useMemo(() => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'paragraph';
  }, [editor, editor.state]);

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily || undefined;
  const currentFontSize = editor.getAttributes('textStyle').fontSize || undefined;

  const onColorChange = (value: Color) => {
    editor.chain().focus().setColor(value.toHexString()).run();
  };

  const onHighlightChange = (value: Color) => {
    editor.chain().focus().toggleHighlight({ color: value.toHexString() }).run();
  };

  const onImageUpload = async (file: File) => {
    const src = await fileToDataUrl(file);
    editor.chain().focus().setImage({ src }).run();
    return false;
  };

  const onHeadingChange = (value: string) => {
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
      return;
    }

    const level = Number(value.replace('h', '')) as 1 | 2 | 3 | 4;
    editor.chain().focus().setHeading({ level }).run();
  };

  const onFontFamilyChange = (value: string) => {
    if (!value) {
      editor.chain().focus().unsetFontFamily().run();
      return;
    }

    editor.chain().focus().setFontFamily(value).run();
  };

  const onFontSizeChange = (value: string) => {
    if (!value) {
      editor.chain().focus().unsetFontSize().run();
      return;
    }

    editor.chain().focus().setFontSize(value).run();
  };

  const onInsertLink = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('请输入链接地址', previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  return (
    <div className="editor-toolbar">
      <Space size={2}>
        <Tooltip title="撤销">
          <Button
            size="small"
            type="text"
            icon={<UndoOutlined />}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          />
        </Tooltip>
        <Tooltip title="重做">
          <Button
            size="small"
            type="text"
            icon={<RedoOutlined />}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      <Select
        size="small"
        value={currentHeading}
        options={HEADING_OPTIONS}
        style={{ width: 96 }}
        onChange={onHeadingChange}
      />

      <Select
        size="small"
        allowClear
        placeholder="字体"
        value={currentFontFamily}
        options={FONT_FAMILY_OPTIONS}
        style={{ width: 128 }}
        onChange={onFontFamilyChange}
      />

      <Select
        size="small"
        allowClear
        placeholder="字号"
        value={currentFontSize}
        options={FONT_SIZE_OPTIONS.map((value) => ({ label: value, value }))}
        style={{ width: 88 }}
        onChange={onFontSizeChange}
      />

      <Divider type="vertical" />

      <Space size={2}>
        <Tooltip title="粗体">
          <Button
            size="small"
            icon={<BoldOutlined />}
            type={editor.isActive('bold') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip title="斜体">
          <Button
            size="small"
            icon={<ItalicOutlined />}
            type={editor.isActive('italic') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip title="下划线">
          <Button
            size="small"
            icon={<UnderlineOutlined />}
            type={editor.isActive('underline') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </Tooltip>
        <Tooltip title="行内代码">
          <Button
            size="small"
            icon={<CodeOutlined />}
            type={editor.isActive('code') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      <Space size={2}>
        <ColorPicker size="small" defaultValue="#222222" onChange={onColorChange}>
          <Button size="small" type="text" icon={<FontColorsOutlined />} />
        </ColorPicker>
        <ColorPicker size="small" defaultValue="#fff1b8" onChange={onHighlightChange}>
          <Button
            size="small"
            icon={<HighlightOutlined />}
            type={editor.isActive('highlight') ? 'primary' : 'text'}
          />
        </ColorPicker>
      </Space>

      <Divider type="vertical" />

      <Space size={2}>
        <Tooltip title="无序列表">
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            type={editor.isActive('bulletList') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Tooltip title="有序列表">
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            type={editor.isActive('orderedList') ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      <Space size={2}>
        <Tooltip title="左对齐">
          <Button
            size="small"
            icon={<AlignLeftOutlined />}
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
        </Tooltip>
        <Tooltip title="居中">
          <Button
            size="small"
            icon={<AlignCenterOutlined />}
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
        </Tooltip>
        <Tooltip title="右对齐">
          <Button
            size="small"
            icon={<AlignRightOutlined />}
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      <Space size={2}>
        <Upload accept="image/*" showUploadList={false} beforeUpload={onImageUpload}>
          <Button size="small" type="text" icon={<PictureOutlined />} />
        </Upload>
        <Tooltip title="插入链接">
          <Button
            size="small"
            icon={<LinkOutlined />}
            type={editor.isActive('link') ? 'primary' : 'text'}
            onClick={onInsertLink}
          />
        </Tooltip>
        <Tooltip title="插入表格">
          <Button
            size="small"
            type="text"
            icon={<TableOutlined />}
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          />
        </Tooltip>
        <Tooltip title="分隔线">
          <Button
            size="small"
            type="text"
            icon={<MinusOutlined />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Toolbar;
