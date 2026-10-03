import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Sprout, ArrowRight, ShieldCheck, Truck, Banknote, MapPin } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?limit=6&sort=newest');
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Vegetables', icon: '🥬', count: 'Sabzi & leafy greens' },
    { name: 'Fruits', icon: '🍎', count: 'Fresh Indian fruits' },
    { name: 'Dairy', icon: '🥛', count: 'Pure Milk, Dahi & Paneer' },
    { name: 'Grains', icon: '🌾', count: 'Basmati Rice & Atta' },
    { name: 'Organic', icon: '🥑', count: '100% Certified organic' },
    { name: 'Spices', icon: '🌶️', count: 'Pure Haldi & Mirch' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-semibold text-emerald-200">
            <Sprout className="w-4 h-4 text-emerald-400" />
            Empowering Indian Farmers • Direct Field to Kitchen
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fresh Indian Harvest, Sold <span className="text-emerald-400">Directly in Rupees (₹)</span>
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg font-normal leading-relaxed">
            Our Kisan set their own fair prices in Rupees. Buy fresh vegetables, fruits, dairy, and grains from farms in Maharashtra, Punjab, Haryana, Andhra & across India.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              Browse Kisan Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=farmer"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all"
            >
              Register as Farmer (Kisan)
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Direct INR (₹) Pricing</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Farmers get 100% of the price in Rupees without middleman commission cuts.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Farmer Location Transparency</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Find produce from your nearby district or state (Nashik, Ludhiana, Guntur, Shimla, etc.).
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Fresh Farm Delivery</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Orders are dispatched directly from agricultural fields preserving peak taste and nutrition.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Explore Produce Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Farm produce categorized fresh from Indian fields</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 text-center transition-all group flex flex-col items-center justify-center gap-2 shadow-sm"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{cat.name}</h4>
              <span className="text-[10px] text-slate-400 line-clamp-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Recent Produce Harvest</h2>
            <p className="text-xs text-slate-500 mt-1">Listed directly by our registered Kisan from various states</p>
          </div>
          <Link
            to="/products"
            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            Explore Catalog
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
