import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  PackageCheck,
  ShieldAlert,
  Sprout,
  Store,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isFarmer, isCustomer, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-emerald-100/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                FarmDirect
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-600 uppercase -mt-1">
                Middleman-Free Produce
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              Produce Market
            </Link>

            {/* Role Specific Navigation */}
            {isFarmer && (
              <>
                <Link
                  to="/farmer/dashboard"
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/farmer/products"
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  My Listings
                </Link>
                <Link
                  to="/farmer/add-product"
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Produce
                </Link>
                <Link
                  to="/farmer/orders"
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
                >
                  <PackageCheck className="w-4 h-4" />
                  Incoming Orders
                </Link>
              </>
            )}

            {isCustomer && (
              <Link
                to="/orders/my"
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                My Orders
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 border border-amber-200"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* User & Cart Action Controls */}
          <div className="flex items-center gap-4">
            {/* Cart Icon (visible to customers or guests) */}
            {(!user || isCustomer) && (
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="text-[10px] capitalize px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
