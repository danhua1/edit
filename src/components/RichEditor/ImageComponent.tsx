
import { useRef, useState } from 'react';
import {
    NodeViewWrapper,
} from '@tiptap/react';

import { Image as AntdImage } from 'antd';

const ImageComponent = (props: any) => {
    const { node, updateAttributes } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const [resizing, setResizing] = useState(false);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        setResizing(true);

        const startX = e.clientX;

        const startWidth =
            containerRef.current?.offsetWidth || 300;

        const onMouseMove = (event: MouseEvent) => {
            const newWidth =
                startWidth + (event.clientX - startX);

            updateAttributes({
                width: `${newWidth}px`,
            });
        };

        const onMouseUp = () => {
            setResizing(false);

            document.removeEventListener(
                'mousemove',
                onMouseMove,
            );

            document.removeEventListener(
                'mouseup',
                onMouseUp,
            );
        };

        document.addEventListener(
            'mousemove',
            onMouseMove,
        );

        document.addEventListener(
            'mouseup',
            onMouseUp,
        );
    };

    return (
        <NodeViewWrapper
            className="custom-image-node"
            contentEditable={false}
        >
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: node.attrs.width || '300px',
                    display: 'inline-block',
                }}
            >
                <AntdImage
                    src={node.attrs.src}
                    preview
                    style={{
                        width: '100%',
                        borderRadius: 8,
                    }}
                />

                {/* resize handle */}
                <div
                    onMouseDown={startResize}
                    style={{
                        width: 12,
                        height: 12,
                        background: '#1677ff',
                        position: 'absolute',
                        right: -6,
                        bottom: -6,
                        cursor: 'nwse-resize',
                        borderRadius: '50%',
                    }}
                />
            </div>
        </NodeViewWrapper>
    );
};

export default ImageComponent;

