# Rich Editor Demo — 项目总结与操作手册

> 基于 **React 18 + UMI 4 + Tiptap 2 + Ant Design 5** 的富文本编辑器示例工程。重点验证 **图片处理（拖拽 / 粘贴 / 按钮上传）**、**Word/WPS 富文本粘贴兼容** 与 **基础排版能力**。

---

## 一、项目总结

### 1.1 定位

一个可独立运行的轻量富文本编辑器 Demo，用于：

- 验证 Tiptap 在中文文档编辑场景下的可用性。
- 展示从 Word / WPS / 微信截图 复制粘贴的兼容方案。
- 作为后续接入业务（OSS 真实上传、协同编辑、自动保存等）的脚手架。

### 1.2 技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | React 18.3 | UI 层 |
| 工程化 | UMI 4.2 | 路由 + 构建（webpack） |
| 编辑器引擎 | Tiptap 2.4 | 基于 ProseMirror 封装 |
| UI 组件库 | Ant Design 5.17 | Button / Tabs / ColorPicker / Image 等 |
| HTML 解析 | html-react-parser 6.1 | 预览态把 `<img>` 替换成 antd `<Image>` |
| 类型 | TypeScript 5.4 | 全量 TS |

### 1.3 目录结构

```
files/
├── .umirc.ts                       # UMI 配置（路由、base、publicPath）
├── package.json                    # 依赖与脚本
├── tsconfig.json
├── README.md                       # 简版说明
├── PROJECT_GUIDE.md                # 本文件
└── src/
    ├── components/
    │   ├── RichEditor/
    │   │   ├── index.tsx           # 编辑器主组件（含自定义 FontSize 扩展）
    │   │   ├── Toolbar.tsx         # 顶部工具栏
    │   │   ├── CustomImage.tsx     # 自定义 Image 扩展 + Word HTML 清洗
    │   │   ├── ImageComponent.tsx  # 图片 NodeView（可拖拽缩放）
    │   │   └── editor.css          # 编辑器样式
    │   └── pre/
    │       └── RichTextPreview.tsx # 预览组件（antd Image 预览组）
    └── pages/
        └── editor/
            ├── index.tsx           # 页面入口（编辑/预览/HTML 三 Tab）
            ├── index.css
            └── rich.css
```

### 1.4 路由与产物

来自 `.umirc.ts`：

- 路由：`/` → `editor/index`
- 站点基础路径：`base: '/util/fullEdit'`
- 构建输出：`dist/util/fullEdit/`
- 资源前缀：`publicPath: '/util/fullEdit/'`

> **部署提示**：当前配置假设站点挂在 `/util/fullEdit` 子路径下；若要根路径访问，需同步调整三处。

### 1.5 核心能力清单

#### 图片
- 按钮上传（工具栏 Picture 图标 → 选择本地文件）
- 拖拽上传（任意位置拖入；插入位置由鼠标坐标决定，见 `CustomImage.tsx:99`）
- 截图 / 剪贴板粘贴（系统截图、微信截图等）
- 图片转 **base64** 内嵌（演示用，生产需替换为 OSS 上传）
- 图片可视化拖拽缩放（蓝色圆点在右下角）
- 预览态接入 antd `Image.PreviewGroup`，支持点击大图与组内切换

#### 文本排版
- 标题：H1 ~ H4，带视觉区分（H1 下划线、H2 左侧蓝条）
- 字体：5 种预设（衬线 / 无衬线 / 宋体 / 微软雅黑 / 等宽）
- 字号：12 / 14 / 15 / 16 / 18 / 20 / 24 / 28 px（自定义扩展实现，见 `index.tsx:33`）
- 行内样式：粗体、斜体、下划线、行内代码
- 颜色：字体颜色 + 多色高亮背景
- 对齐：左 / 中 / 右
- 列表：有序、无序、任务列表（已注册）
- 块级：引用、代码块、分隔线
- 表格：3×3 默认插入，支持拖拽调整列宽
- 链接：插入 / 编辑 / 清空（弹窗输入 URL）
- 撤销 / 重做

