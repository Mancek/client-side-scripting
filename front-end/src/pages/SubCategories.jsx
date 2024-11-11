import { Form, Input, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import api from '../api/axios';

const SubCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/Category');
        setCategories(response.data.map(category => ({
          value: category.id,
          label: category.name
        })));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Category', 
      dataIndex: 'categoryId', 
      key: 'categoryId',
      render: (categoryId) => {
        if (!categoryId) return <Tag color="default">No Category</Tag>;

        const category = categories.find(cat => cat.value === categoryId);
        return <Tag color="blue">{category?.label}</Tag>;
      }
    }
  ];

  const formFields = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input subcategory name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select
          options={categories}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a category"
        />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Sub Categories" 
      endpoint="SubCategory" 
      columns={columns}
      formFields={formFields}
    />
  );
};

export default SubCategories;