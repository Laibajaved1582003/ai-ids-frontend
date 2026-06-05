import React, { useState } from 'react';
import { useFlowHistory } from '../hooks/useData';
import { Badge } from '../components/ui/DataDisplay';
import { 
  Search, 
  Calendar, 
  Download, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

const FlowHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    label: '',
    protocol: '',
    search: ''
  });

  const { data } = useFlowHistory({
    page,
    label: filters.label,
    protocol: filters.protocol,
    search: filters.search
  });

  const exportToCSV = () => {
    if (!data?.results) return;
    const headers = ['ID', 'Time', 'Src IP', 'Dst IP', 'Port', 'Protocol', 'Packets', 'Bytes', 'Label', 'Confidence'];
    const rows = data.results.map((f: any) => [
      f.id, f.start_time, f.src_ip, f.dst_ip, f.dst_port, f.protocol, f.packet_count, f.byte_count, f.label, f.confidence
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e: any) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flow_history_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-30 flex justify-between items-center bg-dark-900/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-dark-700/50 mb-4">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white tracking-tight uppercase">
            FLOW HISTORY ARCHIVE
          </h2>
          <p className="text-dark-600 text-xs font-mono mt-1">HISTORICAL PACKET DATABASE • PERSISTENT STORAGE</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-mono px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-neon-cyan" /> EXPORT CSV
        </button>
      </header>

      <div className="pt-16 space-y-6">
        {/* Filter Bar */}
        <div className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600" />
            <input 
              type="text" 
              placeholder="Search IP..." 
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-slate-300 focus:outline-none focus:border-neon-cyan/50 transition-colors"
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <select 
            className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-neon-cyan/50"
            onChange={(e) => setFilters(prev => ({ ...prev, protocol: e.target.value }))}
          >
            <option value="">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="TCP6">TCP6</option>
            <option value="UDP6">UDP6</option>
          </select>

          <select 
            className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-neon-cyan/50"
            onChange={(e) => setFilters(prev => ({ ...prev, label: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="0">Benign</option>
            <option value="DDoS">DDoS</option>
            <option value="PortScan">PortScan</option>
            <option value="Bot">Bot</option>
          </select>

          <div className="flex items-center gap-2 bg-dark-900 border border-dark-700 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-dark-600" />
            <span className="text-[10px] font-mono text-dark-600">RANGE: LAST 24H</span>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-700">
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Flow Path</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Protocol</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Payload</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Label</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-dark-600 uppercase tracking-widest">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {data?.results?.map((flow: any) => (
                  <tr key={flow.id} className="hover:bg-dark-800/40 transition-colors group">
                    <td className="px-6 py-4 text-[10px] font-mono text-dark-600">
                      {format(new Date(flow.start_time), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-300">{flow.src_ip}</span>
                        <span className="text-dark-600">→</span>
                        <span className="text-slate-300">{flow.dst_ip}:{flow.dst_port}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={flow.protocol.includes('6') ? 'purple' : 'cyan'}>
                        {flow.protocol}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-400">
                      {flow.packet_count} PKT / {(flow.byte_count / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={flow.label === '0' ? 'green' : 'red'}>
                        {flow.label === '0' ? 'BENIGN' : flow.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-dark-600">{(flow.confidence * 100).toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-dark-700 bg-dark-900/30 flex justify-between items-center">
            <span className="text-[10px] font-mono text-dark-600 uppercase">
              Showing {data?.results?.length || 0} of {data?.count || 0} records
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 bg-dark-800 border border-dark-700 rounded-md disabled:opacity-30 hover:border-dark-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                disabled={!data?.next}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 bg-dark-800 border border-dark-700 rounded-md disabled:opacity-30 hover:border-dark-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowHistory;
