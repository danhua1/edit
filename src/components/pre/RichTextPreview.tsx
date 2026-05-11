
import parse, { domToReact } from 'html-react-parser';
import { Image } from 'antd';

interface Props {
    html?: string;
}

export default function RichTextPreview(props: Props) {
    const { html = '' } = props;

    return (
        <Image.PreviewGroup>
            <div className="rich-text-preview">
                {parse(html, {
                    replace(domNode: any) {
                        // 替换 img 标签
                        if (domNode.name === 'img') {
                            const { src, alt, style } = domNode.attribs || {};

                            return (
                                <Image
                                    src={src}
                                    alt={alt}
                                    style={{
                                        maxWidth: '100%',
                                        borderRadius: 8,
                                        margin: '12px 0',
                                    }}
                                />
                            );
                        }
                    },
                })}
            </div>
        </Image.PreviewGroup>
    );
}