#### Word / WPS 粘贴兼容
关键在 `CustomImage.tsx:18` 的 `normalizeWordHtml`，粘贴前清洗：

- 去除 `<!-- -->` 注释
- 去除 `<o:p>` `<w:*>` 等 Office 私有命名空间标签
- 剥离 `class="Mso*"` 与含 `mso-` 的 style 片段
- 该函数挂在 `editorProps.transformPastedHTML`（`index.tsx:121`）

### 1.6 关键实现要点

- **自定义 FontSize 扩展**（`index.tsx:33-72`）：基于 `TextStyle` 的 mark 加 `fontSize` 全局属性，提供 `setFontSize` / `unsetFontSize` 命令。
- **CustomImage 扩展属性**（`CustomImage.tsx:30-80`）：
  - `width`：支持数字 / 字符串，渲染为内联 style + width 属性。
  - `align`：根据 `marginLeft / marginRight` 自动反解 left / center / right。
- **ProseMirror Plugin 处理 drop/paste**（`CustomImage.tsx:83-159`）：用 `FileReader` 转 base64，再用 `view.state.schema.nodes.image.create` 插入；drop 位置通过 `view.posAtCoords` 精确定位。
- **NodeView 拖拽缩放**（`ImageComponent.tsx`）：监听 `mousedown` 起始位置，`mousemove` 更新 `width` 属性，`mouseup` 解绑监听。
- **预览态图片增强**（`RichTextPreview.tsx`）：用 `html-react-parser` 的 `replace` 钩子把 `<img>` 换成 antd `Image`，外层 `Image.PreviewGroup` 提供组内浏览。

---

## 二、操作手册

### 2.1 环境准备

| 工具 | 建议版本 |
|------|----------|
| Node.js | ≥ 16（推荐 18 LTS） |
| npm | ≥ 8 |

> 仓库已包含 `node_modules` 与 `yarn.lock`。可任选 `npm` / `yarn`；`.umirc.ts` 中 `npmClient` 设为 `npm`。

### 2.2 启动开发

```bash
# 安装依赖（如未安装）
npm install

# 启动开发服务器
npm run dev
```

启动后访问：

```
http://localhost:8000/util/fullEdit
```

> 注意 base 路径。直接访问 `http://localhost:8000/` 会 404。

### 2.3 生产构建

```bash
npm run build
```

产物位于 `dist/util/fullEdit/`，可直接放到静态服务器（Nginx / OSS / CDN）下对应的子路径。

### 2.4 页面交互说明

页面顶部三个 Tab：

1. **编辑**：富文本编辑区，工具栏 + 内容区 + 底部字符计数。
2. **预览**：以 antd `Image` 渲染图片的只读视图，支持点击放大。
3. **HTML**：直接展示编辑器输出的 HTML 源码（调试 / 接口对接用）。

右上角 **保存示例** 按钮当前仅 `console.log(html)` 并弹 message，**未接后端**，需自行接入。

### 2.5 工具栏功能位置（左 → 右）

1. 撤销 / 重做
2. 段落类型（正文 / H1~H4）
3. 字体下拉
4. 字号下拉
5. 粗体 / 斜体 / 下划线 / 行内代码
6. 字体颜色 / 高亮背景色
7. 无序 / 有序列表
8. 左 / 中 / 右对齐
9. 图片上传 / 插入链接 / 插入表格 / 分隔线

### 2.6 常见编辑操作

| 目标 | 操作 |
|------|------|
| 插入图片 | 点工具栏图片按钮 / 直接拖入文件 / Ctrl+V 粘贴截图 |
| 调整图片大小 | 单击图片，拖动右下角蓝色圆点 |
| 从 Word 复制 | 在 Word 选中后 Ctrl+C，编辑区 Ctrl+V，自动清洗样式 |
| 插入链接 | 选中文字 → 工具栏链接按钮 → 输入 URL；URL 留空清除链接 |
| 插入表格 | 工具栏表格按钮（默认 3 行 3 列含表头） |
| 调整列宽 | 鼠标悬停列边线，出现蓝色把手拖拽 |
| 切换标题 | 段落下拉选择 H1/H2/H3/H4 |
| 高亮文本 | 选中文字 → 高亮按钮选色 |

