import React from 'react';
import { Row, Col, Empty, Typography } from 'antd';
import PostCard from '../../Home/components/PostCard';

const { Title } = Typography;

interface RelatedPostsProps {
	posts: Blog.Post[];
	onPostClick?: (id: string) => void;
	onTagClick?: (tagId: string) => void;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, onPostClick, onTagClick }) => {
	if (posts.length === 0) {
		return null;
	}

	return (
		<div style={{ marginTop: 48 }}>
			<Title level={3}>Bài viết liên quan</Title>
			{posts.length > 0 ? (
				<Row gutter={[24, 24]}>
					{posts.map((post) => (
						<Col xs={24} sm={12} md={8} key={post.id}>
							<PostCard post={post} onClick={onPostClick} onTagClick={onTagClick} />
						</Col>
					))}
				</Row>
			) : (
				<Empty description='Không có bài viết liên quan' style={{ marginTop: 24 }} />
			)}
		</div>
	);
};

export default RelatedPosts;
