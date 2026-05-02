import { Effect, Reducer } from 'umi';
import { createTag, deleteTag, getAdminTags, updateTag } from '@/services/QuanLyBlog/blogService';

export interface BlogTagsModelState {
  tags: Blog.Tag[];
  loading: boolean;
}

export interface BlogTagsModelType {
  namespace: 'blogTags';
  state: BlogTagsModelState;
  effects: {
    fetchTags: Effect;
    createTag: Effect;
    updateTag: Effect;
    deleteTag: Effect;
  };
  reducers: {
    saveTags: Reducer<BlogTagsModelState>;
    setLoading: Reducer<BlogTagsModelState>;
  };
}

const Model: BlogTagsModelType = {
  namespace: 'blogTags',
  state: {
    tags: [],
    loading: false,
  },
  effects: {
    *fetchTags(_, { call, put }): Generator<any, void, any> {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getAdminTags);
        yield put({ type: 'saveTags', payload: response.data });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *createTag({ payload }, { call, put }): Generator<any, void, any> {
      yield call(createTag, payload);
      yield put({ type: 'fetchTags' });
    },
    *updateTag({ payload }, { call, put }): Generator<any, void, any> {
      yield call(updateTag, payload.id, payload.data);
      yield put({ type: 'fetchTags' });
    },
    *deleteTag({ payload }, { call, put }): Generator<any, void, any> {
      yield call(deleteTag, payload.id);
      yield put({ type: 'fetchTags' });
    },
  },
  reducers: {
    saveTags(state = Model.state, { payload }) {
      return {
        ...state,
        tags: payload,
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
