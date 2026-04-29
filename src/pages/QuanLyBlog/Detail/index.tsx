import React, { useEffect } from 'react';
import { connect, Dispatch, history } from 'umi';
import { Layout, Button, Tag, Space, Divider, Spin, Empty, Typography } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { BlogDetailModelState } from '@/models/QuanLyBlog/detail';
import MarkdownContent from './components/MarkdownContent';
import RelatedPosts from './components/RelatedPosts';
import AuthorInfo from './components/AuthorInfo';
import './styles.less';

const { Content } = Layout;
const { Text } = Typography;

interface BlogDetailPageProps {
	dispatch: Dispatch;
	blogDetail: BlogDetailModelState;
	loading: boolean;
	match: {
		params: {
			id: string;
		};
	};
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ dispatch, blogDetail, loading, match }) => {
	const { post, relatedPosts } = blogDetail;
	const postId = match.params.id;

	useEffect(() => {
		if (postId) {
			dispatch({
				type: 'blogDetail/fetchPost',
				payload: { id: postId },
			});
		}

		return () => {
			dispatch({ type: 'blogDetail/clearPost' });
		};
	}, [dispatch, postId]);

	const handleBack = () => {
		history.push('/blog');
	};

	const handleRelatedPostClick = (id: string) => {
		dispatch({ type: 'blogDetail/clearPost' });
		history.push(`/blog/${id}`);
	};

	const handleTagClick = (tagId: string) => {
		history.push(`/blog?tag=${tagId}`);
	};

	if (loading) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Content style={{ padding: '24px 50px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
					<Spin size='large' tip='Đang tải...' />
				</Content>
			</Layout>
		);
	}

	if (!post) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Content style={{ padding: '24px 50px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
					<Button type='text' icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 24 }}>
						Quay lại
					</Button>
					<Empty description='Bài viết không tồn tại' style={{ marginTop: 64 }} />
				</Content>
			</Layout>
		);
	}

	return (
		<Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
			<Content style={{ padding: '24px 50px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
				<Button type='text' icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 24 }}>
					Quay lại Blog
				</Button>

				<div className='blog-detail-container'>
					{/* Header Section */}
					<div className='detail-header'>
						<h1 className='detail-title'>{post.title}</h1>

						<div className='detail-meta'>
							<Space split={<Divider type='vertical' />} size='large'>
								<Space>
									<CalendarOutlined />
									<Text>{moment(post.createdAt).format('DD/MM/YYYY')}</Text>
								</Space>
								<Space>
									<EyeOutlined />
									<Text>{post.viewCount} lượt xem</Text>
								</Space>
							</Space>
						</div>

						{/* Thumbnail */}
						{post.thumbnail && (
							<div className='detail-thumbnail'>
								<img src={post.thumbnail} alt={post.title} />
							</div>
						)}

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className='detail-tags'>
								<Space wrap>
									{post.tags.map((tag) => (
										<Tag
											key={tag.id}
											color={tag.color || 'blue'}
											style={{ cursor: 'pointer' }}
											onClick={() => handleTagClick(tag.id)}
										>
											{tag.name}
										</Tag>
									))}
								</Space>
							</div>
						)}
					</div>

					<Divider style={{ margin: '32px 0' }} />

					{/* Main Content */}
					<div className='detail-content'>
						<MarkdownContent content={post.content} />
					</div>

					{/* Author Info */}
					<AuthorInfo author={post.author} />

					{/* Related Posts */}
					{relatedPosts && relatedPosts.length > 0 && (
						<RelatedPosts posts={relatedPosts} onPostClick={handleRelatedPostClick} onTagClick={handleTagClick} />
					)}
				</div>
			</Content>
		</Layout>
	);
};

export default connect(({ blogDetail, loading }: { blogDetail: BlogDetailModelState; loading: any }) => ({
	blogDetail,
	loading: loading.effects['blogDetail/fetchPost'],
}))(BlogDetailPage);
