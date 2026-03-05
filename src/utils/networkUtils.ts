// Network utility calculations

export interface SubnetInfo {
  networkAddress: string
  broadcastAddress: string
  firstUsable: string
  lastUsable: string
  totalHosts: number
  usableHosts: number
  subnetMask: string
  cidr: number
  ipClass: string
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join('.')
}

export function calculateSubnet(ip: string, cidr: number): SubnetInfo | null {
  if (!ip || cidr < 0 || cidr > 32) return null
  const octets = ip.split('.')
  if (octets.length !== 4 || octets.some((o) => isNaN(+o) || +o < 0 || +o > 255)) return null

  const ipLong = ipToLong(ip)
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const network = (ipLong & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2)

  const firstOctet = parseInt(octets[0], 10)
  let ipClass = 'E'
  if (firstOctet < 128) ipClass = 'A'
  else if (firstOctet < 192) ipClass = 'B'
  else if (firstOctet < 224) ipClass = 'C'
  else if (firstOctet < 240) ipClass = 'D (Multicast)'

  return {
    networkAddress: longToIp(network),
    broadcastAddress: longToIp(broadcast),
    firstUsable: cidr >= 31 ? longToIp(network) : longToIp(network + 1),
    lastUsable: cidr >= 31 ? longToIp(broadcast) : longToIp(broadcast - 1),
    totalHosts,
    usableHosts,
    subnetMask: longToIp(mask),
    cidr,
    ipClass,
  }
}

// Simulate ping with realistic latency values
export interface PingResult {
  seq: number
  latency: number
  status: 'success' | 'timeout' | 'error'
}

export function simulatePing(host: string, count = 8): PingResult[] {
  const seed = host.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseLatency = 5 + (seed % 80)
  const jitter = 2 + (seed % 15)
  const lossRate = seed % 20 === 0 ? 0.15 : 0.02

  return Array.from({ length: count }, (_, i) => {
    const rand = Math.sin(seed + i * 37.9) * 0.5 + 0.5
    const isLoss = rand < lossRate
    const latency = isLoss ? 0 : Math.round(baseLatency + (rand * jitter * 2 - jitter))

    return {
      seq: i + 1,
      latency,
      status: isLoss ? 'timeout' : 'success',
    }
  })
}

export function getPingStats(results: PingResult[]) {
  const successful = results.filter((r) => r.status === 'success')
  const latencies = successful.map((r) => r.latency)

  if (latencies.length === 0) {
    return { min: 0, max: 0, avg: 0, loss: 100 }
  }

  return {
    min: Math.min(...latencies),
    max: Math.max(...latencies),
    avg: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
    loss: Math.round(((results.length - successful.length) / results.length) * 100),
  }
}
