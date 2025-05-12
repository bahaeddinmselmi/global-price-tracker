import React, { useState, useEffect } from 'react';

interface AISearchInterfaceProps {
  isActive: boolean;
  searchTerm?: string;
}

const AISearchInterface: React.FC<AISearchInterfaceProps> = ({ isActive, searchTerm }) => {
  const [status, setStatus] = useState<string>('idle');
  const [currentWebsite, setCurrentWebsite] = useState<string | undefined>();
  const [searchProgress, setSearchProgress] = useState(0);
  const [logs, setLogs] = useState<Array<{type: string, message: string, time: string}>>([]);
  const [aiThoughts, setAiThoughts] = useState<string[]>([]);
  
  useEffect(() => {
    if (isActive) {
      // Reset state when search starts
      setStatus('initializing');
      setSearchProgress(0);
      setLogs([]);
      setAiThoughts([]);
      
      // Start progress animation
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          const newProgress = prev + (Math.random() * 2);
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      // Listen for AI search updates
      const handleSearchUpdate = (event: Event) => {
        if (event instanceof CustomEvent && 'detail' in event) {
          const { status, website } = event.detail;
          setStatus(status);
          setCurrentWebsite(website);
          
          // Add log entry
          const time = new Date().toLocaleTimeString();
          let logType = 'info';
          let message = '';
          
          switch (status) {
            case 'initializing':
              message = 'Initializing AI Search Engine...';
              break;
            case 'analyzing':
              message = 'Analyzing product query with NLP...';
              addAiThought('Performing semantic analysis on query terms...');
              break;
            case 'analyzed':
              message = 'Product analysis complete!';
              addAiThought('Query analyzed. Identified product type, brand, and model.');
              break;
            case 'searching':
              message = 'Searching across e-commerce websites...';
              addAiThought('Identifying relevant websites based on product type and location...');
              break;
            case 'extracting':
              message = `Extracting price data from ${website}...`;
              addAiThought(`Analyzing ${website} DOM structure and applying heuristic pattern matching...`);
              break;
            case 'found':
              logType = 'success';
              message = `Found price data on ${website}!`;
              break;
            case 'not-found':
              logType = 'warning';
              message = `No matching products found on ${website}`;
              break;
            case 'verifying':
              message = 'Verifying data consistency and accuracy...';
              addAiThought('Cross-referencing prices against historical data and market averages...');
              break;
            case 'completed':
              logType = 'success';
              message = 'Search completed successfully!';
              setSearchProgress(100);
              break;
            case 'error':
              logType = 'error';
              message = 'An error occurred during the search process';
              break;
            default:
              message = `Status update: ${status}`;
          }
          
          setLogs(prev => [...prev, { type: logType, message, time }]);
        }
      };
      
      window.addEventListener('ai-search-update', handleSearchUpdate);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('ai-search-update', handleSearchUpdate);
      };
    } else {
      setStatus('idle');
      setSearchProgress(0);
    }
  }, [isActive]);
  
  // Add AI thought bubbles to simulate AI thinking
  const addAiThought = (thought: string) => {
    setAiThoughts(prev => [...prev, thought]);
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header with terminal-like title bar */}
        <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-mono text-sm">
              AI-Search-v2.5.1 ~ {searchTerm ? `"${searchTerm}"` : 'product-search'}
            </h3>
          </div>
          <div className="text-xs text-gray-400">
            <span className="animate-pulse mr-2">●</span>
            {status === 'completed' ? 'IDLE' : 'LIVE'}
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main terminal output */}
          <div className="flex-1 p-3 overflow-auto font-mono text-sm">
            <div className="mb-2">
              <span className="text-green-400">$</span> 
              <span className="text-blue-400"> ai-search</span> 
              <span className="text-gray-400"> --advanced --market=TN </span> 
              <span className="text-yellow-400">{searchTerm}</span>
            </div>
            
            {/* Progress bar */}
            <div className="my-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Search Progress</span>
                <span>{Math.round(searchProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" 
                  style={{ width: `${searchProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Log output */}
            <div className="mt-4">
              {logs.map((log, index) => (
                <div key={index} className="mb-1 flex">
                  <span className="text-gray-500 mr-2">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'warning' ? 'text-yellow-400' : 
                    log.type === 'error' ? 'text-red-400' : 
                    'text-blue-400'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              
              {/* Animated cursor at the end */}
              {status !== 'completed' && (
                <div className="mt-1 flex items-center">
                  <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-white">Searching</span>
                  <span className="inline-block w-4 h-4 ml-1 relative">
                    <span className="absolute inset-0 inline-flex animate-ping opacity-75 h-1 w-1 rounded-full bg-sky-400"></span>
                    <span className="relative rounded-full h-1 w-1 bg-sky-500"></span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* AI thinking sidebar */}
          <div className="w-64 bg-gray-950 border-l border-gray-700 p-3 overflow-auto">
            <div className="text-xs uppercase text-gray-500 mb-2 font-semibold">AI Neural Processing</div>
            <div className="space-y-3">
              {aiThoughts.map((thought, index) => (
                <div 
                  key={index} 
                  className="text-xs bg-gray-800 p-2 rounded border border-gray-700"
                  style={{ 
                    animationDelay: `${index * 0.2}s`, 
                    animation: 'fadeIn 0.5s ease-in-out forwards',
                    opacity: 0 
                  }}
                >
                  <div className="flex items-center mb-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-purple-400 text-[10px]">AI Process {(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                  {thought}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status footer */}
        <div className="bg-gray-800 border-t border-gray-700 p-2 text-xs flex justify-between">
          <span>System: {
            status === 'initializing' ? 'Booting AI search engine...' :
            status === 'analyzing' ? 'Natural Language Processing active' :
            status === 'searching' ? 'Web Crawler deployed' :
            status === 'extracting' ? `Connected to ${currentWebsite}` :
            status === 'verifying' ? 'Data verification in progress' :
            status === 'completed' ? 'Search completed' :
            status === 'error' ? 'Error encountered' :
            'Idle'
          }</span>
          <span className="text-gray-400">Press ESC to close</span>
        </div>
      </div>
      
      {/* Add global styles for animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
};

export default AISearchInterface;
