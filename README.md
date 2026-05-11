# Rich Editor Demo

基于 **React + Tiptap + Ant Design + UMI** 的富文本编辑器 Demo。

## 功能特性

### 图片支持
- ✅ **拖拽上传**：将图片直接拖入编辑区
- ✅ **粘贴上传**：截图或从剪贴板直接 Ctrl+V 粘贴图片
- ✅ **按钮上传**：工具栏点击图片按钮选择本地文件
- ✅ **Word 图片**：从 Word 复制含图片内容，直接粘贴不丢失

### 文档排版
- ✅ H1~H4 多级标题（带视觉区分样式）
- ✅ 粗体 / 斜体 / 下划线 / 删除线 / 行内代码
- ✅ 字体颜色 + 高亮背景色（多色）
- ✅ 左对齐 / 居中 / 右对齐
- ✅ 有序列表 / 无序列表
- ✅ 表格（支持拖拽调整列宽）
- ✅ 引用块、分割线、代码块
- ✅ 超链接插入

### Word 兼容
- ✅ 从 Word / WPS 直接复制粘贴，自动保留标题、粗体、斜体、列表、表格等样式

---

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:8000](http://localhost:8000)

## 项目结构

```
src/
├── components/
│   └── RichEditor/
│       ├── index.tsx        # 编辑器主组件
│       ├── Toolbar.tsx      # 工具栏
│       ├── CustomImage.ts   # 自定义图片扩展（拖拽/粘贴）
│       └── editor.css       # 编辑器样式
└── pages/
    └── editor/
        ├── index.tsx        # 页面入口
        └── index.css        # 页面样式
```

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| UMI | 4.x | 路由 & 构建 |
| Tiptap | 2.x | 富文本核心引擎 |
| Ant Design | 5.x | UI 组件库 |

## 扩展建议

1. **真实图片上传**：修改 `CustomImage.ts` 中的 `handleDrop` 和 `handlePaste`，将 base64 替换为调用后端 OSS 接口返回 URL
2. **协同编辑**：集成 Tiptap Collaboration + Y.js
3. **自动保存**：在 `onUpdate` 回调中加入防抖 + 后端保存逻辑
4. **更多扩展**：字体大小、行高、分页、页眉页脚等
