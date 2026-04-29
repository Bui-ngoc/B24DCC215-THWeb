import React from 'react';
import { Card, Avatar, Typography, Tag, Space, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

interface PostCardProps {
  post: Blog.Post;
  onClick?: (id: string) => void;
  onTagClick?: (tagId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onTagClick }) => {
  return (
    <Card
      hoverable
      cover={
        <div style={{ height: 200, overflow: 'hidden' }}>
          <img
            alt={post.title}
            src={post.thumbnail}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      }
      onClick={() => onClick && onClick(post.id)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Title level={4} style={{ marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.title}
      </Title>
      
      <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ flex: 1 }}>
        {post.summary}
      </Paragraph>

      <div style={{ marginTop: 'auto' }}>
        <Space size={[0, 8]} wrap style={{ marginBottom: 16 }} onClick={(e) => e.stopPropagation()}>
          {post.tags.map(tag => (
            <Tag 
              key={tag.id} 
              color={tag.color || 'blue'} 
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick && onTagClick(tag.id);
              }}
            >
              {tag.name}
            </Tag>
          ))}
        </Space>

        <Divider style={{ margin: '12px 0' }} />

        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Avatar src={post.author.avatar} icon={<UserOutlined />} size="small" />
            <Text type="secondary" style={{ fontSize: 13 }}>{post.author.name}</Text>
          </Space>
          <Space style={{ fontSize: 13, color: '#8c8c8c' }}>
            <span><CalendarOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}</span>
            <span><EyeOutlined /> {post.viewCount}</span>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default PostCard;
