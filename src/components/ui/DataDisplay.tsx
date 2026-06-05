import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'red' | 'green' | 'amber' | 'purple';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'cyan', 
  pulse = false 
}) => {
  const variants = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    red: 'bg-neon-red/10 text-neon-red border-neon-red/30',
    green: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    amber: 'bg-neon-amber/10 text-neon-amber border-neon-amber/30',
    purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider",
      variants[variant],
      pulse && "animate-pulse-fast shadow-[0_0_8px_rgba(255,51,102,0.3)]"
    )}>
      {children}
    </span>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: 'cyan' | 'red' | 'green' | 'amber';
  icon?: React.ElementType;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subtitle, 
  variant = 'cyan',
  icon: Icon,
  onClick,
  className
}) => {
  const colors = {
    cyan: 'text-neon-cyan shadow-neon-cyan',
    red: 'text-neon-red shadow-neon-red',
    green: 'text-neon-green shadow-neon-green',
    amber: 'text-neon-amber shadow-[0_0_15px_rgba(255,170,0,0.3)]',
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card p-6 flex flex-col gap-2 group",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all",
        variant === 'red' && value !== 0 && "neon-border-red",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-mono font-medium text-dark-600 uppercase tracking-widest">{label}</span>
        {Icon && <Icon className={cn("w-4 h-4", colors[variant])} />}
      </div>
      <div className={cn(
        "text-3xl font-mono font-bold tracking-tighter drop-shadow-sm",
        colors[variant]
      )}>
        {value}
      </div>
      {subtitle && (
        <span className="text-[10px] text-dark-600 font-medium uppercase">{subtitle}</span>
      )}
    </div>
  );
};
