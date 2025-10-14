import { useStore } from '@/stores';
import { useLocation } from 'react-router-dom';

export function TopBar() {
  const { workspace, status } = useStore();
  const location = useLocation();
  
  // Extract section name from the URL
  const currentPath = location.pathname.split('/')[1] || 'overview';
  const sectionName = currentPath.toUpperCase();

  return (
    <header className="flex min-h-16 items-center justify-between bg-indigo-700 px-4 shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Icon (opcional para mobile) */}
        <button 
          className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-indigo-600 md:hidden"
          aria-label="Toggle navigation"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="text-white">
          <div className="text-lg font-medium">Legacy Workspace Console</div>
          <div className="text-sm text-indigo-200">Section: {sectionName}</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-white">
        {/* Loading Indicator */}
        {status.isLoading && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Syncing state</span>
          </div>
        )}

        {/* Maintenance Mode */}
        {workspace.maintenanceMode && !status.isLoading && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Maintenance mode</span>
          </div>
        )}

        {/* Timestamp */}
        {workspace.lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-indigo-200">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>
              Updated {new Date(workspace.lastUpdated).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}