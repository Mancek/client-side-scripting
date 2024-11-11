import { Form, Input, Switch } from 'antd';
import EntityTable from '../components/EntityTable';
import { Tag } from 'antd';

const Sellers = () => {
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
      title: 'Permanent Employee', 
      dataIndex: 'permanentEmployee', 
      key: 'permanentEmployee',
      render: (permanentEmployee) => (
        <Tag color={permanentEmployee ? 'green' : 'red'}>
          {permanentEmployee ? 'Yes' : 'No'}
        </Tag>
      )
    }
  ];

  const formFields = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input seller name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="surname"
        label="Surname"
        rules={[{ required: true, message: 'Please input seller surname!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="permanentEmployee"
        label="Permanent Employee"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Sellers" 
      endpoint="Seller" 
      columns={columns}
      formFields={formFields}
    />
  );
};

export default Sellers;