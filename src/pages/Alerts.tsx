import React from 'react';
import { motion } from 'framer-motion';
import { useFlows } from '../hooks/useData';
import { Badge } from '../components/ui/DataDisplay';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

const Alerts: React.FC = () => {
  const { data: flows } = useFlows(2000);
  const queryClient = useQueryClient();
  
  const activeThreats = flows?.filter((f: any) => f.label !== '0') || [];

  const resolveThreat = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/flow/${id}/resolve/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Optimistic update
        queryClient.setQueryData(['recentFlows'], (old: any) => old?.filter((f: any) => f.id !== id));
      }
    } catch (err) {
      console.error('Failed to resolve threat:', err);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-30 flex justify-between items-center bg-dark-900/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-dark-700/50 mb-4">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white tracking-tight uppercase">THREAT ADVISORY PANEL</h2>
          <p className="text-dark-600 text-xs font-mono mt-1">REAL-TIME INTRUSION ALERTS • CRITICAL INCIDENTS</p>
        </div>
      </header>

      <div className="pt-16 space-y-8">

      {/* Hero Banner */}
      {activeThreats.length > 0 ? (
        <div className="bg-neon-red/10 border border-neon-red/30 rounded-2xl p-8 flex items-center justify-between shadow-neon-red/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-red/10 blur-[100px] -z-10" />
          <div className="flex items-center gap-6">
            <div className="p-4 bg-neon-red rounded-2xl animate-pulse shadow-neon-red">
              <AlertOctagon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-mono font-bold text-neon-red tracking-tighter">
                {activeThreats.length} ACTIVE THREATS DETECTED
              </h3>
              <p className="text-slate-400 font-mono text-sm mt-1 uppercase tracking-widest">Immediate action recommended for critical nodes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-dark-600 uppercase">System Status</div>
            <div className="text-neon-red font-mono font-bold text-xl">CRITICAL</div>
          </div>
        </div>
      ) : (
        <div className="bg-neon-green/10 border border-neon-green/30 rounded-2xl p-8 flex items-center justify-between shadow-neon-green/20">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-neon-green rounded-2xl shadow-neon-green">
              <ShieldCheck className="w-10 h-10 text-dark-900" />
            </div>
            <div>
              <h3 className="text-4xl font-mono font-bold text-neon-green tracking-tighter uppercase">
                No Threats Detected
              </h3>
              <p className="text-slate-400 font-mono text-sm mt-1 uppercase tracking-widest">Network environment is stable and secure</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-dark-600 uppercase">System Status</div>
            <div className="text-neon-green font-mono font-bold text-xl">SECURE</div>
          </div>
        </div>
      )}

      {/* Threat Cards Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activeThreats.map((threat: any) => (
          <motion.div 
            variants={item}
            key={threat.id} 
            className="glass-card p-6 border-neon-red/30 shadow-neon-red/10 relative group hover:border-neon-red/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="w-16 h-16 text-neon-red" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <Badge variant="red" pulse>{threat.label}</Badge>
              <span className="text-[10px] font-mono text-dark-600 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(threat.start_time), { addSuffix: true })}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-mono text-dark-600 uppercase flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" /> Originating IP
                </div>
                <div className="text-xl font-mono font-bold text-white tracking-tight">{threat.src_ip}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-mono text-dark-600 uppercase mb-1">Target IP:Port</div>
                  <div className="text-sm font-mono text-slate-300 truncate">{threat.dst_ip}:{threat.dst_port}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-dark-600 uppercase mb-1">Payload</div>
                  <div className="text-sm font-mono text-slate-300">{(threat.byte_count / 1024).toFixed(1)} KB</div>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-700">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[10px] font-mono text-dark-600 uppercase">Detection Confidence</div>
                  <div className="text-xs font-mono font-bold text-neon-red">{threat.confidence > 0 ? `${(threat.confidence * 100).toFixed(0)}%` : 'N/A'}</div>
                </div>
                <div className="w-full h-1 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-red shadow-neon-red" style={{ width: `${threat.confidence * 100}%` }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => resolveThreat(threat.id)}
              className="w-full mt-6 py-2 bg-neon-red/10 hover:bg-neon-red/20 border border-neon-red/30 rounded-lg text-neon-red text-[10px] font-mono font-bold uppercase tracking-widest transition-all"
            >
              MARK RESOLVED
            </button>
          </motion.div>
        ))}

        {activeThreats.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-dark-700 rounded-2xl">
            <ShieldCheck className="w-16 h-16 text-dark-700 mb-4" />
            <h4 className="text-xl font-mono font-bold text-dark-600">ZERO ACTIVE THREATS</h4>
            <p className="text-dark-600 text-xs font-mono mt-2">Continuous scanning in progress...</p>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default Alerts;
