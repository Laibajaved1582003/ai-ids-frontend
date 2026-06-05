import React from 'react';
import { useNetworkHealth } from '../hooks/useData';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NetworkHealth: React.FC = () => {
  const { data } = useNetworkHealth(10000);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00ff88'; // green
    if (score >= 50) return '#ffaa00'; // amber
    return '#ff3366'; // red
  };

  const scoreData = [
    { value: data?.health_score || 0, fill: getScoreColor(data?.health_score || 0) }
  ];

  return (
    <div className="relative">
      <header className="sticky top-0 z-30 flex justify-between items-center bg-dark-900/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-dark-700/50 mb-4">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white tracking-tight uppercase">SYSTEM HEALTH DIAGNOSTICS</h2>
          <p className="text-dark-600 text-xs font-mono mt-1">GLOBAL INFRASTRUCTURE STATUS • AUTOMATED AUDIT</p>
        </div>
      </header>

      <div className="pt-16 space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Score Gauge */}
        <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Global Health Score</div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="80%" 
                outerRadius="100%" 
                barSize={15} 
                data={scoreData} 
                startAngle={210} 
                endAngle={-30}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  animationDuration={1500}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-6xl font-mono font-bold block" style={{ color: getScoreColor(data?.health_score || 0) }}>
                {data?.health_score || 0}
              </span>
              <span className="text-xs font-mono text-dark-600 uppercase tracking-widest">PERFORMANCE</span>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="lg:col-span-2 glass-card p-6 grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${data?.status_flags.dns_active ? 'bg-neon-green shadow-neon-green' : 'bg-dark-700'}`} />
            <div>
              <div className="text-[10px] font-mono text-dark-600 uppercase">DNS Services</div>
              <div className="text-sm font-mono text-slate-300">{data?.status_flags.dns_active ? 'REACHABLE' : 'INACTIVE'}</div>
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${data?.status_flags.https_active ? 'bg-neon-green shadow-neon-green' : 'bg-dark-700'}`} />
            <div>
              <div className="text-[10px] font-mono text-dark-600 uppercase">HTTPS Encryption</div>
              <div className="text-sm font-mono text-slate-300">{data?.status_flags.https_active ? 'STABLE' : 'INACTIVE'}</div>
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!data?.status_flags.unusual_ports ? 'bg-neon-green shadow-neon-green' : 'bg-neon-amber shadow-neon-amber'}`} />
            <div>
              <div className="text-[10px] font-mono text-dark-600 uppercase">Port Activity</div>
              <div className="text-sm font-mono text-slate-300">{data?.status_flags.unusual_ports ? 'UNUSUAL DETECTED' : 'NORMAL'}</div>
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${data?.status_flags.threat_level === 'LOW' ? 'bg-neon-green' : (data?.status_flags.threat_level === 'MEDIUM' ? 'bg-neon-amber' : 'bg-neon-red')} shadow-sm`} />
            <div>
              <div className="text-[10px] font-mono text-dark-600 uppercase">Threat Level</div>
              <div className="text-sm font-mono text-slate-300">{data?.status_flags.threat_level || 'UNKNOWN'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Talkers */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6">Top Source IPs</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.top_src_ips || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2845" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="ip" type="category" stroke="#333d5c" fontSize={10} fontFamily="JetBrains Mono" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1628', border: 'none' }} />
                <Bar dataKey="count" fill="#00f5ff" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6">Top Destination IPs</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.top_dst_ips || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2845" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="ip" type="category" stroke="#333d5c" fontSize={10} fontFamily="JetBrains Mono" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1628', border: 'none' }} />
                <Bar dataKey="count" fill="#bf5fff" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Threat Timeline */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-mono font-bold text-dark-600 uppercase mb-6">Recent Threat Timeline</h3>
        <div className="space-y-4">
          {data?.recent_threats.map((threat: any) => (
            <div key={threat.id} className="flex items-center gap-4 p-4 bg-dark-900/30 rounded-lg border border-neon-red/10 group hover:border-neon-red/30 transition-all">
              <div className="p-2 bg-neon-red/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-neon-red" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-[10px] font-mono text-dark-600 uppercase">Detection</div>
                  <div className="text-sm font-mono font-bold text-neon-red">{threat.label}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-[10px] font-mono text-dark-600 uppercase">Source → Destination</div>
                  <div className="text-xs font-mono text-slate-300">{threat.src_ip} → {threat.dst_ip}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-dark-600 uppercase">Timestamp</div>
                  <div className="text-xs font-mono text-slate-400">
                    {formatDistanceToNow(new Date(threat.start_time), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data?.recent_threats.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheck className="w-12 h-12 text-neon-green mx-auto mb-4 opacity-20" />
              <p className="text-dark-600 font-mono text-sm">NO RECENT THREATS DETECTED</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
