import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Database, 
  HeartPulse, 
  Bell, 
  ShieldAlert 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Live Flows', path: '/live' },
  { icon: Database, label: 'Flow History', path: '/history' },
  { icon: HeartPulse, label: 'Network Health', path: '/health' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
];

interface SidebarProps {
  threatCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ threatCount = 0 }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-700 z-40 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
          <div>
            <h1 className="font-mono font-bold text-xl tracking-tight text-white">SHIELD<span className="text-neon-cyan">NET</span></h1>
            <p className="text-[10px] text-dark-600 font-mono">v1.0.4 ACTIVE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-neon-cyan/10 text-neon-cyan border-l-2 border-neon-cyan shadow-[inset_0_0_20px_rgba(0,245,255,0.05)]" 
                : "text-dark-600 hover:text-slate-300 hover:bg-dark-800"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              "group-hover:text-neon-cyan"
            )} />
            <span className="font-medium text-sm truncate">{item.label}</span>
            {item.label === 'Alerts' && threatCount > 0 && (
              <span className="ml-auto bg-neon-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-neon-red">
                {threatCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-dark-700 bg-dark-900/50">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-neon-green" />
            <span className="text-xs font-mono text-dark-600">ENGINE ONLINE</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-dark-600 font-mono">
              <span>CPU LOAD</span>
              <span>14%</span>
            </div>
            <div className="w-full h-1 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan w-[14%]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
