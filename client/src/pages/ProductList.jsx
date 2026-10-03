import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter, MapPin, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic', 'Spices', 'Other'];
  const popularLocations = ['All Locations', 'Hyderabad', 'Telangana', 'Andhra Pradesh', 'Guntur', 'Karnataka', 'Rangareddy', 'Nizamabad'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (location && location !== 'All Locations') params.append('location', location);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 9);

      const { data } = await API.get(`/products?${params.toString()}`);
      if (data.success) {
        setProducts(data.products);
        setTotalCount(data.count);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error('Error loading products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, location, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Rythu Bazaar Produce Market</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <strong className="text-emerald-600">{totalCount}</strong> farm-fresh produce items with authentic Mandi rates in ₹
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tomatoes, Sona Masoori, chili..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Location Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mr-2 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Location Filter:
          </span>
          {popularLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocation(loc === 'All Locations' ? '' : loc);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 border ${
                (location === loc || (loc === 'All Locations' && !location))
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            {(search || category !== 'All' || location || sort !== 'newest') && (
              <button
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="newest">Newest Harvest</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="text-4xl">🌾</div>
          <h3 className="font-bold text-lg text-slate-800">No produce matching your location or search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching to 'All Locations' or clearing keyword filters to view all South Indian farm harvest listings.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
