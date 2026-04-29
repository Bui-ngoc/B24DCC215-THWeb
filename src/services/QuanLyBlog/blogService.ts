import { STORAGE_KEY_POSTS, STORAGE_KEY_TAGS } from './constants';

const mockTags: Blog.Tag[] = [
  { id: '1', name: 'React', color: 'blue' },
  { id: '2', name: 'UmiJS', color: 'cyan' },
  { id: '3', name: 'Ant Design', color: 'geekblue' },
  { id: '4', name: 'JavaScript', color: 'gold' },
];

const mockAuthor: Blog.Author = {
  id: 'author1',
  name: 'Nguyễn Văn A',
  avatar: 'https://joeschmoe.io/api/v1/random',
  bio: 'Lập trình viên Front-end với 5 năm kinh nghiệm.',
};

const generateMockPosts = (count: number): Blog.Post[] => {
  const posts: Blog.Post[] = [];
  for (let i = 1; i <= count; i++) {
    posts.push({
      id: `${i}`,
      title: `Bài viết mẫu số ${i} về React và UmiJS`,
      slug: `bai-viet-mau-so-${i}`,
      summary: `Đây là đoạn tóm tắt cho bài viết số ${i}. Nội dung ngắn gọn giúp người đọc hiểu qua nội dung bài viết.`,
      content: `## Nội dung bài viết ${i}\n\nĐây là nội dung chi tiết.`,
      thumbnail: `https://picsum.photos/seed/${i}/400/200`,
      status: 'PUBLISHED',
      tags: i % 2 === 0 ? [mockTags[0], mockTags[1]] : [mockTags[2], mockTags[3]],
      viewCount: Math.floor(Math.random() * 1000),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
      author: mockAuthor,
    });
  }
  return posts;
};

export const initMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY_TAGS)) {
    localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(mockTags));
  }
  if (!localStorage.getItem(STORAGE_KEY_POSTS)) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(generateMockPosts(25)));
  }
};

const getLocalPosts = (): Blog.Post[] => {
  const data = localStorage.getItem(STORAGE_KEY_POSTS);
  return data ? JSON.parse(data) : [];
};

const getLocalTags = (): Blog.Tag[] => {
  const data = localStorage.getItem(STORAGE_KEY_TAGS);
  return data ? JSON.parse(data) : [];
};

export const getPosts = async (params: Blog.PostListParams): Promise<Blog.PostListResponse> => {

  await new Promise((resolve) => setTimeout(resolve, 500));

  let allPosts = getLocalPosts().filter((p) => p.status === 'PUBLISHED');

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    allPosts = allPosts.filter(
      (p) => p.title.toLowerCase().includes(keyword) || p.summary.toLowerCase().includes(keyword)
    );
  }

  if (params.tagId) {
    allPosts = allPosts.filter((p) => p.tags.some((t) => t.id === params.tagId));
  }

  allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const current = params.current || 1;
  const pageSize = params.pageSize || 9;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: allPosts.slice(start, end),
    total: allPosts.length,
    success: true,
  };
};

export const getTags = async (): Promise<{ data: Blog.Tag[]; success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    data: getLocalTags(),
    success: true,
  };
};

export const getPostById = async (id: string): Promise<{ data: Blog.Post | null; success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === id);
  return {
    data: post || null,
    success: true,
  };
};

export const incrementViewCount = async (id: string): Promise<{ success: boolean }> => {
  const posts = getLocalPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index > -1) {
    posts[index].viewCount += 1;
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }
  return { success: true };
};

export const getRelatedPosts = async (currentPostId: string, limit: number = 3): Promise<{ data: Blog.Post[]; success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const posts = getLocalPosts().filter(p => p.status === 'PUBLISHED');
  const currentPost = posts.find(p => p.id === currentPostId);
  
  if (!currentPost) return { data: [], success: true };

  const currentTagIds = currentPost.tags.map(t => t.id);
  
  const related = posts.filter(p => 
    p.id !== currentPostId && 
    p.tags.some(t => currentTagIds.includes(t.id))
  ).slice(0, limit);

  return {
    data: related,
    success: true,
  };
};
