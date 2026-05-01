import React, { useEffect, useMemo, useState } from 'react';
import { connect, Dispatch } from 'umi';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { BlogManageState } from '@/models/QuanLyBlog/manage';
import { initMockData } from '@/services/QuanLyBlog/blogService';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ManagePostsProps {
  dispatch: Dispatch;
  blogManage: BlogManageState;
  loading: boolean;
}

const statusOptions = [
  { label: 'Nháp', value: 'DRAFT' },
  { label: 'Đã đăng', value: 'PUBLISHED' },
];

const ManagePosts: React.FC<ManagePostsProps> = ({ dispatch, blogManage, loading }) => {
  const { posts, tags, total, current, pageSize, keyword, status } = blogManage;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog.Post | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    initMockData();
    dispatch({ type: 'blogManage/fetchTags' });
    dispatch({ type: 'blogManage/fetchPosts' });
  }, [dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch({ type: 'blogManage/setFilter', payload: { keyword: value } });
        dispatch({ type: 'blogManage/fetchPosts', payload: { current: 1 } });
      }, 300),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOpenEdit = (record: Blog.Post) => {
    setEditingPost(record);
    form.setFieldsValue({
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      content: record.content,
      thumbnail: record.thumbnail,
      status: record.status,
      tagIds: record.tags.map((tag) => tag.id),
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'blogManage/deletePost', payload: { id } });
  };

  const handleStatusChange = (value?: 'DRAFT' | 'PUBLISHED') => {
    dispatch({ type: 'blogManage/setFilter', payload: { status: value } });
    dispatch({ type: 'blogManage/fetchPosts', payload: { current: 1 } });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: 'blogManage/fetchPosts', payload: { current: page } });
  };

  const handleSubmit = (values: any) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      content: values.content,
      thumbnail: values.thumbnail,
      status: values.status,
      tagIds: values.tagIds || [],
    };

    if (editingPost) {
      dispatch({
        type: 'blogManage/updatePost',
        payload: {
          id: editingPost.id,
          data: payload,
        },
      });
    } else {
      dispatch({
        type: 'blogManage/createPost',
        payload,
      });
    }

    setModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'thumbnail',
      width: 120,
      render: (value: string) => (
        <img
          src={value}
          alt='thumbnail'
          style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 110,
      render: (value: 'DRAFT' | 'PUBLISHED') => (
        <Tag color={value === 'PUBLISHED' ? 'green' : 'default'}>
          {value === 'PUBLISHED' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      render: (value: Blog.Tag[]) => (
        <Space wrap>
          {value.map((tag) => (
            <Tag key={tag.id} color={tag.color || 'blue'}>
              {tag.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      width: 110,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 140,
      render: (value: string) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      width: 160,
      render: (_: unknown, record: Blog.Post) => (
        <Space>
          <Button onClick={() => handleOpenEdit(record)}>Sửa</Button>
          <Popconfirm
            title='Xóa bài viết này?'
            okText='Xóa'
            cancelText='Hủy'
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ minHeight: '100vh' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý bài viết
        </Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Thêm bài viết
        </Button>
      </Space>

      <Space style={{ marginBottom: 16 }} size='large' wrap>
        <Input
          placeholder='Tìm kiếm theo tiêu đề...'
          defaultValue={keyword}
          onChange={(event) => debouncedSearch(event.target.value)}
          allowClear
          style={{ width: 260 }}
        />
        <Select
          placeholder='Lọc theo trạng thái'
          allowClear
          value={status}
          onChange={handleStatusChange}
          options={statusOptions}
          style={{ width: 180 }}
        />
      </Space>

      <Table
        rowKey='id'
        dataSource={posts}
        columns={columns}
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />

      <Modal
        destroyOnClose
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPost(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText='Lưu'
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input placeholder='Nhập tiêu đề' />
          </Form.Item>
          <Form.Item label='Slug' name='slug' rules={[{ required: true, message: 'Nhập slug' }]}>
            <Input placeholder='bai-viet-abc' />
          </Form.Item>
          <Form.Item label='Tóm tắt' name='summary' rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
            <TextArea rows={3} placeholder='Tóm tắt nội dung' />
          </Form.Item>
          <Form.Item label='Nội dung' name='content' rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <TextArea rows={6} placeholder='Nội dung bài viết' />
          </Form.Item>
          <Form.Item
            label='Ảnh đại diện (URL)'
            name='thumbnail'
            rules={[{ required: true, message: 'Nhập URL ảnh đại diện' }]}
          >
            <Input placeholder='https://...' />
          </Form.Item>
          <Form.Item label='Thẻ' name='tagIds' rules={[{ required: true, message: 'Chọn thẻ' }]}>
            <Select mode='multiple' placeholder='Chọn thẻ'>
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default connect(({ blogManage, loading }: { blogManage: BlogManageState; loading: any }) => ({
  blogManage,
  loading: loading.effects['blogManage/fetchPosts'],
}))(ManagePosts);
