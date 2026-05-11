
import parse, { domToReact } from 'html-react-parser';
import { Image } from 'antd';
import type { CSSProperties } from 'react';

interface Props {
    html?: string;
}

const parseStyleString = (style?: string): CSSProperties => {
    if (!style) return {};
    return style.split(';').reduce<CSSProperties>((acc, decl) => {
        const [rawKey, ...rest] = decl.split(':');
        const key = rawKey?.trim();
        const value = rest.join(':').trim();
        if (!key || !value) return acc;
        const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (acc as any)[camel] = value;
        return acc;
    }, {});
};

const parseSize = (raw?: string): string | number | undefined => {
    if (!raw) return undefined;
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
};

export default function RichTextPreview(props: Props) {
    const { html = '' } = props;

    return (
        <Image.PreviewGroup>
            <div className="rich-text-preview">
                {parse(html, {
                    replace(domNode: any) {
                        if (domNode.name === 'img') {
                            const { src, alt, width, height, style } = domNode.attribs || {};
                            const styleObj = parseStyleString(style);
                            const widthFromStyle = styleObj.width as string | undefined;
                            const finalWidth = parseSize(widthFromStyle) ?? parseSize(width);
                            const finalHeight = parseSize(styleObj.height as string | undefined) ?? parseSize(height);

                            const wrapperStyle: CSSProperties = {
                                display: styleObj.display || 'inline-block',
                                margin: styleObj.margin ?? '4px 6px 4px 0',
                                marginLeft: styleObj.marginLeft,
                                marginRight: styleObj.marginRight,
                                verticalAlign: 'top',
                                maxWidth: '100%',
                            };

                            return (
                                <span style={wrapperStyle}>
                                    <Image
                                        src={src}
                                        alt={alt}
                                        width={finalWidth as any}
                                        height={finalHeight as any}
                                        style={{
                                            maxWidth: '100%',
                                            borderRadius: 8,
                                            display: 'block',
                                        }}
                                    />
                                </span>
                            );
                        }
                    },
                })}
            </div>
        </Image.PreviewGroup>
    );
}
