import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Table, Modal, message, Form, Input, DatePicker, Select, Switch, Tooltip } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons';
import { queryNews, deleteNews, updateNews } from '@/services/api/news-manager';
import { searchCategories } from '@/services/api/news-category-manager';
import NewsForm from './components/NewsForm';
import moment from 'moment';
import MouseTrail from '../../components/MouseTrail';

const { confirm } = Modal;
const { RangePicker } = DatePicker;

const NewsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<API.NewsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.News[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<API.NewsCategory[]>([]);
  const [searchParams, setSearchParams] = useState({
    current: 1,
    pageSize: 10,
  });

  // 获取栏目列表
  const fetchCategories = async () => {
    try {
      const response = await searchCategories({ name: '' });
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      message.error('获取栏目列表失败');
    }
  };

  // 获取新闻列表
  const fetchNews = async (params: any) => {
    setLoading(true);
    try {
      const response = await queryNews({
        ...params,
        queryDTO: {
          ...params,
          offset: (params.current - 1) * params.pageSize,
        },
      });
      if (response.data?.list) {
        setData(response.data.list);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      message.error('获取新闻列表失败');
    }
    setLoading(false);
  };

  // 删除新闻
  const handleDelete = (id: string) => {
    confirm({
      title: '确定要删除这条新闻吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复',
      onOk: async () => {
        try {
          await deleteNews({ id });
          message.success('删除成功');
          fetchNews(searchParams);
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '栏目',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
      },
    },
    {
      title: '作者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '最后编辑',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.News) => (
        <>
          <Button type="link" onClick={() => {
            setEditingRecord(record);
            setVisible(true);
          }}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 搜索表单提交
  const handleSearch = (values: any) => {
    const params = {
      ...searchParams,
      ...values,
      startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    };
    delete params.timeRange;
    setSearchParams(params);
    fetchNews(params);
  };

  // 组件加载时获取数据
  React.useEffect(() => {
    fetchCategories();
    fetchNews(searchParams);
  }, []);

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 24 }}
        >
          <Form.Item name="title" label="标题">
            <Input placeholder="请输入标题" allowClear />
          </Form.Item>
          <Form.Item name="categoryId" label="栏目">
            <Select
              placeholder="请选择栏目"
              allowClear
              style={{ width: 200 }}
            >
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="创建时间">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => {
              form.resetFields();
              handleSearch({});
            }}>
              重置
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRecord(null);
            setVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          新增新闻
        </Button>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            total,
            current: searchParams.current,
            pageSize: searchParams.pageSize,
            onChange: (page, pageSize) => {
              const params = {
                ...searchParams,
                current: page,
                pageSize,
              };
              setSearchParams(params);
              fetchNews(params);
            },
          }}
        />
      </Card>

      <NewsForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          fetchNews(searchParams);
        }}
        record={editingRecord}
        categories={categories}
      />
      <MouseTrail />
    </PageContainer>
  );
};

export default NewsPage;