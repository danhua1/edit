import { useState } from 'react';
import { CheckCircleOutlined, CodeOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { App, Button, Card, Layout, Space, Tabs, Tag, Typography, message } from 'antd';
import RichEditor from '@/components/RichEditor';
import './index.css';
import './rich.css'
import RichTextPreview from '@/components/pre/RichTextPreview';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const INITIAL_CONTENT = `
<h1>富文本编辑器 Demo</h1>
<p>这是一个基于 <strong>React + Tiptap + antd + UMI</strong> 的简单演示，用来验证常见文档排版和图片处理能力。</p>
<h2>核心能力</h2>
<ul>
  <li><strong>图片上传</strong>：支持按钮选择、直接拖拽到编辑区、截图粘贴。</li>
  <li><strong>文档排版</strong>：支持标题、颜色、字体、字号、列表、引用、表格与分隔线。</li>
  <li><strong>Word / WPS 粘贴</strong>：粘贴富文本时尽量保留结构和常见样式。</li>
</ul>
<blockquote>
  <p>可以直接把 Word 中的一段正文、表格或者带图片的内容复制到这里试一下。</p>
</blockquote>
<h3>示例表格</h3>
<table>
  <tbody>
    <tr><th>模块</th><th>状态</th><th>说明</th></tr>
    <tr><td>图片拖拽</td><td>已支持</td><td>拖入本地图片文件即可插入</td></tr>
    <tr><td>截图粘贴</td><td>已支持</td><td>微信截图、系统截图都可直接粘贴</td></tr>
    <tr><td>富文本粘贴</td><td>已支持</td><td>Word/WPS 常见段落、列表、表格会保留</td></tr>
  </tbody>
</table>
<p>下面开始自由编辑内容。</p>
`;

const tabItems = [
  {
    key: 'editor',
    label: (
      <span>
        <FileTextOutlined /> 编辑
      </span>
    ),
  },
  {
    key: 'preview',
    label: (
      <span>
        <EyeOutlined /> 预览
      </span>
    ),
  },
  {
    key: 'html',
    label: (
      <span>
        <CodeOutlined /> HTML
      </span>
    ),
  },
];

export default function EditorPage() {
  // const { message } = App.useApp();
  const [html, setHtml] = useState(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState('editor');

  return (
    <Layout className="editor-page-layout">
      <Header className="editor-page-header">
        <div>
          <Tag bordered={false} color="blue">
            Demo
          </Tag>
          <Title level={3} className="editor-page-title">
            Rich Editor Playground
          </Title>
          <Paragraph className="editor-page-subtitle">
            面向简单内容编辑场景，优先验证排版、图片上传与 Office 粘贴体验。
          </Paragraph>
        </div>

        <Space wrap>
          <Tag color="processing">Tiptap</Tag>
          <Tag color="success">Ant Design</Tag>
          <Tag color="geekblue">UMI</Tag>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              console.log(html)
              message.success('示例保存成功，可接入接口继续扩展')
            }}
          >
            保存示例
          </Button>
        </Space>
      </Header>

      <Content className="editor-page-content">
        <Card className="editor-card" bordered={false}>
          <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />

          {activeTab === 'editor' && (
            <RichEditor value={html} onChange={setHtml} minHeight={620} />
          )}

          {activeTab === 'preview' && (
            <div className="preview-shell rich-text-content">
              {/* <div dangerouslySetInnerHTML={{ __html: html }} /> */}
              <RichTextPreview html={html} />
            </div>
          )}

          {activeTab === 'html' && (
            <div className="html-source">
              <pre>{html}</pre>
            </div>
          )}
        </Card>

        <Card className="tips-card" bordered={false} title="建议测试项">
          <div className="tips-grid">
            <div className="tip-item">
              <Text strong>Word 粘贴</Text>
              <Text type="secondary">复制标题、列表、表格，检查结构是否保留。</Text>
            </div>
            <div className="tip-item">
              <Text strong>截图粘贴</Text>
              <Text type="secondary">系统截图后直接粘贴，图片会以内嵌 base64 插入。</Text>
            </div>
            <div className="tip-item">
              <Text strong>拖拽上传</Text>
              <Text type="secondary">把本地图片拖进编辑器，确认落点位置是否正确。</Text>
            </div>
            <div className="tip-item">
              <Text strong>移动端排版</Text>
              <Text type="secondary">页面已做基础响应式收缩，适合继续扩展成业务页。</Text>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
