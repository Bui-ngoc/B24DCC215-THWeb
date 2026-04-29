import { Effect, Reducer } from 'umi';
import { getPosts, getTags } from '@/services/QuanLyBlog/blogService';

export interface BlogHomeModelState {
  posts: Blog.Post[];
  tags: Blog.Tag[];
  total: number;
  current: number;
  keyword: string;
  tagId: string;
  loading: boolean;
}

export interface BlogHomeModelType {
  namespace: 'blogHome';
  state: BlogHomeModelState;
  effects: {
    fetchPosts: Effect;
    fetchTags: Effect;
  };
  reducers: {
    savePosts: Reducer<BlogHomeModelState>;
    saveTags: Reducer<BlogHomeModelState>;
    setFilter: Reducer<BlogHomeModelState>;
    setLoading: Reducer<BlogHomeModelState>;
  };
}

const Model: BlogHomeModelType = {
  namespace: 'blogHome',
  state: {
    posts: [],
    tags: [],
    total: 0,
    current: 1,
    keyword: '',
    tagId: '',
    loading: false,
  },
  effects: {
    *fetchPosts({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { current, keyword, tagId } = yield select((state: any) => state.blogHome);
      try {
        const response = yield call(getPosts, { current, pageSize: 9, keyword, tagId, ...payload });
        yield put({
          type: 'savePosts',
          payload: {
            posts: response.data,
            total: response.total,
            current: payload?.current || current,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *fetchTags(_, { call, put }) {
      try {
        const response = yield call(getTags);
        yield put({
          type: 'saveTags',
          payload: response.data,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  reducers: {
    savePosts(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTags(state, { payload }) {
      return {
        ...state,
        tags: payload,
      };
    },
    setFilter(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

export default Model;
