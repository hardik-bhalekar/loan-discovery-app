import { Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">LoanSmart</span>
          </div>

          <div className="flex items-center gap-6">
            {['About', 'Privacy', 'Contact'].map((item) => (
              <span key={item} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              GitHub
            </a>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LoanSmart
          </p>
        </div>
      </div>
    </footer>
  );
}
