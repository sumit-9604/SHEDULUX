const { COLORS } = require('../config/engineConfig');

function collapseTimeline(rawTimeline) {
  if (!rawTimeline || rawTimeline.length === 0) return [];

  const blocks = [];
  let cur = rawTimeline[0];

  for (let i = 1; i < rawTimeline.length; i++) {
    const tick = rawTimeline[i];
    if (tick.running !== cur.running) {
      blocks.push({ pid: cur.running, start: cur.time, end: tick.time });
      cur = tick;
    }
  }

  const last = rawTimeline[rawTimeline.length - 1];
  blocks.push({ pid: cur.running, start: cur.time, end: last.time + 1 });

  return blocks;
}

function transformOutput(raw, inputProcesses) {
  const procMap = {};
  inputProcesses.forEach((p, i) => {
    procMap[String(p.id)] = {
      ...p,
      color: COLORS[i % COLORS.length],
      name: 'P' + p.id
    };
  });

  const blocks = collapseTimeline(raw.timeline);

  const timeline = blocks.map(b => ({
    pid: b.pid,
    name: procMap[b.pid]?.name || 'P' + b.pid,
    color: procMap[b.pid]?.color || '#888888',
    start: b.start,
    end: b.end
  }));

  const processes = raw.processes.map((p, i) => {
    const meta = procMap[String(p.id)] || {};
    return {
      id: p.id,
      name: meta.name || 'P' + p.id,
      color: meta.color || COLORS[i % COLORS.length],
      at: meta.arrival ?? 0,
      bt: meta.burst ?? 0,
      pr: meta.priority ?? 0,
      wt: p.waiting,
      tat: p.turnaround,
      finish: (meta.arrival ?? 0) + p.turnaround,
      start: (meta.arrival ?? 0) + p.waiting
    };
  });

  const maxT = timeline.length
    ? Math.max(...timeline.map(b => b.end))
    : 0;

  const n = processes.length;
  const avgWT = n ? (processes.reduce((s, p) => s + p.wt, 0) / n).toFixed(2) : '0';
  const avgTAT = n ? (processes.reduce((s, p) => s + p.tat, 0) / n).toFixed(2) : '0';
  const throughput = maxT ? (n / maxT).toFixed(3) : '0';

  return {
    timeline,
    processes,
    stats: {
      avgWT,
      avgTAT,
      throughput,
      utilization: '100.0',
      maxT
    }
  };
}

module.exports = { transformOutput };