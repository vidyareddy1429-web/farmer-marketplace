import { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Package, Calendar, MapPin, Phone, CheckCircle, Truck, PackageCheck, XCircle } from 'lucide-react';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchFarmerOrders = async () => {
    try {
      const { data } = await API.get('/orders/farmer');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to load incoming farmer orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data } = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Incoming Customer Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Accept, process, and dispatch orders placed for your produce in ₹</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          {['all', 'pending', 'accepted', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="text-4xl">📦</div>
          <h3 className="font-bold text-lg text-slate-800">No incoming orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Orders matching the selected status filter will be displayed here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const farmerItemsTotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <span>Buyer: <strong className="text-slate-700 font-semibold">{order.customer?.name}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Produce Revenue</span>
                      <span className="text-xl font-extrabold text-emerald-700">
                        ₹{farmerItemsTotal}
                      </span>
                    </div>

                    {/* Quick Status Action Controls */}
                    <div className="flex items-center gap-1.5">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'accepted')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </button>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'shipped')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" /> Dispatch
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Mark Delivered
                        </button>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          title="Cancel order & restore stock"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Ordered Produce</h4>
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
                          <div className="text-xs">
                            <strong className="text-slate-900 font-bold block">{item.name}</strong>
                            <span className="text-slate-500">
                              {item.qty} {item.unit} x ₹{item.price} = ₹{item.qty * item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider">Delivery Address</h4>
                    <p className="text-slate-700 flex items-start gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.zip}
                      </span>
                    </p>
                    <p className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{order.address?.phone} ({order.customer?.name})</span>
                    </p>
                    <div className="pt-2 text-[11px] text-slate-500 font-semibold border-t border-slate-200">
                      Payment Mode: <span className="text-slate-800">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
