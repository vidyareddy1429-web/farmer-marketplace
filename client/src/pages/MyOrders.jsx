import { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Package, Calendar, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my');
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to load customer orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Orders Placed Yet</h2>
        <p className="text-xs text-slate-500">
          When you purchase produce directly from Indian farmers, your order tracking history will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Order History</h1>
        <p className="text-xs text-slate-500 mt-1">Track status updates for your direct produce purchases in Rupees (₹)</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <div className="truncate text-xs">
                        <span className="font-bold text-slate-800 block truncate">{item.name}</span>
                        <span className="text-slate-500">
                          {item.qty} {item.unit} x ₹{item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider">Delivery Details</h4>
                <p className="text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.zip}
                  </span>
                </p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{order.address?.phone}</span>
                </p>
                <div className="pt-2 text-[11px] text-slate-500 font-semibold border-t border-slate-200">
                  Payment: <span className="text-slate-800">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
