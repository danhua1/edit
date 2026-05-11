import Image from '@tiptap/extension-image';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ReactNodeViewRenderer, NodeViewWrapper, } from '@tiptap/react';
import { Image as AntdImage } from 'antd';


const ImageComponent = (props) => {
  const { node } = props;
  return (
    <NodeViewWrapper contentEditable={false} className="custom-image-node">
      <div style={{ margin: '12px 0' }}>
        <AntdImage
          src={node.attrs.src} alt=""
          style={{ maxWidth: '100%', borderRadius: 8, width: node.attrs.width || 'auto', }}
        />
      </div>
    </NodeViewWrapper>);
}

/**
 * 扩展 Image，支持：
 * 1. 拖拽上传图片
 * 2. 粘贴图片（截图/从 Word 粘贴）
 * 3. 图片可调整大小（通过 width 属性）
 */
export const CustomImage = Image.extend({
  addNodeView() { return ReactNodeViewRenderer(ImageComponent); },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width, style: `width: ${attributes.width}px; max-width: 100%;` };
        },
      },
      align: {
        default: 'left',
        renderHTML: (attributes) => {
          return {
            style: `display: block; ${attributes.align === 'center'
              ? 'margin: 0 auto;'
              : attributes.align === 'right'
                ? 'margin-left: auto;'
                : 'margin-right: auto;'
              }`,
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          // 处理拖拽上传
          handleDrop(view, event) {
            const files = Array.from(event.dataTransfer?.files || []).filter((f) =>
              f.type.startsWith('image/'),
            );
            if (!files.length) return false;

            event.preventDefault();

            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            files.forEach((file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result;
                if (!src || !coordinates) return;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(file);
            });

            return true;
          },

          // 处理粘贴（截图/Word 图片）
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items || []);
            const imageItems = items.filter((item) => item.type.startsWith('image/'));

            if (!imageItems.length) return false;

            event.preventDefault();
            const { schema } = view.state;

            imageItems.forEach((item) => {
              const file = item.getAsFile();
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result;
                if (!src) return;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(file);
            });

            return true;
          },
        },
      }),
    ];
  },
});
