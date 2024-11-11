import { Layout, Menu, Button, Modal, Descriptions, Space, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useState, useEffect } from 'react';
import { UserOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import AvatarUpload from '../common/AvatarUpload';

const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const userEmail = useSelector(state => state.auth.user);

  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const response = await api.get(`/User?email=${userEmail}`);
          if (response.data && response.data.length > 0) {
            setUserData(response.data[0]);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    if (userInfoVisible) {
      fetchUserData();
    }
  }, [userEmail, userInfoVisible]);

  useEffect(() => {
    if (userEmail) {
      const savedAvatar = localStorage.getItem(`avatar_${userEmail}`);
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    }
  }, [userEmail]);

  const menuItems = [
    { key: '/customers', label: 'Customers' },
    ...(isAuthenticated ? [
      { key: '/bills', label: 'Bills' },
      { key: '/categories', label: 'Categories' },
      { key: '/cities', label: 'Cities' },
      { key: '/credit-cards', label: 'Credit Cards' },
      { key: '/items', label: 'Items' },
      { key: '/products', label: 'Products' },
      { key: '/sellers', label: 'Sellers' },
      { key: '/sub-categories', label: 'Sub Categories' },
    ] : [])
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/customers');
  };

  const handleUpdateUser = async (values) => {
    try {
      await api.put(`/User/${userData.id}`, values);
      setUserData({ ...userData, ...values });
      if (avatarUrl) {
        localStorage.setItem(`avatar_${values.email}`, avatarUrl);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Space>
          <Button 
            onClick={() => setUserInfoVisible(true)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
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
            User Info
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      );
    } else {
      return (
        <Space>
          <Button 
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            icon={<UserAddOutlined />}
            type="primary"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Space>
      );
    }
  };
  

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', marginRight: '20px' }}>Admin Panel</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
          style={{ flex: 1 }}
        />
        {renderAuthButtons()}
      </Header>
      <Content style={{padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>

      <Modal
        title="User Information"
        open={userInfoVisible}
        onCancel={() => {
          setUserInfoVisible(false);
          setIsEditing(false);
        }}
        footer={
          isEditing ? (
            <Space>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Save
              </Button>
            </Space>
          ) : (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )
        }
      >
        {userData ? (
          isEditing ? (
            <Form
              form={form}
              initialValues={userData}
              onFinish={handleUpdateUser}
              layout="vertical"
            >
              <Form.Item 
                label="Avatar"
                style={{ textAlign: 'center' }}
              >
                <AvatarUpload 
                  avatarUrl={avatarUrl} 
                  onAvatarChange={setAvatarUrl} 
                />
              </Form.Item>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
            </Form>
          ) : (
            <Descriptions column={1}>
              <Descriptions.Item label="Avatar">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: '32px' }} />
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Name">{userData.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            </Descriptions>
          )
        ) : (
          <div>Loading user information...</div>
        )}
      </Modal>
    </Layout>
  );
};
export default MainLayout;