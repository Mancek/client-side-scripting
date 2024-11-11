import { Tag, Modal, Table, Form, Input, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../api/axios';

const Customers = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBills, setCustomerBills] = useState([]);
  const [billsModalVisible, setBillsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [creditCards, setCreditCards] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [cityResponse, cardResponse] = await Promise.all([
          api.get('/City'),
          api.get('/CreditCard')
        ])

        setCities(cityResponse.data.map(city => ({
          value: city.id,
          label: city.name
        })));

        setCreditCards(Object.fromEntries(cardResponse.data.map(card => [card.id, card])));
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const formFields = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input customer name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label="Surname"
        rules={[{ required: true, message: 'Please input customer surname!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input customer email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="telephone"
        label="Telephone"
        rules={[{ required: true, message: 'Please input customer telephone!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="cityId"
        label="City"
      >
        <Select
          showSearch
          loading={loading}
          options={cities}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a city"
          allowClear
        />
      </Form.Item>
    </>
  );

  const handleRowClick = async (record) => {
    try {
      setLoading(true);
      setBillsModalVisible(true);
      setSelectedCustomer(record);

      const response = await api.get(`/Bill?customerId=${record.id}`);
      setCustomerBills(response.data);
    } catch (error) {
      console.error('Failed to fetch customer bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillClick = (billId) => {
    setBillsModalVisible(false);
    navigate('/items', { state: { billId } });
  };

  const billColumns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id' 
    },
    { 
      title: 'Bill No.', 
      dataIndex: 'billNumber', 
      key: 'billNumber' 
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => dayjs(date).format('MM/DD/YYYY')
    },
    { 
      title: 'Total', 
      dataIndex: 'total', 
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`
    },
    {
      title: 'Card Type',
      dataIndex: 'creditCardId',
      key: 'cardType',
      render: (creditCardId) => creditCards[creditCardId]?.type?.toUpperCase() || 'Cash'
    },
    {
      title: 'Card Number',
      dataIndex: 'creditCardId',
      key: 'cardNumber',
      render: (creditCardId) => creditCards[creditCardId]?.cardNumber || '-'
    },
    {
      title: 'Expiration',
      dataIndex: 'creditCardId',
      key: 'cardExpiration',
      render: (creditCardId) => creditCards[creditCardId]?.expirationMonth ? `${creditCards[creditCardId].expirationMonth}/${creditCards[creditCardId].expirationYear}` : '-'
    }
  ];

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
      title: 'Surname', 
      dataIndex: 'surname', 
      key: 'surname'
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      render: (email) => <a href={`mailto:${email}`}><Tag color="blue">{email}</Tag></a>,
    },
    { 
      title: 'Telephone', 
      dataIndex: 'telephone', 
      key: 'telephone'
    },
    { 
      title: 'City', 
      dataIndex: 'cityId',
      key: 'cityId',
      render: (cityId) => {
        if (!cityId) return <Tag color="default">No City</Tag>;
        
        return (
          <EntityTable.CellWithReference
            endpoint="City"
            id={cityId}
            render={(city) => (
              <Tag color="blue">{city?.name}</Tag>
            )}
          />
        );
      }
    }
  ];

  return (
    <>
      <EntityTable 
        title="Customers" 
        endpoint="Customer" 
        columns={columns}
        formFields={formFields}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }
        })}
      />

      <Modal
        title={`Bills for ${selectedCustomer?.name} ${selectedCustomer?.surname}`}
        open={billsModalVisible}
        onCancel={() => setBillsModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Table
          dataSource={customerBills}
          columns={billColumns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => handleBillClick(record.id),
            style: { cursor: 'pointer' }
          })}
        />
      </Modal>
    </>
  );
};

export default Customers;