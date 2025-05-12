import React from 'react';
import { Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Globe size={28} className="mr-2 text-white" />
          <h1 className="text-xl font-bold">GlobalPriceTracker</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li className="hidden md:block">
              <a 
                href="#" 
                className="text-white hover:text-blue-200 transition-colors"
              >
                How It Works
              </a>
            </li>
            <li className="hidden md:block">
              <a 
                href="#" 
                className="text-white hover:text-blue-200 transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="bg-white text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;