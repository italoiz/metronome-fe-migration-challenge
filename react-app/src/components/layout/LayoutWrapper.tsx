import { TopBar } from './TopBar';
import { SideMenu } from './SideMenu';
import type { ReactNode } from 'react';
import { useStore } from '@/stores';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { status } = useStore();

  return (
    <div className="w-full inline-flex min-h-screen flex-col bg-gray-50">
      {/* Top Bar */}
      <TopBar />

      {/* Body with Sidebar and Content */}
      <div className="flex flex-grow flex-shrink min-h-0">
        {/* Side Menu */}
        <SideMenu />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Progress Bar (when loading) */}
          {status.isLoading && (
            <div className="h-1 w-full overflow-hidden bg-gray-200">
              <div className="h-full w-full origin-left animate-progress bg-indigo-600" />
            </div>
          )}
          
          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}