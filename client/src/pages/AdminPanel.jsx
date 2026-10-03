import { useState, useEffect } from 'react';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import { Users, Sprout, ShoppingBag, ShieldAlert, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, prodsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/products?limit=100'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (prodsRes.data.success) setProducts(prodsRes.data.products);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleApprove = async (userId, currentStatus) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/approve`, {
        isApproved: !currentStatus,
      });

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isApproved: !currentStatus } : u))
        );
      }
    } catch (error) {
      alert('Failed to update farmer approval status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Remove this product listing from platform?')) return;
    try {
      const { data } = await API.delete(`/admin/products/${productId}`);
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (error) {
      alert('Failed to remove product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const RupeeIcon = () => <span className="font-black text-xl text-emerald-600">₹</span>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrative Control Center
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Krishi Platform Admin Panel</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Users & Kisan ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Produce Listings ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Metrics
          </button>
        </div>
      </div>

      {/* Tab 1: System Metrics */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Platform Revenue"
              value={`₹${stats.totalRevenue}`}
              subtitle="All completed & active orders"
              icon={RupeeIcon}
              color="emerald"
            />
            <StatsCard
              title="Registered Farmers (Kisan)"
              value={stats.totalFarmers}
              subtitle="Produce suppliers"
              icon={Sprout}
              color="amber"
            />
            <StatsCard
              title="Active Customers"
              value={stats.totalCustomers}
              subtitle="Registered buyers"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Total Products Listed"
              value={stats.totalProducts}
              subtitle="Active catalog items"
              icon={ShoppingBag}
              color="purple"
            />
            <StatsCard
              title="Total Orders Placed"
              value={stats.totalOrders}
              subtitle="Platform transactions"
              icon={ShoppingBag}
              color="emerald"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Users Management & Farmer Approvals */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">User Management & Kisan Moderation</h3>
            <span className="text-xs text-slate-400 font-semibold">Total Accounts: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Farm Name / Indian Location</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'farmer'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {u.farmName ? `${u.farmName} (${u.location})` : u.location || 'N/A'}
                    </td>
                    <td className="p-4">
                      {u.isApproved ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border border-amber-200">
                          <XCircle className="w-3 h-3" /> Pending Approval
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role === 'farmer' && (
                        <button
                          onClick={() => handleToggleApprove(u._id, u.isApproved)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                            u.isApproved
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          {u.isApproved ? 'Revoke Approval' : 'Approve Farmer'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Product Listings Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Produce Listings Moderation</h3>
            <span className="text-xs text-slate-400 font-semibold">Total Listings: {products.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Produce</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Kisan (Farmer) & Location</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <strong className="text-slate-900 font-bold">{p.name}</strong>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{p.category}</td>
                    <td className="p-4 text-slate-700 font-semibold">
                      {p.farmer?.farmName || p.farmer?.name || 'Farmer'} ({p.location})
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      ₹{p.price} / {p.unit}
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {p.quantity} {p.unit}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove product listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
