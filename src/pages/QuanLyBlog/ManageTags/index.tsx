import React, { useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { initMockData } from '@/services/QuanLyBlog/blogService';
import { BlogTagsModelState } from '@/models/QuanLyBlog/tags';

const { Title } = Typography;

interface ManageTagsProps {
  dispatch: Dispatch;
  blogTags: BlogTagsModelState;
  loading: boolean;
}

const colorOptions = [
  'blue',
  'cyan',
  'geekblue',
  'gold',
  'green',
  'lime',
  'magenta',
  'orange',
  'purple',
  'red',
  'volcano',
];

const ManageTags: React.FC<ManageTagsProps> = ({ dispatch, blogTags, loading }) => {
  const { tags } = blogTags;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Blog.Tag | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    initMockData();
    dispatch({ type: 'blogTags/fetchTags' });
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOpenEdit = (record: Blog.Tag) => {
    setEditingTag(record);
    form.setFieldsValue({
      name: record.name,
      color: record.color,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'blogTags/deleteTag', payload: { id } });
  };

  const handleSubmit = (values: any) => {
    if (editingTag) {
      dispatch({
        type: 'blogTags/updateTag',
        payload: { id: editingTag.id, data: values },
      });
    } else {
      dispatch({
        type: 'blogTags/createTag',
        payload: values,
      });
    }

    setModalVisible(false);
    setEditingTag(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
    },
    {
      title: 'Màu',
      dataIndex: 'color',
      width: 140,
      render: (value: string) => <Tag color={value || 'blue'}>{value || 'blue'}</Tag>,
    },
    {
      title: 'Số bài đang dùng',
      dataIndex: 'usageCount',
      width: 160,
    },
    {
      title: 'Thao tác',
      width: 160,
      render: (_: unknown, record: Blog.Tag) => (
        <Space>
          <Button onClick={() => handleOpenEdit(record)}>Sửa</Button>
          <Popconfirm
            title='Xóa thẻ này?'
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
          Quản lý thẻ
        </Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Thêm thẻ
        </Button>
      </Space>

      <Table rowKey='id' dataSource={tags} columns={columns} loading={loading} pagination={false} />

      <Modal
        destroyOnClose
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTag(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText='Lưu'
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item label='Tên thẻ' name='name' rules={[{ required: true, message: 'Nhập tên thẻ' }]}>
            <Input placeholder='Tên thẻ' />
          </Form.Item>
          <Form.Item label='Màu' name='color'>
            <Select allowClear placeholder='Chọn màu'>
              {colorOptions.map((color) => (
                <Select.Option key={color} value={color}>
                  {color}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default connect(({ blogTags, loading }: { blogTags: BlogTagsModelState; loading: any }) => ({
  blogTags,
  loading: loading.effects['blogTags/fetchTags'],
}))(ManageTags);