### 2.7 二次开发指引

#### A. 接入真实图片上传（替换 base64）

修改两处即可把内嵌 base64 换成上传后回填的 URL：

1. `src/components/RichEditor/Toolbar.tsx:75` `onImageUpload`：把 `fileToDataUrl(file)` 换成调用上传接口返回 URL。
2. `src/components/RichEditor/CustomImage.tsx:88` `handleDrop` / `handlePaste`：把 `readFileAsDataUrl` 替换为上传函数。

```ts
// 示例
const onImageUpload = async (file: File) => {
  const { url } = await uploadToOSS(file);
  editor.chain().focus().setImage({ src: url }).run();
  return false;
};
```

#### B. 接入保存

在 `src/pages/editor/index.tsx` 的 "保存示例" 按钮 onClick 中调用接口：

```ts
onClick={async () => {
  await api.saveDoc({ html });
  message.success('保存成功');
}}
```

或在 `RichEditor` 的 `onUpdate` 中加防抖自动保存。

#### C. 修改部署路径

修改 `.umirc.ts` 中 `base` / `outputPath` / `publicPath` 三处保持一致。

#### D. 新增扩展

在 `src/components/RichEditor/index.tsx` 的 `extensions` 数组里追加 Tiptap 扩展即可；如需自定义命令，可参考文件顶部的 `FontSize` 实现。

#### E. 修改 Word 粘贴清洗规则

在 `src/components/RichEditor/CustomImage.tsx:18` 的 `normalizeWordHtml` 中追加 / 修改正则。建议小步验证，避免误删合法标签。

### 2.8 已知限制 / 注意事项

- 图片以 base64 形式存于 HTML，文档体积会膨胀；生产环境务必接 OSS。
- 当前未接持久化，刷新页面内容丢失（仅保留 `INITIAL_CONTENT` 示例）。
- `editorProps.transformPastedHTML` 只清洗 Word 私有标签，复杂样式（如分页符、嵌套表格背景）可能仍需补规则。
- 项目内 `CustomImage.jsx` / `Toolbar.tsx` / `index.tsx` 等根目录文件为早期散落版本，**实际生效的是 `src/` 下的对应文件**；如需精简可考虑删除根目录散件。
- `mnt/user-data/outputs/...` 路径出现在 git status 中（已删除状态），属环境产物，不影响构建。

### 2.9 故障排查

| 现象 | 排查方向 |
|------|----------|
| 启动后页面 404 | 确认 URL 是否带 `/util/fullEdit` 前缀 |
| 粘贴 Word 后样式杂乱 | 检查 `normalizeWordHtml` 是否覆盖到该 mso 类样式 |
| 图片粘贴无反应 | 确认剪贴板 item.type 以 `image/` 开头（部分浏览器拷贝网络图为 text/html） |
| 字号 / 字体下拉无效 | 选区是否在 `textStyle` 支持的节点上（heading / paragraph） |
| 构建产物访问 404 | 静态服务器是否把 `dist/util/fullEdit/` 挂到 `/util/fullEdit` 路径 |

---

## 三、后续可演进方向

1. **真实上传**：接 OSS / S3，返回 CDN URL，去除 base64。
2. **协同编辑**：集成 `@tiptap/extension-collaboration` + Y.js + WebSocket。
3. **自动保存**：`onUpdate` 加 lodash debounce，500ms 落库。
4. **历史版本**：服务端按时间存快照，提供版本回滚。
5. **更多扩展**：行高、首行缩进、目录大纲、Mention、Emoji、数学公式。
6. **导出能力**：HTML → DOCX（如 `html-docx-js`）/ PDF（如 `html2pdf.js`）。
7. **权限与水印**：只读模式（`editor.setEditable(false)`）+ 内容水印层。
