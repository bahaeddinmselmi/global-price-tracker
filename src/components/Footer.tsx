import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white">GlobalPriceTracker</h3>
            <p className="text-sm mt-1">Compare product prices worldwide</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row md:space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-white mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="hover:text-white mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GlobalPriceTracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;