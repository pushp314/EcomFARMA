import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import CustomerOrders from './components/orders/CustomerOrders';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import { CartProvider } from './context/CartContext';

// Layout wrapper for pages with Navbar + Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

// Auth layout (no navbar/footer)
const AuthLayout = ({ children }) => (
  <main>{children}</main>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Auth Routes (no navbar/footer) */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />

          {/* Public Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <MainLayout>
                <Marketplace />
              </MainLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />

          {/* Protected Routes — Any authenticated user */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/my-orders"
            element={
              <MainLayout>
                <ProtectedRoute roles={['customer']}>
                  <div className="container-custom py-12">
                    <CustomerOrders />
                  </div>
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <MainLayout>
                <ProtectedRoute roles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <MainLayout>
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
                  <div className="text-center">
                    <h1 className="font-display text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-gray-500 mt-4 text-lg">Page not found</p>
                    <a href="/" className="btn-primary mt-6 inline-flex">
                      Go Home
                    </a>
                  </div>
                </div>
              </MainLayout>
            }
          />
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
