import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import api from '../../api/axios';
import { useState } from 'react';
import AvatarUpload from '../../components/common/AvatarUpload';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const onFinish = async (values) => {
    try {
      await api.post('/auth/register', {
        email: values.email,
        password: values.password,
        name: values.name
      });

      if (avatarUrl) {
        localStorage.setItem(`avatar_${values.email}`, avatarUrl);
      }

      const loginResponse = await api.post('/auth/login', {
        email: values.email,
        password: values.password
      });

      loginResponse.data.userEmail = values.email;
      dispatch(setCredentials(loginResponse.data));
      message.success('Registration successful');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
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
      <Card title="Register" style={{ width: 300 }}>
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item style={{ textAlign: 'center' }}>
            <AvatarUpload 
              avatarUrl={avatarUrl} 
              onAvatarChange={setAvatarUrl} 
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 2, message: 'Name must be at least 2 characters!' }
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          
          <Button type="link" block onClick={() => navigate('/login')}>
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;