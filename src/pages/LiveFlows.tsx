import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFlows } from '../hooks/useData';
import { Badge } from '../components/ui/DataDisplay';
import { cn } from '../lib/utils';
import { 
  Search
} from 'lucide-react';

const LiveFlows: React.FC = () => {
  const { data: flows } = useFlows(2000);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProto, setFilterProto] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const filteredFlows = flows?.filter((flow: any) => {
    const matchesSearch = flow.src_ip.includes(searchTerm) || flow.dst_ip.includes(searchTerm);
    const matchesProto = filterProto === 'All' || flow.protocol === filterProto;
    const matchesType = filterType === 'All' || 
                       (filterType === 'Benign' && flow.label === '0') || 
                       (filterType === 'Threats' && flow.label !== '0');
    return matchesSearch && matchesProto && matchesType;
  });

  return (
    <div className="relative">
      <header className="sticky top-0 z-30 flex justify-between items-center bg-dark-900/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-dark-700/50 mb-4">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white tracking-tight uppercase flex items-center gap-3">
            LIVE NETWORK STREAMS <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-neon-green" />
          </h2>
          <p className="text-dark-600 text-xs font-mono mt-1">REAL-TIME PACKET ANALYSIS • POLLING: 2.0s</p>
        </div>
      </header>

      <div className="pt-16 space-y-6">
        {/* Filter Bar */}
        <div className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600" />
            <input 
              type="text" 
              placeholder="Search by IP address..." 
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-slate-300 focus:outline-none focus:border-neon-cyan/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-dark-900 border border-dark-700 rounded-lg p-1">
            {['All', 'TCP', 'UDP', 'TCP6', 'UDP6'].map((proto) => (
              <button
                key={proto}
                onClick={() => setFilterProto(proto)}
                className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  filterProto === proto ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-dark-600 hover:text-slate-400'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-dark-900 border border-dark-700 rounded-lg p-1">
            {['All', 'Benign', 'Threats'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  filterType === type ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-dark-600 hover:text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-700">
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest"># ID</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Source IP</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Target IP:Port</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Protocol</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Traffic</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Classification</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {filteredFlows?.map((flow: any) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={flow.id} 
                    className={`group transition-colors ${
                      flow.label !== '0' ? 'bg-neon-red/5' : 'hover:bg-dark-800/40'
                    }`}
                  >
                    <td className="px-6 py-4 text-xs font-mono text-dark-600">{flow.id}</td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-300">{flow.src_ip}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      <span className="text-slate-300 font-bold">{flow.dst_ip}</span>
                      <span className="text-dark-600">:{flow.dst_port}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={flow.protocol.includes('6') ? 'purple' : (flow.protocol === 'TCP' ? 'cyan' : 'amber')}>
                        {flow.protocol}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-slate-300">{flow.packet_count} PKTS</span>
                        <span className="text-[9px] font-mono text-dark-600">{(flow.byte_count / 1024).toFixed(1)} KB</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-dark-600">{flow.duration.toFixed(3)}s</td>
                    <td className="px-6 py-4">
                      <Badge variant={flow.label === '0' ? 'green' : 'red'} pulse={flow.label !== '0'}>
                        {flow.label === '0' ? 'BENIGN' : flow.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-16 h-1 bg-dark-700 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", flow.confidence > 0.8 ? "bg-neon-green" : "bg-neon-amber")} 
                            style={{ width: `${flow.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-dark-600">{(flow.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFlows;
