# Answers to the requirements

## LO1

### ES5 code usage
```js
import { Form, Input } from 'antd';
import EntityTable from '../components/EntityTable';
import React from 'react';

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
```
This example shows ES5 features:
- Using `var` for variable declarations
- Function declarations using `function()`
- Manual DOM manipulation through `React.createElement()`
- No arrow functions or modern JS features

## LO2 - ES6 Code Usage
1. Let/Const usage:
```js
const [customers, setCustomers] = useState([]);
const [sellers, setSellers] = useState([]);
const [loading, setLoading] = useState(false);
```

2. Arrow functions:
```js
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
```

3. Template literals:
```js
const response = await api.get(`/User?email=${userEmail}`);
```

4. Destructuring:
```js
const [subCategoriesResponse, categoriesResponse] = await Promise.all([
          api.get('/SubCategory'),
          api.get('/Category')
        ]);
```

5. Modules:
```js
import { Tag, Form, InputNumber, DatePicker, Select, Input } from 'antd';
```

6. React CSS style manipulation
```js
{avatarUrl ? (
    <img
    src={avatarUrl}
    alt="avatar"
    style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: 8
    }}
    />
) : (
    <UserOutlined style={{ fontSize: '24px', color: 'white', marginRight: 8 }} />
)}
```

## LO3 - React Advantages and SPA Implementation
1. Component-Based Architecture:
The application demonstrates modular component structure, making code reusable and maintainable.
2. Virtual DOM:
React's virtual DOM handling is evident in components like EntityTable where state updates trigger efficient re-renders.
3. State Management:
React's state management is more efficient and easier to use than vanilla JS.

### SPA Implementation:
The application implements routing using React Router

## LO4 - React Libraries Usage
1. React Router
2. Redux
3. Ant Design
4. PropTypes
5. jwt-decode

### Data Management:
The application uses Redux for state management:
```js
const initialState = {
  user: decodedUser,
  token: token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      const token = payload.access_token;
      const decodedToken = jwtDecode(token);
      
      state.token = token;
      state.user = decodedToken.email;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});
```

This implementation shows:
- Centralized state management
- Action creators
- Reducers
- Local storage integration
- JWT token handling