import React from 'react';
import { Typography } from 'antd';
import '../styles.less';

const { Title, Paragraph } = Typography;

interface MarkdownContentProps {
	content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
	// Simple markdown parser
	const parseMarkdown = (text: string) => {
		const lines = text.split('\n');
		const elements: React.ReactNode[] = [];
		let i = 0;

		while (i < lines.length) {
			const line = lines[i];

			// Headers
			if (line.startsWith('## ')) {
				elements.push(
					<Title key={`h2-${i}`} level={2}>
						{line.replace('## ', '')}
					</Title>,
				);
			} else if (line.startsWith('### ')) {
				elements.push(
					<Title key={`h3-${i}`} level={3}>
						{line.replace('### ', '')}
					</Title>,
				);
			} else if (line.startsWith('# ')) {
				elements.push(
					<Title key={`h1-${i}`} level={1}>
						{line.replace('# ', '')}
					</Title>,
				);
			}
			// Lists
			else if (line.trim().startsWith('- ')) {
				const listItems = [];
				while (i < lines.length && lines[i].trim().startsWith('- ')) {
					listItems.push(<li key={`list-${i}`}>{lines[i].trim().substring(2)}</li>);
					i++;
				}
				elements.push(
					<ul key={`ul-${i}`} style={{ marginLeft: '20px', marginTop: '12px', marginBottom: '12px' }}>
						{listItems}
					</ul>,
				);
				continue;
			}
			// Empty lines (spacing)
			else if (line.trim() === '') {
				// Skip empty lines between elements
			}
			// Regular paragraphs
			else if (line.trim()) {
				elements.push(
					<Paragraph key={`p-${i}`} style={{ marginBottom: '12px' }}>
						{line}
					</Paragraph>,
				);
			}

			i++;
		}

		return elements;
	};

	return <div className='markdown-content'>{parseMarkdown(content)}</div>;
};

export default MarkdownContent;
