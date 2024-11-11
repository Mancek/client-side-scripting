import { Form, Input, InputNumber, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Tag } from 'antd';

const Products = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subCategoriesResponse, categoriesResponse] = await Promise.all([
          api.get('/SubCategory'),
          api.get('/Category')
        ]);

        setSubCategories(subCategoriesResponse.data.map(subCat => ({
          value: subCat.id,
          label: subCat.name,
          categoryId: subCat.categoryId
        })));

        setCategories(categoriesResponse.data.map(cat => ({
          value: cat.id,
          label: cat.name
        })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id'
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Product Number', 
      dataIndex: 'productNumber', 
      key: 'productNumber' 
    },
    { 
      title: 'Color', 
      dataIndex: 'color', 
      key: 'color',
      render: (color) => <Tag color={color}>{color?.toUpperCase()}</Tag>
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => `$${price?.toFixed(2)}`
    },
    {
      title: 'Category', 
      dataIndex: 'subCategoryId',
      key: 'category',
      render: (subCategoryId) => {
        const subCategory = subCategories.find(sub => sub.value === subCategoryId);
        const category = categories.find(cat => cat.value === subCategory?.categoryId);
        return <Tag color="blue">{category?.label}</Tag>;
      }
    },
    { 
      title: 'SubCategory', 
      dataIndex: 'subCategoryId',
      key: 'subCategory',
      render: (subCategoryId) => {
        const subCategory = subCategories.find(sub => sub.value === subCategoryId);
        return <Tag color="green">{subCategory?.label}</Tag>;
      }
    }
  ];

  const formFields = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input product name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="productNumber"
        label="Product Number"
        rules={[{ required: true, message: 'Please input product number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="color"
        label="Color"
        rules={[{ required: true, message: 'Please input color!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please input price!' }]}
      >
        <InputNumber 
          min={0} 
          precision={2} 
          prefix="$"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="subCategoryId"
        label="SubCategory"
        rules={[{ required: true, message: 'Please select subcategory!' }]}
      >
        <Select
          options={subCategories}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Products" 
      endpoint="Product" 
      columns={columns}
      formFields={formFields}
    />
  );
};

export default Products;