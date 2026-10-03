import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit3, Trash2, MapPin } from 'lucide-react';

export default function FarmerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmerProducts = async () => {
    try {
      const { data } = await API.get('/products');
      if (data.success) {
        const myProds = data.products.filter(
          (p) => p.farmer?._id === user._id || p.farmer === user._id
        );
        setProducts(myProds);
      }
    } catch (error) {
      console.error('Failed to load farmer products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProducts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this produce listing?')) return;
    try {
      const { data } = await API.delete(`/products/${id}`);
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Farm Produce Listings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage prices in ₹ (INR), stock, and farm location</p>
        </div>

        <Link
          to="/farmer/add-product"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Produce
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="text-4xl">🧑‍🌾</div>
          <h3 className="font-bold text-lg text-slate-800">No produce listed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Start listing your farm produce so buyers can place direct orders!
          </p>
          <Link
            to="/farmer/add-product"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            <PlusCircle className="w-4 h-4" /> Add First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Produce</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₹) / Unit</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Farm Location</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <div>
                        <strong className="text-slate-900 font-bold block">{prod.name}</strong>
                        <span className="text-[10px] text-slate-400">ID: #{prod._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-[11px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      ₹{prod.price} / {prod.unit}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          prod.quantity > 0 ? 'text-slate-900' : 'text-red-600'
                        }`}
                      >
                        {prod.quantity} {prod.unit}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {prod.location}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/farmer/edit-product/${prod._id}`}
                        className="p-2 inline-flex text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        title="Edit produce"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-2 inline-flex text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete produce"
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
