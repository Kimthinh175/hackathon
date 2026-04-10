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
      <Sidebar userRole="Staff" />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header Component */}
        <Topbar userRole="Staff" />

        {/* Dynamic Page Views */}
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
