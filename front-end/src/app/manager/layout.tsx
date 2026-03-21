import React from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="app-container">
      {/* Sidebar Component */}
      <Sidebar roleBasePath="/manager" />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header Component */}
        <Topbar userRole="Manager" />

        {/* Dynamic Page Views */}
        <div className="content-area p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
