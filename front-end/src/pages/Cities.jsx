import { Form, Input } from 'antd';
import EntityTable from '../components/EntityTable';

const Cities = () => {
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
    },
  ];

  const formFields = (
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  );

  return <EntityTable title="Cities" endpoint="City" columns={columns} formFields={formFields} />;
};

export default Cities;