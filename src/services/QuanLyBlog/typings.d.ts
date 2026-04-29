declare namespace Blog {
  interface Tag {
    id: string;
    name: string;
    color?: string;
    usageCount?: number;
  }

  interface Author {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    skills?: string[];
    socialLinks?: {
      facebook?: string;
      github?: string;
      linkedin?: string;
    };
  }

  interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    thumbnail: string;
    status: 'DRAFT' | 'PUBLISHED';
    tags: Tag[];
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    author: Author;
  }

  interface PostListParams {
    current?: number;
    pageSize?: number;
    keyword?: string;
    tagId?: string;
    status?: 'DRAFT' | 'PUBLISHED';
  }

  interface PostListResponse {
    data: Post[];
    total: number;
    success: boolean;
  }
}
