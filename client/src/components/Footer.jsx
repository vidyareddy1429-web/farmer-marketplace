import { Sprout, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">FarmDirect</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering farmers to list fresh produce directly and helping customers access farm-fresh food without middlemen markups.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">
                  Browse Produce
                </Link>
              </li>
              <li>
                <Link to="/register?role=farmer" className="hover:text-emerald-400 transition-colors">
                  Sell as a Farmer
                </Link>
              </li>
              <li>
                <Link to="/register?role=customer" className="hover:text-emerald-400 transition-colors">
                  Customer Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=Vegetables" className="hover:text-emerald-400">Vegetables</Link></li>
              <li><Link to="/products?category=Fruits" className="hover:text-emerald-400">Fresh Fruits</Link></li>
              <li><Link to="/products?category=Dairy" className="hover:text-emerald-400">Farm Dairy</Link></li>
              <li><Link to="/products?category=Grains" className="hover:text-emerald-400">Organic Grains</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FarmDirect Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for sustainable agriculture.
          </p>
        </div>
      </div>
    </footer>
  );
}
