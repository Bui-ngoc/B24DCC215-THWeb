import { Effect, Reducer } from 'umi';
import { getPostById, getRelatedPosts, incrementViewCount } from '@/services/QuanLyBlog/blogService';

export interface BlogDetailModelState {
  post: Blog.Post | null;
  relatedPosts: Blog.Post[];
  loading: boolean;
}

export interface BlogDetailModelType {
  namespace: 'blogDetail';
  state: BlogDetailModelState;
  effects: {
    fetchPost: Effect;
  };
  reducers: {
    savePost: Reducer<BlogDetailModelState>;
    setLoading: Reducer<BlogDetailModelState>;
    clearPost: Reducer<BlogDetailModelState>;
  };
}

const Model: BlogDetailModelType = {
  namespace: 'blogDetail',
  state: {
    post: null,
    relatedPosts: [],
    loading: true,
  },
  effects: {
    *fetchPost({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id } = payload;
        
        // Tăng view count
        yield call(incrementViewCount, id);

        // Fetch bài viết chi tiết
        const response = yield call(getPostById, id);
        
        if (response.data) {
          // Fetch bài viết liên quan
          const relatedResponse = yield call(getRelatedPosts, id);
          
          const postWithIncrementedView = { ...response.data, viewCount: response.data.viewCount + 1 };
          
          yield put({
            type: 'savePost',
            payload: {
              post: postWithIncrementedView,
              relatedPosts: relatedResponse.data,
            },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
  reducers: {
    savePost(state, { payload }) {
      return {
        ...state,
        post: payload.post,
        relatedPosts: payload.relatedPosts,
      };
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    clearPost(state) {
      return {
        ...state,
        post: null,
        relatedPosts: [],
        loading: true,
      };
    },
  },
};

export default Model;
