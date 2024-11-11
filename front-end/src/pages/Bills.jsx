import { Tag, Form, InputNumber, DatePicker, Select, Input } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import api from '../api/axios';

const Bills = () => {
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerResponse, sellerResponse] = await Promise.all([
          api.get('/Customer'),
          api.get('/Seller')
        ]);
        
        setCustomers(customerResponse.data.map(customer => ({
          value: customer.id,
          label: `${customer.name} ${customer.surname}`
        })));
        
        setSellers(sellerResponse.data.map(seller => ({
          value: seller.id,
          label: `${seller.name} ${seller.surname}`
        })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Bill no.', dataIndex: 'billNumber', key: 'billNumber' },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => dayjs(date).format('DD.MM.YYYY')
    },
    { 
      title: 'Customer', 
      dataIndex: 'customerId',
      key: 'customerId',
      render: (customerId) => {
        if (!customerId) return <Tag color="default">No Customer</Tag>;
        
        return (
          <EntityTable.CellWithReference
            endpoint="Customer"
            id={customerId}
            render={(customer) => (
              <Tag color="blue">{customer?.name} {customer?.surname}</Tag>
            )}
          />
        );
      }
    },
    { 
      title: 'Seller', 
      dataIndex: 'sellerId',
      key: 'sellerId',
      render: (sellerId) => {
        if (!sellerId) return <Tag color="default">No Seller</Tag>;
        
        return (
          <EntityTable.CellWithReference
            endpoint="Seller"
            id={sellerId}
            render={(seller) => (
              <Tag color="green">{seller?.name} {seller?.surname}</Tag>
            )}
          />
        );
      }
    },
    { 
      title: 'Total', 
      dataIndex: 'total', 
      key: 'total',
      render: (amount) => amount ? `$${amount.toFixed(2)}` : '-'
    },
  ];

  const formFields = (
    <>
      <Form.Item 
        name="billNumber" 
        label="Bill Number" 
        rules={[{ required: true, message: 'Please input bill number!' }]}
      >
        <Input placeholder="Enter bill number" />
      </Form.Item>

      <Form.Item 
        name="customerId" 
        label="Customer" 
        rules={[{ required: true, message: 'Please select a customer!' }]}
      >
        <Select
          showSearch
          loading={loading}
          options={customers}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a customer"
        />
      </Form.Item>

      <Form.Item 
        name="sellerId" 
        label="Seller" 
        rules={[{ required: true, message: 'Please select a seller!' }]}
      >
        <Select
          showSearch
          loading={loading}
          options={sellers}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a seller"
        />
      </Form.Item>

      <Form.Item 
        name="total" 
        label="Total" 
        rules={[{ required: true, message: 'Please input total!' }]}
      >
        <InputNumber 
          prefix="$" 
          min={0} 
          step={0.01} 
          style={{ width: '100%' }} 
        />
      </Form.Item>

      <Form.Item 
        name="date" 
        label="Date" 
        rules={[{ required: true, message: 'Please select a date!' }]}
        getValueProps={(i) => ({
          value: i ? dayjs(i) : null
        })}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Bills" 
      endpoint="Bill" 
      columns={columns} 
      formFields={formFields} 
    />
  );
};

export default Bills;