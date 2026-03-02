'use client';

import { useState } from 'react';
import SessionList from '@/components/SessionList';
import SessionDetail from '@/components/SessionDetail';
import MobileHeader from '@/components/MobileHeader';
import { StorageProvider, useStorageContext } from '@/contexts/StorageContext';

function HomeContent() {
  const { currentSession } = useStorageContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={handleToggleMenu}
        currentTitle={currentSession?.title}
      />

      <div className="flex">
        {/* Sidebar (SessionList) */}
        <div
          data-testid="sidebar-container"
          className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            pt-16 md:pt-0
          `}
        >
          <SessionList onCreateNew={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div
            data-testid="sidebar-backdrop"
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={handleToggleMenu}
          />
        )}

        {/* Main Content (SessionDetail) */}
        <div
          data-testid="main-content"
          className="flex-1 min-w-0"
        >
          <SessionDetail />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <StorageProvider>
      <HomeContent />
    </StorageProvider>
  );
}
