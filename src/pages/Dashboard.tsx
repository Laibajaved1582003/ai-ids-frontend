import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useStats, 
  useFlows 
} from '../hooks/useData';
import { StatCard, Badge } from '../components/ui/DataDisplay';
import { cn } from '../lib/utils';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  ArrowUpRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { data: stats } = useStats();
  const { data: flows } = useFlows(2000);
  const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);

  const activeThreats = flows?.filter((f: any) => f.label !== '0') || [];

  const protocolColors: Record<string, string> = {
    TCP: '#00f5ff',
    UDP: '#ffaa00',
    TCP6: '#bf5fff',
    UDP6: '#9933ff',
  };

  const attackColors = ['#00ff88', '#ff3366', '#ffaa00', '#bf5fff', '#00f5ff'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative"
    >
      <header className="sticky top-0 z-30 flex justify-between items-end bg-dark-900/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-dark-700/50 mb-4">
        <div>
          <h2 className="text-3xl font-mono font-bold text-white tracking-tight uppercase">
            NETWORK IDS MONITOR<span className="animate-pulse">▋</span>
          </h2>
          <p className="text-dark-600 text-sm font-mono">SECURE NODE: 192.168.100.1 • SYSTEM READY</p>
        </div>
        <div className="flex items-center gap-4 bg-dark-800/50 px-4 py-2 rounded-lg border border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-neon-green" />
            <span className="text-[10px] font-mono text-dark-600 uppercase">Live Feed Active</span>
          </div>
        </div>
      </header>

      <div className="pt-16 space-y-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Flows Detected" 
            value={stats?.total_flows || 0} 
            variant="cyan"
            icon={Activity}
            subtitle="All Captured Traffic"
          />
          <StatCard 
            label="Threats Detected" 
            value={stats?.threat_count || 0} 
            variant="red"
            icon={ShieldAlert}
            onClick={() => setIsThreatModalOpen(true)}
            subtitle={`${((stats?.threat_count || 0) / (stats?.total_flows || 1) * 100).toFixed(1)}% of total traffic`}
          />
          <StatCard 
            label="Benign Flows" 
            value={stats?.benign_count || 0} 
            variant="green"
            icon={ShieldCheck}
            subtitle="Validated Safe"
          />
          <StatCard 
            label="Active Protocols" 
            value={Object.keys(stats?.protocol_breakdown || {}).length} 
            variant="amber"
            icon={Cpu}
            subtitle={Object.keys(stats?.protocol_breakdown || {}).join(', ')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6">
            <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6 flex items-center gap-2">
              Traffic Timeline <ArrowUpRight className="w-3 h-3" />
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.flows_over_time || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2845" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#333d5c" 
                    fontSize={10} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#333d5c" 
                    fontSize={10} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1628', borderColor: '#1c2845', color: '#00f5ff', borderRadius: '8px' }}
                    itemStyle={{ color: '#00f5ff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00f5ff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Attack Distribution */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6">Attack Distribution</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(stats?.label_breakdown || {}).map(([name, value]) => ({ 
                      name: name === '0' ? 'Benign' : name, 
                      value 
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(stats?.label_breakdown || {}).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={attackColors[index % attackColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1628', border: 'none', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(stats?.label_breakdown || {}).map(([name, value], index) => (
                <div key={name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: attackColors[index % attackColors.length] }} />
                    <span className="text-xs font-mono text-slate-400">{name === '0' ? 'Benign' : name}</span>
                  </div>
                  <span className="text-xs font-mono text-dark-600">{value as number}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Flow Feed */}
          <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono font-bold text-dark-600 uppercase flex items-center gap-2">
                Live Flow Feed <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              </h3>
              <span className="text-[10px] font-mono text-dark-600">Last 20 records</span>
            </div>
            <div className="overflow-hidden">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {flows?.map((flow: any) => (
                  <div key={flow.id} className="flex items-center justify-between p-3 bg-dark-900/40 rounded-lg border border-dark-700/50 hover:border-dark-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-1 h-8 rounded-full",
                        flow.label === '0' ? "bg-neon-green" : "bg-neon-red shadow-neon-red"
                      )} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-300">{flow.src_ip}</span>
                          <span className="text-[10px] text-dark-600">→</span>
                          <span className="text-xs font-mono font-bold text-slate-300">{flow.dst_ip}:{flow.dst_port}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={flow.protocol.includes('6') ? 'purple' : (flow.protocol === 'TCP' ? 'cyan' : 'amber')}>
                            {flow.protocol}
                          </Badge>
                          <span className="text-[10px] font-mono text-dark-600">
                            {formatDistanceToNow(new Date(flow.start_time), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={flow.label === '0' ? 'green' : 'red'} pulse={flow.label !== '0'}>
                        {flow.label === '0' ? 'BENIGN' : flow.label}
                      </Badge>
                      <div className="mt-1 flex items-center gap-1 justify-end">
                        <div className="w-16 h-1 bg-dark-700 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", flow.confidence > 0.8 ? "bg-neon-green" : "bg-neon-amber")} 
                            style={{ width: `${flow.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-dark-600">{(flow.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Protocol Distribution */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6">Protocol Analysis</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(stats?.protocol_breakdown || {}).map(([name, value]) => ({ name, value }))}
                  layout="vertical"
                  margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2845" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#333d5c" 
                    fontSize={12} 
                    fontFamily="JetBrains Mono"
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1628', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#00f5ff" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {Object.entries(stats?.protocol_breakdown || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={protocolColors[entry[0]] || '#00f5ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Threat Detail Modal */}
      <AnimatePresence>
        {isThreatModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsThreatModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-red/10 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-neon-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Active Threat Analysis</h3>
                    <p className="text-dark-600 text-[10px] font-mono">CRITICAL INCIDENT LOG • REAL-TIME AUDIT</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsThreatModalOpen(false)}
                  className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-dark-600" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {activeThreats.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-dark-900/50 border-b border-dark-700">
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Threat Type</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Source</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Destination</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Protocol</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Packets / Bytes</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Duration</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Confidence</th>
                        <th className="px-4 py-3 text-[10px] font-mono text-dark-600 uppercase">Detected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50">
                      {activeThreats.map((threat: any) => (
                        <tr key={threat.id} className="hover:bg-neon-red/5 transition-colors group">
                          <td className="px-4 py-4">
                            <Badge variant="red">{threat.label}</Badge>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-slate-300">
                            {threat.src_ip}:{threat.src_port}
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-slate-300">
                            {threat.dst_ip}:{threat.dst_port}
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={threat.protocol.includes('6') ? 'purple' : (threat.protocol === 'TCP' ? 'cyan' : 'amber')}>
                              {threat.protocol}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-[10px] font-mono text-dark-600">
                            {threat.packet_count} PKT / {(threat.byte_count / 1024).toFixed(1)} KB
                          </td>
                          <td className="px-4 py-4 text-[10px] font-mono text-slate-400">
                            {threat.duration.toFixed(2)}s
                          </td>
                          <td className="px-4 py-4 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-red" style={{ width: `${threat.confidence * 100}%` }} />
                              </div>
                              <span className="text-[9px] font-mono text-dark-600">{threat.confidence > 0 ? `${(threat.confidence * 100).toFixed(0)}%` : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[10px] font-mono text-dark-600">
                            {formatDistanceToNow(new Date(threat.start_time), { addSuffix: true })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <ShieldCheck className="w-16 h-16 text-neon-green opacity-20" />
                    <h4 className="text-xl font-mono font-bold text-neon-green uppercase tracking-widest">No Active Threats</h4>
                    <p className="text-dark-600 text-xs font-mono uppercase">System integrity verified</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
