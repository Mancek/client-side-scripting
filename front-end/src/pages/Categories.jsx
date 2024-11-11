import { Form, Input } from 'antd';
import EntityTable from '../components/EntityTable';

const Categories = () => {
  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: '50%',
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      width: '50%',
    }
  ];

  const formFields = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input category name!' }]}
      >
        <Input />
      </Form.Item>
    </>
  );

  return (
    <EntityTable 
      title="Categories" 
      endpoint="Category" 
      columns={columns}
      formFields={formFields}
    />
  );
};

export default Categories;