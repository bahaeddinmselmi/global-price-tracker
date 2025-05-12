import React, { useState, useEffect } from 'react';

interface BrowserSimulationIndicatorProps {
  isActive: boolean;
  website?: string;
}

const BrowserSimulationIndicator: React.FC<BrowserSimulationIndicatorProps> = ({ isActive, website }) => {
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (isActive && website) {
      // Reset progress when website changes
      setProgress(0);
      
      // Simulate page loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isActive, website]);
  
  // Set search query based on website
  useEffect(() => {
    if (website === 'Google') {
      setSearchQuery('product price in Tunisia');
    } else if (website) {
      setSearchQuery('product');
    }
  }, [website]);
  
  if (!isActive) return null;
  
  // Determine favicon based on website
  const getFavicon = () => {
    if (!website) return null;
    
    if (website === 'Google') {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#fff"/>
          <path d="M9.273 14.341v-2.364h7.909c.116.466.182.952.182 1.455 0 1.636-.447 3.068-1.341 4.091-.995 1.136-2.564 1.75-4.296 1.75-3.409 0-6.295-2.773-6.295-6.182S8.319 6.91 11.727 6.91c1.864 0 3.182.682 4.182 1.568l-1.636 1.636c-.682-.636-1.591-1.136-2.546-1.136-2.091 0-3.727 1.682-3.727 3.773s1.636 3.773 3.727 3.773c1.364 0 2.136-.545 2.636-1.045.409-.409.682-1 .773-1.818h-3.409v-.001z" fill="#4285F4"/>
          <path d="M20.455 14.341c0 .5-.045.909-.136 1.273h-8.591v-2.364h7.909c.116.466.182.952.182 1.455-.001-.121.636-.364.636-.364z" fill="#34A853"/>
          <path d="M11.727 19.273c-3.409 0-6.295-2.773-6.295-6.182s2.886-6.182 6.295-6.182c1.864 0 3.182.682 4.182 1.568l-1.636 1.636c-.682-.636-1.591-1.136-2.546-1.136-2.091 0-3.727 1.682-3.727 3.773s1.636 3.773 3.727 3.773c1.364 0 2.136-.545 2.636-1.045.409-.409.682-1 .773-1.818h-3.409v-2.364h7.909c.116.466.182.952.182 1.455 0 1.636-.447 3.068-1.341 4.091-.995 1.137-2.564 1.75-4.296 1.75l-.249.001z" fill="#EA4335"/>
        </svg>
      );
    } else if (website.includes('Jumia')) {
      return <div className="w-4 h-4 bg-orange-500 rounded-full"></div>;
    } else if (website.includes('Tunisianet')) {
      return <div className="w-4 h-4 bg-blue-600 rounded-full"></div>;
    } else if (website.includes('Mytek')) {
      return <div className="w-4 h-4 bg-red-600 rounded-full"></div>;
    } else if (website.includes('Tayara')) {
      return <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>;
    } else {
      return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-300 max-w-md z-50 overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-gray-200 p-2 flex items-center space-x-2 border-b border-gray-300">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        {/* Address bar */}
        <div className="flex-1 bg-white rounded-md py-1 px-2 text-xs flex items-center">
          {getFavicon()}
          <span className="ml-2 truncate text-gray-600">
            {website === 'Google' 
              ? 'https://www.google.com/search?q=...' 
              : website 
                ? `https://www.${website.toLowerCase().replace(' ', '')}.com.tn/search?q=...` 
                : 'https://...'}
          </span>
        </div>
        
        <div className="flex space-x-1">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v1h10V3a1 1 0 112 0v1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2V3a1 1 0 011-1zm11 14a1 1 0 100-2H5a1 1 0 100 2h10z" clipRule="evenodd" />
          </svg>
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Progress bar */}
      {progress < 100 && (
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Browser content */}
      <div className="p-4">
        {website === 'Google' ? (
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.18 10.382c0-.766-.066-1.532-.207-2.278H11.27v4.318h6.129c-.263 1.451-1.064 2.684-2.273 3.503v2.879h3.67c2.153-1.986 3.384-4.915 3.384-8.422z" fill="#4285F4"/>
                <path d="M11.27 22.5c3.071 0 5.654-1.014 7.543-2.746l-3.67-2.879c-1.023.701-2.343 1.105-3.873 1.105-2.976 0-5.494-2.01-6.394-4.714H1.031v2.957C2.951 20.051 6.884 22.5 11.27 22.5z" fill="#34A853"/>
                <path d="M4.875 13.266a7.034 7.034 0 01-.384-2.266c0-.79.141-1.556.384-2.266V5.777H1.031A11.964 11.964 0 000 11c0 1.936.464 3.77 1.275 5.389l3.6-3.123z" fill="#FBBC05"/>
                <path d="M11.27 4.02c1.677 0 3.186.58 4.374 1.715l3.193-3.193C16.97.934 14.387 0 11.27 0 6.884 0 2.951 2.449 1.031 6.177l3.844 2.989c.9-2.704 3.418-4.714 6.394-4.714z" fill="#EA4335"/>
              </svg>
              <div className="relative w-full">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 text-sm" 
                  value={searchQuery}
                  readOnly
                />
                <svg className="absolute right-3 top-2 w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 animate-pulse">
              Searching for product prices in Tunisia...
            </div>
          </div>
        ) : website ? (
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-sm">{website}</div>
              <div className="text-xs text-gray-500">www.{website.toLowerCase().replace(' ', '')}.com.tn</div>
            </div>
            <div className="relative w-full mb-3">
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-sm py-1 px-3 pr-8 text-sm" 
                value={searchQuery}
                readOnly
              />
              <svg className="absolute right-2 top-1.5 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-gray-600 animate-pulse">
              Searching for products and extracting prices...
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800">Browser Simulation</h3>
              <p className="text-sm text-gray-600">Preparing to search Tunisian websites...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserSimulationIndicator;
