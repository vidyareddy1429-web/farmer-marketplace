import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import { ShoppingBag, PackageCheck, Clock, PlusCircle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0,
    pendingOrders: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          API.get('/products?farmer=me'),
          API.get('/orders/farmer'),
        ]);

        const myProducts = prodRes.data.products || [];
        const myOrders = orderRes.data.orders || [];

        let totalRevenue = 0;
        let pendingCount = 0;

        myOrders.forEach((ord) => {
          if (ord.status !== 'cancelled') {
            ord.items.forEach((item) => {
              totalRevenue += item.price * item.qty;
            });
          }
          if (ord.status === 'pending') pendingCount++;
        });

        setStats({
          totalSales: totalRevenue,
          totalOrders: myOrders.length,
          activeProducts: myProducts.length,
          pendingOrders: pendingCount,
        });

        const sampleChart = [
          { month: 'Jan', sales: totalRevenue * 0.15 },
          { month: 'Feb', sales: totalRevenue * 0.2 },
          { month: 'Mar', sales: totalRevenue * 0.25 },
          { month: 'Apr', sales: totalRevenue * 0.4 },
        ];
        setChartData(sampleChart);
      } catch (error) {
        console.error('Error fetching farmer dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Custom Rupee icon for stats card
  const RupeeIcon = () => <span className="font-black text-xl text-emerald-600">₹</span>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farmer Sales Dashboard (Kisan Corner)</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time earnings in Rupees (₹) and produce metrics</p>
        </div>

        <Link
          to="/farmer/add-product"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-600/20 flex items-center gap-2 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add Produce Listing
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Harvest Revenue"
          value={`₹${stats.totalSales}`}
          subtitle="Earned from direct customer orders"
          icon={RupeeIcon}
          color="emerald"
        />
        <StatsCard
          title="Incoming Orders"
          value={stats.totalOrders}
          subtitle="Placed by buyers"
          icon={PackageCheck}
          color="blue"
        />
        <StatsCard
          title="Active Produce Listings"
          value={stats.activeProducts}
          subtitle="Listed in catalog"
          icon={ShoppingBag}
          color="amber"
        />
        <StatsCard
          title="Pending Dispatches"
          value={stats.pendingOrders}
          subtitle="Awaiting farmer acceptance"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Recharts Analytics & Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Monthly Revenue Performance (₹)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val) => `₹${Number(val).toFixed(0)}`} />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Quick Shortcuts</h3>
            <p className="text-xs text-slate-400 mt-1">Manage your farm operations efficiently</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/farmer/products"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-xs text-slate-800">Manage Produce Stock</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/farmer/orders"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-xs text-slate-800">Process Customer Orders</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <div className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs space-y-1">
            <strong className="block text-white">Indian Farmer Tip:</strong>
            Keep your farm location updated (district & state) so nearby buyers can easily find your harvest.
          </div>
        </div>
      </div>
    </div>
  );
}
