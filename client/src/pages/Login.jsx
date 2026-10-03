import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Sprout, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'farmer') navigate('/farmer/dashboard');
      else if (res.user.role === 'admin') navigate('/admin');
      else navigate('/products');
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Namaste & Welcome</h2>
        <p className="text-xs text-slate-500">Sign in to Rythu Marketplace to manage produce listings or orders</p>
      </div>

      {/* Quick Demo Accounts Banner */}
      <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
          <UserCheck className="w-4 h-4 text-emerald-600" /> One-Click Quick Fill Demo:
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleQuickLogin('farmer1@greenfields.com', 'password123')}
            className="p-2 bg-white hover:bg-emerald-100/60 rounded-xl font-semibold text-slate-800 text-center border border-emerald-200 shadow-sm"
          >
            👨‍🌾 Telangana Kisan
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('customer@freshbuy.com', 'password123')}
            className="p-2 bg-white hover:bg-emerald-100/60 rounded-xl font-semibold text-slate-800 text-center border border-emerald-200 shadow-sm"
          >
            🛒 Hyderabad Buyer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@farm.com', 'password123')}
            className="p-2 bg-white hover:bg-emerald-100/60 rounded-xl font-semibold text-slate-800 text-center border border-emerald-200 shadow-sm"
          >
            👑 Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Sign In
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-emerald-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
