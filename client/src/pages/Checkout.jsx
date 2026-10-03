import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: user?.phone || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/orders', {
        items: cartItems.map((i) => ({
          product: i.product,
          farmer: i.farmer,
          qty: i.qty,
          price: i.price,
          name: i.name,
        })),
        address,
        paymentMethod: 'Cash on Delivery',
      });

      if (data.success) {
        clearCart();
        navigate('/orders/my');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Checkout & Delivery Address</h1>
        <p className="text-xs text-slate-500 mt-1">Direct Cash on Delivery (COD) in Indian Rupees (₹)</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Address Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> Delivery Address in India
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Flat / House No. / Street Address</label>
            <input
              type="text"
              name="street"
              required
              value={address.street}
              onChange={handleChange}
              placeholder="Flat 402, Sunshine Apts, Bandra West"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / District</label>
              <input
                type="text"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                placeholder="Mumbai / Nashik"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                required
                value={address.state}
                onChange={handleChange}
                placeholder="Maharashtra / Punjab"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                name="zip"
                required
                value={address.zip}
                onChange={handleChange}
                placeholder="400050"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (+91)</label>
              <input
                type="text"
                name="phone"
                required
                value={address.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-xs text-slate-700 mb-2 uppercase tracking-wider">Payment Option</h3>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-slate-500">Pay cash in Rupees (₹) directly upon delivery</span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Order Items Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 h-fit">
          <h3 className="font-extrabold text-slate-900 text-base">Produce Summary ({cartItems.length} items)</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.product} className="pt-2 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-800 block truncate">{item.name}</span>
                  <span className="text-slate-400">{item.qty} {item.unit} x ₹{item.price}</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total</span>
              <span className="font-bold">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Direct Farm Delivery</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-2 border-t">
              <span>Total Due</span>
              <span className="text-xl text-emerald-700">₹{cartTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Place Order Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
