import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import Customers from './pages/Customers';
import Bills from './pages/Bills';
import Categories from './pages/Categories';
import Cities from './pages/Cities';
import CreditCards from './pages/CreditCards';
import Sellers from './pages/Sellers';
import Items from './pages/Items';
import Products from './pages/Products';
import SubCategories from './pages/SubCategories';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/customers" element={<Customers />} />
                <Route path="/cities" element={<Cities />} />
                
                <Route path="/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/credit-cards" element={<ProtectedRoute><CreditCards /></ProtectedRoute>} />
                <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/sellers" element={<ProtectedRoute><Sellers /></ProtectedRoute>} />
                <Route path="/sub-categories" element={<ProtectedRoute><SubCategories /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/customers" />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;