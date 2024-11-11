import { Form, Input, InputNumber, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Tag } from 'antd';

const Products = () => {
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await api.get('/SubCategory');
        setSubCategories(response.data.map(subCat => ({
          value: subCat.id,
          label: subCat.name
        })));
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };

    fetchSubCategories();
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
      render: (subCategoryId) => (
        <EntityTable.CellWithReference
          endpoint="SubCategory"
          id={subCategoryId}
          render={(subCategory) => (
            <EntityTable.CellWithReference
              endpoint="Category"
              id={subCategory?.categoryId}
              render={(category) => (
                <Tag color="blue">{category?.name}</Tag>
              )}
            />
          )}
        />
      )
    },
    { 
      title: 'SubCategory', 
      dataIndex: 'subCategoryId',
      key: 'subCategory',
      render: (subCategoryId) => (
        <EntityTable.CellWithReference
          endpoint="SubCategory"
          id={subCategoryId}
          render={(subCategory) => (
            <Tag color="green">{subCategory?.name}</Tag>
          )}
        />
      )
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