import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, MapPin, Phone, Building2, AlertCircle } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    phone: '',
    location: '',
    farmName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/products');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Create Account</h2>
        <p className="text-xs text-slate-500">Join the direct farmer-to-customer marketplace</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Toggle Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Role</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                formData.role === 'customer'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              🛒 Customer / Buyer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'farmer' })}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                formData.role === 'farmer'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              👨‍🌾 Farmer / Producer
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        {formData.role === 'farmer' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="e.g. Green Valley Organic Farm"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0199"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Sacramento, CA"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>
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
              <UserPlus className="w-4 h-4" /> Complete Registration
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-emerald-600 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
