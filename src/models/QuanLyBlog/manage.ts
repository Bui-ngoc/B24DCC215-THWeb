import { Effect, Reducer } from 'umi';
import {
  createPost,
  deletePost,
  getAdminPosts,
  getAdminTags,
  updatePost,
} from '@/services/QuanLyBlog/blogService';

export interface BlogManageState {
  posts: Blog.Post[];
  tags: Blog.Tag[];
  total: number;
  current: number;
  pageSize: number;
  keyword: string;
  status?: 'DRAFT' | 'PUBLISHED';
  loading: boolean;
}

export interface BlogManageModelType {
  namespace: 'blogManage';
  state: BlogManageState;
  effects: {
    fetchPosts: Effect;
    fetchTags: Effect;
    createPost: Effect;
    updatePost: Effect;
    deletePost: Effect;
  };
  reducers: {
    savePosts: Reducer<BlogManageState>;
    saveTags: Reducer<BlogManageState>;
    setFilter: Reducer<BlogManageState>;
    setLoading: Reducer<BlogManageState>;
  };
}

const Model: BlogManageModelType = {
  namespace: 'blogManage',
  state: {
    posts: [],
    tags: [],
    total: 0,
    current: 1,
    pageSize: 10,
    keyword: '',
    status: undefined,
    loading: false,
  },
  effects: {
    *fetchPosts({ payload }, { call, put, select }): Generator<any, void, any> {
      yield put({ type: 'setLoading', payload: true });
      const { current, keyword, status, pageSize } = yield select((state: any) => state.blogManage);
      try {
        const response = yield call(getAdminPosts, {
          current,
          pageSize,
          keyword,
          status,
          ...payload,
        });
        yield put({
          type: 'savePosts',
          payload: {
            posts: response.data,
            total: response.total,
            current: payload?.current || current,
          },
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *fetchTags(_, { call, put }): Generator<any, void, any> {
      const response = yield call(getAdminTags);
      yield put({
        type: 'saveTags',
        payload: response.data,
      });
    },
    *createPost({ payload }, { call, put }): Generator<any, void, any> {
      yield call(createPost, payload);
      yield put({ type: 'fetchPosts', payload: { current: 1 } });
      yield put({ type: 'fetchTags' });
    },
    *updatePost({ payload }, { call, put, select }): Generator<any, void, any> {
      const { current } = yield select((state: any) => state.blogManage);
      yield call(updatePost, payload.id, payload.data);
      yield put({ type: 'fetchPosts', payload: { current } });
      yield put({ type: 'fetchTags' });
    },
    *deletePost({ payload }, { call, put, select }): Generator<any, void, any> {
      const { current } = yield select((state: any) => state.blogManage);
      yield call(deletePost, payload.id);
      yield put({ type: 'fetchPosts', payload: { current } });
      yield put({ type: 'fetchTags' });
    },
  },
  reducers: {
    savePosts(state = Model.state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTags(state = Model.state, { payload }) {
      return {
        ...state,
        tags: payload,
      };
    },
    setFilter(state = Model.state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setLoading(state = Model.state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

export default Model;
