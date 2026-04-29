import React from 'react';
import { Card, Avatar, Typography, Space, Divider, Button } from 'antd';
import { LinkedinOutlined, GithubOutlined, FacebookOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface AuthorInfoProps {
	author: Blog.Author;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => {
	const handleSocialClick = (url?: string) => {
		if (url) {
			window.open(url, '_blank');
		}
	};

	return (
		<Card style={{ marginTop: 32 }}>
			<div style={{ textAlign: 'center' }}>
				<Avatar src={author.avatar} size={80} style={{ marginBottom: 16 }} />
				<Title level={3} style={{ marginBottom: 8 }}>
					{author.name}
				</Title>
				{author.bio && (
					<Paragraph type='secondary' style={{ marginBottom: 16 }}>
						{author.bio}
					</Paragraph>
				)}

				{author.skills && author.skills.length > 0 && (
					<>
						<Divider />
						<Text strong>Kỹ năng:</Text>
						<div style={{ marginTop: 8 }}>
							{author.skills.map((skill, index) => (
								<span
									key={index}
									style={{
										display: 'inline-block',
										backgroundColor: '#f0f0f0',
										padding: '4px 12px',
										borderRadius: '16px',
										marginRight: 8,
										marginBottom: 8,
										fontSize: 13,
									}}
								>
									{skill}
								</span>
							))}
						</div>
					</>
				)}

				{author.socialLinks && (
					<>
						<Divider />
						<Space size='large'>
							{author.socialLinks.facebook && (
								<Button
									type='text'
									icon={<FacebookOutlined style={{ fontSize: 20, color: '#1877F2' }} />}
									onClick={() => handleSocialClick(author.socialLinks?.facebook)}
								/>
							)}
							{author.socialLinks.github && (
								<Button
									type='text'
									icon={<GithubOutlined style={{ fontSize: 20 }} />}
									onClick={() => handleSocialClick(author.socialLinks?.github)}
								/>
							)}
							{author.socialLinks.linkedin && (
								<Button
									type='text'
									icon={<LinkedinOutlined style={{ fontSize: 20, color: '#0A66C2' }} />}
									onClick={() => handleSocialClick(author.socialLinks?.linkedin)}
								/>
							)}
						</Space>
					</>
				)}
			</div>
		</Card>
	);
};

export default AuthorInfo;
