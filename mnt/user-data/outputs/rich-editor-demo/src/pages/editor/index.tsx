import React, { useState } from 'react';
import { Card, Layout, Typography, Tabs, Button, message, Space, Tag } from 'antd';
import { FileTextOutlined, CodeOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import RichEditor from '@/components/RichEditor';
import './index.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const INITIAL_CONTENT = `<h1>欢迎使用富文本编辑器</h1>
<p>这是一个基于 <strong>Tiptap + Ant Design + UMI</strong> 构建的富文本编辑器，支持以下功能：</p>
<h2>✦ 图片功能</h2>
<ul>
  <li>📎 <strong>拖拽上传</strong>：直接将图片文件拖入编辑区域</li>
  <li>📋 <strong>粘贴上传</strong>：截图后直接 Ctrl+V 粘贴</li>
  <li>🖼️ <strong>按钮上传</strong>：点击工具栏图片按钮选择文件</li>
  <li>📄 <strong>Word 图片</strong>：从 Word 复制含图片的内容直接粘贴</li>
</ul>
<h2>✦ 排版功能</h2>
<ul>
  <li>H1 ~ H4 多级标题</li>
  <li>粗体、斜体、下划线、删除线、行内代码</li>
  <li>字体颜色 &amp; 高亮颜色</li>
  <li>左对齐、居中、右对齐</li>
  <li>有序列表、无序列表</li>
  <li>表格（支持拖拽调整列宽）</li>
  <li>引用块、分割线</li>
</ul>
<h2>✦ Word 兼容</h2>
<p>直接从 Word 文档中复制文字、标题、列表、表格，粘贴后<strong>样式自动保留</strong>，无需重新排版。</p>
<blockquote><p>试试从 Word 中复制一段带格式的文字，然后粘贴到这里 👆</p></blockquote>
<hr>
<p>开始编辑吧！</p>`;

export default function EditorPage() {
  const [html, setHtml] = useState(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState('editor');

  const handleSave = () => {
    message.success('保存成功（示例，实际可提交到后端）');
    console.log('HTML Content:', html);
  };

  return (
    <Layout className="editor-page-layout">
      <Header className="editor-page-header">
        <div className="header-left">
          <FileTextOutlined className="header-icon" />
          <Title level={4} style={{ margin: 0, color: '#fff' }}>
            Rich Editor Demo
          </Title>
        </div>
        <div className="header-right">
          <Space>
            <Tag color="blue">Tiptap 2.x</Tag>
            <Tag color="green">Ant Design 5.x</Tag>
            <Tag color="purple">UMI 4.x</Tag>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginLeft: 8 }}
            >
              保存
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="editor-page-content">
        <Card
          className="editor-card"
          bodyStyle={{ padding: 0 }}
          tabList={[
            { key: 'editor', tab: <span><FileTextOutlined /> 编辑</span> },
            { key: 'preview', tab: <span><EyeOutlined /> 预览</span> },
            { key: 'html', tab: <span><CodeOutlined /> HTML 源码</span> },
          ]}
          activeTabKey={activeTab}
          onTabChange={setActiveTab}
        >
          {activeTab === 'editor' && (
            <RichEditor
              value={INITIAL_CONTENT}
              onChange={setHtml}
              minHeight={600}
            />
          )}

          {activeTab === 'preview' && (
            <div
              className="preview-content tiptap-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {activeTab === 'html' && (
            <div className="html-source">
              <pre>{html}</pre>
            </div>
          )}
        </Card>

        {/* 功能说明卡片 */}
        <Card className="tips-card" size="small" title="💡 快捷操作提示">
          <div className="tips-grid">
            <div className="tip-item">
              <Text strong>图片拖拽</Text>
              <Text type="secondary">将图片文件直接拖入编辑区域</Text>
            </div>
            <div className="tip-item">
              <Text strong>截图粘贴</Text>
              <Text type="secondary">截图后 Ctrl+V / Cmd+V 直接粘贴</Text>
            </div>
            <div className="tip-item">
              <Text strong>Word 粘贴</Text>
              <Text type="secondary">从 Word/WPS 复制内容直接粘贴，样式保留</Text>
            </div>
            <div className="tip-item">
              <Text strong>快捷键</Text>
              <Text type="secondary">Ctrl+B 粗体 · Ctrl+I 斜体 · Ctrl+Z 撤销</Text>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
