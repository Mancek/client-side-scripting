import { Form, InputNumber, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';
import api from '../api/axios';

const Items = () => {
  const location = useLocation();
  const billId = location.state?.billId;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [form] = Form.useForm();

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

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory) {
        try {
          const response = await api.get(`/SubCategory?categoryId=${selectedCategory}`);
          setSubCategories(response.data.map(subCategory => ({
            value: subCategory.id,
            label: subCategory.name
          })));
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        }
      } else {
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSubCategory) {
        try {
          const response = await api.get(`/Product?subCategoryId=${selectedSubCategory}`);
          setProducts(response.data.map(product => ({
            value: product.id,
            label: `${product.name} (${product.productNumber})`,
            price: product.price
          })));
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedSubCategory]);

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: '80px'
    },
    { 
      title: 'Product', 
      dataIndex: 'productId', 
      key: 'productId',
      render: (productId) => (
        <EntityTable.CellWithReference
          endpoint="Product"
          id={productId}
          render={(product) => product?.name}
        />
      )
    },
    { 
      title: 'Product Number', 
      dataIndex: 'productId', 
      key: 'productNumber',
      render: (productId) => (
        <EntityTable.CellWithReference
          endpoint="Product"
          id={productId}
          render={(product) => product?.productNumber}
        />
      )
    },
    { 
      title: 'Color', 
      dataIndex: 'productId', 
      key: 'color',
      render: (productId) => (
        <EntityTable.CellWithReference
          endpoint="Product"
          id={productId}
          render={(product) => (
            <Tag color={product?.color}>{product?.color?.toUpperCase()}</Tag>
          )}
        />
      )
    },
    { 
      title: 'Quantity', 
      dataIndex: 'quantity', 
      key: 'quantity' 
    },
    { 
      title: 'Price per Piece', 
      dataIndex: 'productId', 
      key: 'pricePerPiece',
      render: (productId) => (
        <EntityTable.CellWithReference
          endpoint="Product"
          id={productId}
          render={(product) => `$${product?.price?.toFixed(2)}`}
        />
      )
    },
    { 
      title: 'Total Price', 
      key: 'totalPrice',
      render: (_, record) => (
        <EntityTable.CellWithReference
          endpoint="Product"
          id={record.productId}
          render={(product) => {
            const total = (product?.price || 0) * (record.quantity || 0);
            return <strong>${total.toFixed(2)}</strong>;
          }}
        />
      )
    }
  ];

  const handleEdit = async (record) => {
    try {
      const productResponse = await api.get(`/Product/${record.productId}`);
      const product = productResponse.data;
      const subCategoryResponse = await api.get(`/SubCategory/${product.subCategoryId}`);
      const subCategory = subCategoryResponse.data;

      setSelectedCategory(subCategory.categoryId);
      setSelectedSubCategory(product.subCategoryId);

      form.setFieldsValue({
        ...record,
        categoryId: subCategory.categoryId,
        subCategoryId: product.subCategoryId
      });
    } catch (error) {
      console.error('Failed to fetch data for editing:', error);
    }
  };

  const formFields = (
    <>
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
          onChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubCategory(null);
            form.setFieldsValue({ 
              subCategoryId: undefined, 
              productId: undefined 
            });
          }}
        />
      </Form.Item>

      <Form.Item
        name="subCategoryId"
        label="Sub Category"
        rules={[{ required: true, message: 'Please select a subcategory!' }]}
      >
        <Select
          options={subCategories}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a subcategory"
          disabled={!selectedCategory}
          onChange={(value) => {
            setSelectedSubCategory(value);
            form.setFieldsValue({ 
              productId: undefined 
            });
          }}
        />
      </Form.Item>

      <Form.Item
        name="productId"
        label="Product"
        rules={[{ required: true, message: 'Please select a product!' }]}
      >
        <Select
          options={products}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a product"
          disabled={!selectedSubCategory}
        />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true, message: 'Please input quantity!' }]}
      >
        <InputNumber 
          min={1} 
          style={{ width: '100%' }}
        />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
    title={billId ? `Items for bill #${billId}` : "Items"}
      endpoint="Item" 
      columns={columns}
      formFields={formFields}
      form={form}
      onEdit={handleEdit}
      defaultFilters={billId ? { billId } : undefined}
    />
  );
};

export default Items;