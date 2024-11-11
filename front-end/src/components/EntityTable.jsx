import { useEffect, useState } from 'react';
import { Table, Card, message, Button, Space, Modal, Form, Input, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../api/axios';

const CellWithReference = ({ endpoint, id, render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/${endpoint}/${id}`);
        setData(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        message.error(`Failed to fetch ${endpoint}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [endpoint, id]);

  if (loading) {
    return <Spin size="small" />;
  }

  return render(data);
};

const EntityTable = ({ title, endpoint, columns, formFields, onRow, form: externalForm, onEdit: externalOnEdit, defaultFilters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  let [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  if (externalForm) {
    form = externalForm;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = new URLSearchParams();
        
        params.append('_page', pagination.current);
        params.append('_limit', pagination.pageSize);
        
        if (searchText) {
          params.append('q', searchText);
        }
        
        if (sortField) {
          params.append('_sort', sortField);
          params.append('_order', sortOrder === 'ascend' ? 'asc' : 'desc');
        }

        if (defaultFilters) {
          Object.entries(defaultFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, value);
            }
          });
        }

        const queryString = params.toString();
        const response = await api.get(`/${endpoint}${queryString ? `?${queryString}` : ''}`);
        
        const totalCount = parseInt(response.headers['x-total-count'] || '0');
        
        setData(response.data);
        setPagination(prev => ({
          ...prev,
          total: totalCount
        }));
      } catch (error) {
        message.error(`Failed to fetch ${title.toLowerCase()}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const debouncer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debouncer);
  }, [endpoint, title, searchText, sortField, sortOrder, pagination.current, pagination.pageSize, defaultFilters]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      message.success('Deleted successfully');
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      message.error(`Failed to delete: ${error.message}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await api.put(`/${endpoint}/${editingRecord.id}`, values);
        setData(data.map(item => 
          item.id === editingRecord.id ? { ...item, ...values } : item
        ));
        message.success('Updated successfully');
      } else {
        const response = await api.post(`/${endpoint}`, values);
        setData([...data, response.data]);
        message.success('Created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    } catch (error) {
      message.error(`Failed to save: ${error.message}`);
    }
  };

  const actionColumn = {
    title: 'Actions',
    key: 'actions',
    width: '150px',
    fixed: 'right',
    render: (_, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setEditingRecord(record);
            form.setFieldsValue(record);
            setModalVisible(true);
            if (externalOnEdit) {
              externalOnEdit(record);
            }
          }}
        />
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.stopPropagation();
            Modal.confirm({
            title: 'Are you sure you want to delete this item?',
              onOk: () => handleDelete(record.id),
            });
          }}
        />
      </Space>
    ),
  };

  const enhancedColumns = [
    ...columns.map(col => ({
      ...col,
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend']
    })),
    actionColumn
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
    setSortField(sorter.field);
    setSortOrder(sorter.order);
  };

  return (
    <Card 
      title={title}
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add New
          </Button>
        </div>
      }
    >
      <Table
        dataSource={data}
        columns={enhancedColumns}
        loading={loading}
        rowKey="id"
        scroll={{ x: true }}
        tableLayout="fixed"
        onChange={handleTableChange}
        pagination={pagination}
        onRow={onRow}
      />

      <Modal
        title={`${editingRecord ? 'Edit' : 'Create'} ${title}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {formFields}
        </Form>
      </Modal>
    </Card>
  );
};

EntityTable.CellWithReference = CellWithReference;

export default EntityTable;