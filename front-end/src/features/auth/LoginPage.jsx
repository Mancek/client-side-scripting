import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import api from '../../api/axios';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await api.post('/auth/login', values);
      dispatch(setCredentials(response.data));
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5' 
    }}>
      <Card title="Login" style={{ width: 300 }}>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
          
          <Button type="link" block onClick={() => navigate('/register')}>
            Don't have an account? Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;