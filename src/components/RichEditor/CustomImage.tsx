import Image from '@tiptap/extension-image';
import { Plugin, PluginKey } from '@tiptap/pm/state';

import { ReactNodeViewRenderer, NodeViewWrapper, } from '@tiptap/react';
import { Image as AntdImage } from 'antd';
import ImageComponent from './ImageComponent';



const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const normalizeWordHtml = (html: string) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?o:[^>]*>/g, '')
    .replace(/<\/?w:[^>]*>/g, '')
    .replace(/\sclass=(")?Mso[a-zA-Z0-9\s-]*(")?/g, '')
    .replace(/\sstyle="[^"]*mso-[^"]*"/g, '')
    .replace(/<o:p>\s*<\/o:p>/g, '')
    .replace(/<o:p>[\s\S]*?<\/o:p>/g, '&nbsp;');

export const CustomImage = Image.extend({
  addNodeView() { return ReactNodeViewRenderer(ImageComponent); },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width') || element.style.width || null,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }

          const widthValue =
            typeof attributes.width === 'number' ? `${attributes.width}px` : attributes.width;

          return {
            width: widthValue,
            style: `width: ${widthValue}; max-width: 100%; height: auto;`,
          };
        },
      },
      align: {
        default: null,
        parseHTML: (element) => {
          const display = element.style.display;
          if (display !== 'block') {
            return null;
          }

          const marginLeft = element.style.marginLeft;
          const marginRight = element.style.marginRight;

          if (marginLeft === 'auto' && marginRight === 'auto') {
            return 'center';
          }

          if (marginLeft === 'auto') {
            return 'right';
          }

          return 'left';
        },
        renderHTML: (attributes) => {
          if (!attributes.align) {
            return {};
          }

          if (attributes.align === 'center') {
            return { style: 'display: block; margin: 12px auto;' };
          }

          if (attributes.align === 'right') {
            return { style: 'display: block; margin: 12px 0 12px auto;' };
          }

          return { style: 'display: block; margin: 12px auto 12px 0;' };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handleDrop: (view, event) => {
            const files = Array.from(event.dataTransfer?.files || []).filter((file) =>
              file.type.startsWith('image/'),
            );

            if (!files.length) {
              return false;
            }

            event.preventDefault();

            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const insertPos = coordinates?.pos ?? view.state.selection.from;

            void Promise.all(files.map(readFileAsDataUrl)).then((images) => {
              const nodes = images
                .filter(Boolean)
                .map((src) => view.state.schema.nodes.image.create({ src }));

              if (!nodes.length) {
                return;
              }

              const transaction = view.state.tr.insert(insertPos, nodes[0]);
              nodes.slice(1).forEach((node, index) => {
                transaction.insert(insertPos + index + 1, node);
              });
              view.dispatch(transaction);
            });

            return true;
          },

          handlePaste: (view, event) => {
            const items = Array.from(event.clipboardData?.items || []);
            const imageItems = items.filter((item) => item.type.startsWith('image/'));

            if (!imageItems.length) {
              return false;
            }

            event.preventDefault();

            const files = imageItems
              .map((item) => item.getAsFile())
              .filter((file): file is File => Boolean(file));

            void Promise.all(files.map(readFileAsDataUrl)).then((images) => {
              const nodes = images
                .filter(Boolean)
                .map((src) => view.state.schema.nodes.image.create({ src }));

              if (!nodes.length) {
                return;
              }

              const transaction = view.state.tr.replaceSelectionWith(nodes[0]);
              nodes.slice(1).forEach((node) => {
                transaction.insert(transaction.selection.to, node);
              });
              view.dispatch(transaction);
            });

            return true;
          },
        },
      }),
    ];
  },
});
