import { Form, Input } from 'antd';
import EntityTable from '../components/EntityTable';
import React from 'react';

// LO1 - ES5
var Cities = function() {
  var columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '50%'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%'
    }
  ];

  var formFields = React.createElement(
    Form.Item,
    {
      name: "name",
      label: "Name",
      rules: [{ required: true }]
    },
    React.createElement(Input, null)
  );

  return React.createElement(EntityTable, {
    title: "Cities",
    endpoint: "City",
    columns: columns,
    formFields: formFields
  });
};

export default Cities;