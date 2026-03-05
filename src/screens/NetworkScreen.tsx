import { useState, useCallback } from 'react'
import { Signal, Network, Play, Loader2 } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  simulatePing, getPingStats, calculateSubnet,
  type PingResult, type SubnetInfo,
} from '../utils/networkUtils'
import PageHeader from '../components/PageHeader'

type Tab = 'ping' | 'subnet'

export default function NetworkScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('ping')

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Network Tools" />

      {/* Tab switcher */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex bg-navy-800 rounded-xl p-1 gap-1">
          {(['ping', 'subnet'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold tap-active transition-all ${
                activeTab === tab
                  ? 'bg-accent text-navy-900'
                  : 'text-slate-400'
              }`}
            >
              {tab === 'ping' ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Signal size={14} /> Ping
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Network size={14} /> Subnet
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 pb-4">
        {activeTab === 'ping' ? <PingTool /> : <SubnetTool />}
      </div>
    </div>
  )
}

/* ─── Ping Tool ─────────────────────────────────────────────────── */
function PingTool() {
  const [host, setHost] = useState('8.8.8.8')
  const [results, setResults] = useState<PingResult[]>([])
  const [running, setRunning] = useState(false)

  const runPing = useCallback(async () => {
    if (!host.trim()) return
    setRunning(true)
    setResults([])

    const all = simulatePing(host.trim(), 12)
    for (let i = 0; i < all.length; i++) {
      await new Promise((r) => setTimeout(r, 180))
      setResults((prev) => [...prev, all[i]])
    }
    setRunning(false)
  }, [host])

  const stats = results.length > 0 ? getPingStats(results) : null
  const chartData = results.map((r) => ({
    seq: r.seq,
    latency: r.status === 'success' ? r.latency : null,
  }))

  return (
    <div className="flex flex-col gap-4">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Hostname or IP"
          className="flex-1 bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-accent"
          style={{ minHeight: 48 }}
          onKeyDown={(e) => e.key === 'Enter' && runPing()}
        />
        <button
          onClick={runPing}
          disabled={running}
          className="flex items-center gap-2 bg-accent text-navy-900 font-bold px-4 rounded-xl tap-active disabled:opacity-60"
          style={{ minHeight: 48 }}
        >
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {running ? 'Pinging' : 'Ping'}
        </button>
      </div>

      {/* Chart */}
      {results.length > 0 && (
        <div className="card p-4">
          <p className="text-xs text-slate-400 mb-3 font-medium">Latency (ms)</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seq" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#00d4ff' }}
                formatter={(v: number) => [`${v} ms`, 'Latency']}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#latencyGrad)"
                connectNulls={false}
                dot={{ fill: '#00d4ff', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Min', value: `${stats.min}ms` },
            { label: 'Avg', value: `${stats.avg}ms` },
            { label: 'Max', value: `${stats.max}ms` },
            { label: 'Loss', value: `${stats.loss}%`, warn: stats.loss > 5 },
          ].map(({ label, value, warn }) => (
            <div key={label} className="card p-3 text-center">
              <div className={`text-base font-bold ${warn ? 'text-orange-400' : 'text-accent'}`}>
                {value}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Result rows */}
      {results.length > 0 && (
        <div className="card overflow-hidden">
          {results.map((r) => (
            <div
              key={r.seq}
              className="flex items-center justify-between px-4 py-2.5 border-b border-navy-700/30 last:border-0"
            >
              <span className="text-xs text-slate-500 w-12">seq={r.seq}</span>
              {r.status === 'success' ? (
                <span className="text-xs font-mono text-slate-200">{r.latency} ms</span>
              ) : (
                <span className="text-xs text-orange-400">Request timeout</span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  r.status === 'success'
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-orange-500/15 text-orange-400'
                }`}
              >
                {r.status === 'success' ? 'OK' : 'Timeout'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Subnet Calculator ──────────────────────────────────────────── */
function SubnetTool() {
  const [ip, setIp] = useState('192.168.1.0')
  const [cidr, setCidr] = useState(24)
  const [info, setInfo] = useState<SubnetInfo | null>(null)
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    const result = calculateSubnet(ip.trim(), cidr)
    if (!result) {
      setError('Invalid IP address or CIDR prefix')
      setInfo(null)
    } else {
      setInfo(result)
    }
  }, [ip, cidr])

  const rows = info
    ? [
        { label: 'Network Address', value: info.networkAddress },
        { label: 'Broadcast Address', value: info.broadcastAddress },
        { label: 'First Usable', value: info.firstUsable },
        { label: 'Last Usable', value: info.lastUsable },
        { label: 'Subnet Mask', value: info.subnetMask },
        { label: 'Total Hosts', value: info.totalHosts.toLocaleString() },
        { label: 'Usable Hosts', value: info.usableHosts.toLocaleString() },
        { label: 'IP Class', value: `Class ${info.ipClass}` },
      ]
    : []

  return (
    <div className="flex flex-col gap-4">
      {/* Inputs */}
      <div className="flex gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="IP Address"
          className="flex-1 bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-accent font-mono"
          style={{ minHeight: 48 }}
        />
        <div className="flex items-center bg-navy-800 border border-navy-700 rounded-xl px-3 gap-1">
          <span className="text-slate-400 text-sm font-mono">/</span>
          <input
            type="number"
            value={cidr}
            onChange={(e) => setCidr(Math.max(0, Math.min(32, parseInt(e.target.value) || 0)))}
            className="w-12 bg-transparent py-3 text-sm font-mono text-slate-100 outline-none text-center"
            min={0}
            max={32}
            style={{ minHeight: 48 }}
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="bg-accent text-navy-900 font-bold py-3 rounded-xl tap-active"
        style={{ minHeight: 48 }}
      >
        Calculate
      </button>

      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {info && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-navy-700/30">
            <span className="text-xs font-semibold text-accent">
              {info.networkAddress}/{info.cidr}
            </span>
          </div>
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3 border-b border-navy-700/20 last:border-0"
            >
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-sm font-mono text-slate-100">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
