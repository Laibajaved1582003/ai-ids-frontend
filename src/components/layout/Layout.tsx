import React from 'react';
import Sidebar from './Sidebar';
import { useFlows } from '../../hooks/useData';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: flows } = useFlows(2000);
  const threatCount = flows?.filter((f: any) => f.label !== '0').length || 0;

  return (
    <div className="flex flex-row w-full min-h-screen bg-dark-900 text-slate-200">
      <Sidebar threatCount={threatCount} />
      <main className="flex-1 flex flex-col ml-64 min-h-screen relative overflow-x-hidden overflow-y-auto">
        <div className="scanline" />
        <div className="p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
