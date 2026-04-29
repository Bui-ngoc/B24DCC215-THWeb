import React, { useEffect } from 'react';
import { connect, Dispatch, history } from 'umi';
import { Row, Col, Pagination, Typography, Layout, Spin, Empty } from 'antd';
import { BlogHomeModelState } from '@/models/QuanLyBlog/home';
import PostCard from './components/PostCard';
import FilterBar from './components/FilterBar';
import { initMockData } from '@/services/QuanLyBlog/blogService';
import { PAGE_SIZE } from '@/services/QuanLyBlog/constants';

const { Title } = Typography;
const { Content } = Layout;

interface BlogHomeProps {
  dispatch: Dispatch;
  blogHome: BlogHomeModelState;
  loading: boolean;
}

const BlogHome: React.FC<BlogHomeProps> = ({ dispatch, blogHome, loading }) => {
  const { posts, tags, total, current, tagId, keyword } = blogHome;

  useEffect(() => {
    initMockData();
    
    // Fetch dữ liệu lần đầu
    dispatch({ type: 'blogHome/fetchTags' });
    dispatch({ type: 'blogHome/fetchPosts' });
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch({
      type: 'blogHome/fetchPosts',
      payload: { current: page },
    });
  };

  const handleSearch = (newKeyword: string) => {
    dispatch({
      type: 'blogHome/setFilter',
      payload: { keyword: newKeyword },
    });
    dispatch({
      type: 'blogHome/fetchPosts',
      payload: { current: 1 },
    });
  };

  const handleTagChange = (newTagId: string) => {
    dispatch({
      type: 'blogHome/setFilter',
      payload: { tagId: newTagId },
    });
    dispatch({
      type: 'blogHome/fetchPosts',
      payload: { current: 1 },
    });
  };

  const handlePostClick = (id: string) => {
    history.push(`/blog/${id}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px 50px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Blog Cá Nhân
        </Title>
        
        <FilterBar 
          tags={tags} 
          activeTagId={tagId} 
          onSearch={handleSearch} 
          onTagChange={handleTagChange} 
        />

        <Spin spinning={loading}>
          {posts.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {posts.map(post => (
                  <Col xs={24} sm={12} md={8} key={post.id}>
                    <PostCard 
                      post={post} 
                      onClick={handlePostClick} 
                      onTagClick={handleTagChange}
                    />
                  </Col>
                ))}
              </Row>
              
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Pagination
                  current={current}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="Không tìm thấy bài viết nào" style={{ marginTop: 64 }} />
          )}
        </Spin>
      </Content>
    </Layout>
  );
};

export default connect(({ blogHome, loading }: { blogHome: BlogHomeModelState; loading: any }) => ({
  blogHome,
  loading: loading.effects['blogHome/fetchPosts'],
}))(BlogHome);
