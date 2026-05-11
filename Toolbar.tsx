import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Button,
  Divider,
  Dropdown,
  Space,
  Tooltip,
  ColorPicker,
  Upload,
  Select,
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  PictureOutlined,
  LinkOutlined,
  UndoOutlined,
  RedoOutlined,
  TableOutlined,
  CodeOutlined,
  MinusOutlined,
  HighlightOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';

interface ToolbarProps {
  editor: Editor;
}

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];
const HEADING_LEVELS = [
  { label: '正文', value: 'paragraph' },
  { label: '标题 1', value: 'h1' },
  { label: '标题 2', value: 'h2' },
  { label: '标题 3', value: 'h3' },
  { label: '标题 4', value: 'h4' },
];

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'paragraph';
  };

  const handleHeadingChange = (value: string) => {
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    return false; // prevent default upload
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleInsertLink = () => {
    const url = window.prompt('请输入链接地址：');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="editor-toolbar">
      {/* 撤销 / 重做 */}
      <Space size={2}>
        <Tooltip title="撤销 (Ctrl+Z)">
          <Button
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            type="text"
          />
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)">
          <Button
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            type="text"
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      {/* 段落 / 标题 */}
      <Select
        size="small"
        value={getCurrentHeading()}
        onChange={handleHeadingChange}
        style={{ width: 90 }}
        options={HEADING_LEVELS}
      />

      <Divider type="vertical" />

      {/* 格式 */}
      <Space size={2}>
        <Tooltip title="粗体 (Ctrl+B)">
          <Button
            size="small"
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type={editor.isActive('bold') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="斜体 (Ctrl+I)">
          <Button
            size="small"
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type={editor.isActive('italic') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="下划线 (Ctrl+U)">
          <Button
            size="small"
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            type={editor.isActive('underline') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="删除线">
          <Button
            size="small"
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            type={editor.isActive('strike') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="行内代码">
          <Button
            size="small"
            icon={<CodeOutlined />}
            onClick={() => editor.chain().focus().toggleCode().run()}
            type={editor.isActive('code') ? 'primary' : 'text'}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      {/* 字体颜色 / 高亮 */}
      <Space size={2}>
        <Tooltip title="字体颜色">
          <ColorPicker
            size="small"
            onChange={(color) => {
              editor.chain().focus().setColor(color.toHexString()).run();
            }}
            defaultValue="#000000"
          >
            <Button size="small" type="text" icon={<FontColorsOutlined />} />
          </ColorPicker>
        </Tooltip>
        <Tooltip title="高亮">
          <ColorPicker
            size="small"
            onChange={(color) => {
              editor.chain().focus().toggleHighlight({ color: color.toHexString() }).run();
            }}
            defaultValue="#FFFF00"
          >
            <Button
              size="small"
              type={editor.isActive('highlight') ? 'primary' : 'text'}
              icon={<HighlightOutlined />}
            />
          </ColorPicker>
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      {/* 列表 */}
      <Space size={2}>
        <Tooltip title="无序列表">
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type={editor.isActive('bulletList') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="有序列表">
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type={editor.isActive('orderedList') ? 'primary' : 'text'}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      {/* 对齐 */}
      <Space size={2}>
        <Tooltip title="左对齐">
          <Button
            size="small"
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="居中">
          <Button
            size="small"
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="右对齐">
          <Button
            size="small"
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" />

      {/* 插入 */}
      <Space size={2}>
        <Tooltip title="插入图片（点击选择或直接拖拽/粘贴）">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Button size="small" type="text" icon={<PictureOutlined />} />
          </Upload>
        </Tooltip>
        <Tooltip title="插入链接">
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={handleInsertLink}
            type={editor.isActive('link') ? 'primary' : 'text'}
          />
        </Tooltip>
        <Tooltip title="插入表格">
          <Button
            size="small"
            icon={<TableOutlined />}
            onClick={handleInsertTable}
            type="text"
          />
        </Tooltip>
        <Tooltip title="分割线">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            type="text"
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Toolbar;
