import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Trash2, ArrowRight, MapPin } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-12 bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore fresh produce directly from Indian local farmers and add them to your cart!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20"
        >
          Explore Kisan Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review produce selected directly from Indian farmers</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
        {cartItems.map((item) => (
          <div key={item.product} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {item.location || 'India'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ₹{item.price} per {item.unit}
                </p>
              </div>
            </div>

            {/* Quantity Modifier & Subtotal */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => updateQuantity(item.product, item.qty - 1)}
                  className="w-7 h-7 text-slate-600 font-bold hover:bg-slate-200 rounded-lg text-xs"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.product, item.qty + 1)}
                  className="w-7 h-7 text-slate-600 font-bold hover:bg-slate-200 rounded-lg text-xs"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-24">
                <span className="text-xs text-slate-400 block font-medium">Line Total</span>
                <span className="font-extrabold text-emerald-700 text-base">
                  ₹{item.price * item.qty}
                </span>
              </div>

              <button
                onClick={() => removeFromCart(item.product)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 max-w-md ml-auto">
        <h3 className="font-extrabold text-slate-900 text-lg">Order Summary</h3>

        <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">₹{cartTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Direct Farm Delivery Fee</span>
            <span className="font-bold text-emerald-600">FREE</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-base font-extrabold text-slate-900">
          <span>Total Amount</span>
          <span className="text-2xl text-emerald-700">₹{cartTotal}</span>
        </div>

        <button
          onClick={handleCheckoutClick}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 transition-all"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          to="/products"
          className="block text-center text-xs font-bold text-slate-500 hover:text-emerald-600 pt-1"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
