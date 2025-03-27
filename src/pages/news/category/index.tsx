import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Table, Modal, message, Form, Input, Select } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  searchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryExists,
} from '@/services/api/news-category-manager';
import MouseTrail from '../../../components/MouseTrail';

const { confirm } = Modal;

const CategoryPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.NewsCategory[]>([]);
  const [editingRecord, setEditingRecord] = useState<API.NewsCategory | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>('');

  // 获取栏目列表
  const fetchCategories = async (name?: string) => {
    setLoading(true);
    try {
      const response = await searchCategories({ name });
      if (response?.data) {
        setData(response.data);
      }
    } catch (error) {
      message.error('获取栏目列表失败');
    }
    setLoading(false);
  };

  // 检查栏目名称是否存在
  const checkCategoryName = async (name: string) => {
    if (!name) return;
    try {
      const response = await categoryExists({ name });
      if (response?.data && !editingRecord?.name) {
        return Promise.reject('栏目名称已存在');
      }
    } catch (error) {
      return Promise.reject('检查栏目名称失败');
    }
  };

  // 删除栏目
  const handleDelete = (record: API.NewsCategory) => {
    confirm({
      title: '确定要删除这个栏目吗？',
      icon: <ExclamationCircleOutlined />,
      content: '如果该栏目下有新闻，您需要选择一个目标栏目来转移这些新闻。',
      okButtonProps: { disabled: !targetCategoryId },
      onOk: async () => {
        try {
          await deleteCategory({
            id: record.id,
            targetCategoryId,
          });
          message.success('删除成功');
          fetchCategories();
          setTargetCategoryId('');
        } catch (error) {
          message.error('删除失败');
        }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder="选择目标栏目"
            onChange={(value) => setTargetCategoryId(value)}
          >
            {data
              .filter((item) => item.id !== record.id)
              .map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
          </Select>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateCategory({
          id: editingRecord.id,
          name: values.name,
        });
        message.success('更新成功');
      } else {
        await createCategory({
          name: values.name,
        });
        message.success('创建成功');
      }
      setVisible(false);
      fetchCategories();
    } catch (error) {
      message.error(editingRecord ? '更新失败' : '创建失败');
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '栏目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.NewsCategory) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </>
      ),
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text: string) => text.replace('T', ' '),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => text.replace('T', ' '),
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <PageContainer>
      <Card>
        <Form layout="inline" style={{ marginBottom: 24 }}>
          <Form.Item>
            <Input.Search
              placeholder="搜索栏目"
              onSearch={(value) => fetchCategories(value)}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setVisible(true);
              }}
            >
              新增栏目
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingRecord ? '编辑栏目' : '新增栏目'}
          visible={visible}
          onOk={handleSubmit}
          onCancel={() => {
            setVisible(false);
            form.resetFields();
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="栏目名称"
              rules={[
                { required: true, message: '请输入栏目名称' },
                { validator: async (_, value) => await checkCategoryName(value) },
              ]}
            >
              <Input placeholder="请输入栏目名称" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <MouseTrail />
    </PageContainer>
  );
};

export default CategoryPage;