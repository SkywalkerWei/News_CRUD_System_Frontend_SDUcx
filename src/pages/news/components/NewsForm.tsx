import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createNews, updateNews } from '@/services/api/news-manager';

interface NewsFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record?: API.NewsDTO | null;
  categories: API.NewsCategory[];
}

const NewsForm: React.FC<NewsFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  record,
  categories,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!record;

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title,
        content: record.content,
        categoryId: record.categoryId,
      });
    } else {
      form.resetFields();
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await updateNews({ id: record.id }, {
          ...values,
          id: record.id,
        });
        message.success('更新成功');
      } else {
        await createNews(values);
        message.success('创建成功');
      }
      onSuccess();
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败');
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑新闻' : '新增新闻'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="所属栏目"
          rules={[{ required: true, message: '请选择栏目' }]}
        >
          <Select placeholder="请选择栏目">
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea
            placeholder="请输入内容"
            rows={6}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsForm;