import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function FarmerAddEditProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    location: user?.location || 'Nashik, Maharashtra',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await API.get(`/products/${id}`);
          if (data.success) {
            const p = data.product;
            setFormData({
              name: p.name,
              category: p.category,
              price: p.price,
              quantity: p.quantity,
              unit: p.unit || 'kg',
              description: p.description || '',
              location: p.location || '',
              image: p.image || '',
            });
          }
        } catch (err) {
          setError('Failed to fetch product details');
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('category', formData.category);
      body.append('price', formData.price);
      body.append('quantity', formData.quantity);
      body.append('unit', formData.unit);
      body.append('description', formData.description);
      body.append('location', formData.location);
      if (formData.image) body.append('image', formData.image);
      if (imageFile) body.append('imageFile', imageFile);

      let res;
      if (isEdit) {
        res = await API.put(`/products/${id}`, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await API.post('/products', body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        navigate('/farmer/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link to="/farmer/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4" /> Back to My Produce Listings
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isEdit ? 'Edit Produce Listing' : 'List New Produce (Kisan Market)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Set price in Indian Rupees (₹) and enter your farm location</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Produce Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Desi Organic Tomatoes / Palak"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                <option value="Vegetables">Vegetables (Sabzi)</option>
                <option value="Fruits">Fruits (Phal)</option>
                <option value="Dairy">Dairy (Milk/Paneer)</option>
                <option value="Grains">Grains (Rice/Wheat)</option>
                <option value="Organic">Organic</option>
                <option value="Spices">Spices (Masala)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measurement</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (liter)</option>
                <option value="dozen">Dozen (dozen)</option>
                <option value="piece">Piece / Item</option>
                <option value="gram">Gram (g)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price per {formData.unit} (in Rupees ₹)</label>
              <input
                type="number"
                name="price"
                step="1"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="40"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Stock ({formData.unit})</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="200"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Location (District, State)</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Nashik, Maharashtra"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Produce Image</label>
            <div className="space-y-2">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or image link"
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Or Upload File:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Harvest Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe farming practices, natural inputs, organic quality..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            ></textarea>
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
                <Save className="w-4 h-4" /> {isEdit ? 'Update Listing' : 'Publish Listing'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
