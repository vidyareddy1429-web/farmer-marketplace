import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProducts from './pages/FarmerProducts';
import FarmerAddEditProduct from './pages/FarmerAddEditProduct';
import FarmerOrders from './pages/FarmerOrders';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />

                {/* Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/my"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Farmer Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/products"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/add-product"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerAddEditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/edit-product/:id"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerAddEditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/orders"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
