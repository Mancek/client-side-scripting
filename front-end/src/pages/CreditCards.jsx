import { Form, Input, InputNumber, Select } from 'antd';
import EntityTable from '../components/EntityTable';
import { Tag } from 'antd';

const CreditCards = () => {
  const cardTypes = [
    'visa',
    'mastercard',
    'american_express',
    'discover',
    'diners_club',
    'jcb',
    'maestro'
  ];

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id'
    },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>
    },
    { 
      title: 'Card Number', 
      dataIndex: 'cardNumber', 
      key: 'cardNumber' 
    },
    { 
      title: 'Expiration', 
      key: 'expiration',
      render: (_, record) => `${record.expirationMonth}/${record.expirationYear}`
    }
  ];

  const formFields = (
    <>
      <Form.Item
        name="type"
        label="Card Type"
        rules={[{ required: true, message: 'Please select card type!' }]}
      >
        <Select>
          {cardTypes.map(type => (
            <Select.Option key={type} value={type}>
              {type.toUpperCase()}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item
        name="cardNumber"
        label="Card Number"
        rules={[{ required: true, message: 'Please input card number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="expirationMonth"
        label="Expiration Month"
        rules={[
          { required: true, message: 'Please input expiration month!' },
          { type: 'number', min: 1, max: 12, message: 'Month must be between 1 and 12!' }
        ]}
      >
        <InputNumber min={1} max={12} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="expirationYear"
        label="Expiration Year"
        rules={[
          { required: true, message: 'Please input expiration year!' },
          { type: 'number', min: 2023, message: 'Year must be 2023 or later!' }
        ]}
      >
        <InputNumber type="number" min={2023} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Credit Cards" 
      endpoint="CreditCard" 
      columns={columns}
      formFields={formFields}
    />
  );
};

export default CreditCards;