const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

// ─── Config ───────────────────────────────────────────────────────────────────

const PORT = 3001;
const ENGINE_PATH = path.join(
  __dirname,
  "../cpp-engine/build/cpu_scheduler.exe",
);

const VALID_ALGORITHMS = [
  "FCFS",
  "SJF",
  "SRTF",
  "Prioritynp",
  "Priorityp",
  "RoundRobin",
  "MultilevelQueue",
  "MLFQ",
];

const COLORS = [
  "#7c5cff",
  "#00e5b0",
  "#ff4daa",
  "#ffb400",
  "#ff4466",
  "#48e0ff",
  "#a8ff3e",
  "#ff8c42",
  "#c77dff",
  "#00d4ff",
];

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    engine: "SHEDULUX v1.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Core Engine Runner ───────────────────────────────────────────────────────

function runEngine(payload) {
  return new Promise((resolve, reject) => {
    const engine = spawn(ENGINE_PATH, [], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    engine.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    engine.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    engine.on("close", (code) => {
      console.log("[ENGINE STDERR]:", stderr.trim());

      if (code !== 0) {
        return reject(new Error(`Engine exited with code ${code}: ${stderr}`));
      }

      try {
        // Extract ONLY the JSON part from stdout
        // (handles case where debug lines leak into stdout)
        const jsonStart = stdout.indexOf("{");
        const jsonEnd = stdout.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
          return reject(
            new Error(`No JSON found in engine output.\nRaw: ${stdout}`),
          );
        }

        const cleanJson = stdout.slice(jsonStart, jsonEnd + 1);
        resolve(JSON.parse(cleanJson));
      } catch (e) {
        reject(new Error(`Failed to parse engine output.\nRaw: ${stdout}`));
      }
    });

    engine.on("error", (err) => {
      reject(
        new Error(
          `Could not start engine: ${err.message}\nPath: ${ENGINE_PATH}`,
        ),
      );
    });

    engine.stdin.write(JSON.stringify(payload));
    engine.stdin.end();
  });
}

// ─── Transform Output ─────────────────────────────────────────────────────────

function collapseTimeline(rawTimeline) {
  if (!rawTimeline || rawTimeline.length === 0) return [];

  const blocks = [];
  let cur = rawTimeline[0];

  for (let i = 1; i < rawTimeline.length; i++) {
    const tick = rawTimeline[i];
    if (tick.running !== cur.running) {
      blocks.push({
        pid: String(cur.running),
        start: cur.time,
        end: tick.time,
      });
      cur = tick;
    }
  }

  const last = rawTimeline[rawTimeline.length - 1];
  blocks.push({
    pid: String(cur.running),
    start: cur.time,
    end: last.time + 1,
  });

  return blocks;
}

function transformOutput(raw, inputProcesses) {
  const procMap = {};
  inputProcesses.forEach((p, i) => {
    procMap[String(p.id)] = {
      ...p,
      color: COLORS[i % COLORS.length],
      name: "P" + p.id,
    };
  });

  const blocks = collapseTimeline(raw.timeline);

  // Filter out IDLE blocks + fix name
  const timeline = blocks
    .filter((b) => b.pid !== "IDLE" && b.pid !== "idle" && b.pid !== "-1")
    .map((b) => ({
      pid: b.pid,
      name: procMap[b.pid]?.name || "P" + b.pid,
      color: procMap[b.pid]?.color || "#888888",
      start: b.start,
      end: b.end,
    }));

  const processes = raw.processes.map((p, i) => {
    const meta = procMap[String(p.id)] || {};
    return {
      id: p.id,
      name: meta.name || "P" + p.id,
      color: meta.color || COLORS[i % COLORS.length],
      at: meta.arrival ?? 0,
      bt: meta.burst ?? 0,
      pr: meta.priority ?? meta.queueLevel ?? 0,
      wt: p.waiting,
      tat: p.turnaround,
      start: (meta.arrival ?? 0) + p.waiting,
      finish: (meta.arrival ?? 0) + p.turnaround,
    };
  });

  const maxT = timeline.length ? Math.max(...timeline.map((b) => b.end)) : 0;
  const n = processes.length;

  return {
    timeline,
    processes,
    stats: {
      avgWT: n
        ? (processes.reduce((s, p) => s + p.wt, 0) / n).toFixed(2)
        : "0.00",
      avgTAT: n
        ? (processes.reduce((s, p) => s + p.tat, 0) / n).toFixed(2)
        : "0.00",
      throughput: maxT ? (n / maxT).toFixed(3) : "0.000",
      utilization: "100.0",
      maxT,
    },
  };
}

// ─── /api/schedule ────────────────────────────────────────────────────────────

app.post("/api/schedule", async (req, res) => {
  const { algorithm, processes, quantum } = req.body;

  // Validate algorithm
  if (!algorithm || !VALID_ALGORITHMS.includes(algorithm)) {
    return res.status(400).json({
      success: false,
      error: `Invalid algorithm "${algorithm}". Valid: ${VALID_ALGORITHMS.join(", ")}`,
    });
  }

  // Validate processes
  if (!Array.isArray(processes) || processes.length === 0) {
    return res.status(400).json({
      success: false,
      error: "processes must be a non-empty array",
    });
  }

  // Build payload for C++ engine
  const payload = {
    algorithm,
    processes: processes.map((p) => ({
      id: String(p.id),
      arrival: Number(p.arrival) || 0,
      burst: Number(p.burst) || 1,
      priority: Number(p.priority) || 1,
      queueLevel: Number(p.queueLevel) || 0,
    })),
    ...(algorithm === "RoundRobin" && { quantum: Number(quantum) || 2 }),
    ...(algorithm === "MLFQ" && { quantum: Number(quantum) || 2 }),
  };

  
  try {
    // Try to use C++ engine locally, fallback to mock on production
    let raw;
    
    if (process.env.NODE_ENV === 'production') {
      // Mock response for Render (until C++ is compiled for Linux)
      console.log("[MOCK ENGINE] Using mock response");
      raw = {
        timeline: processes.map((p, i) => ({
          time: i * 10,
          running: p.id
        })),
        processes: processes.map((p, i) => ({
          id: String(p.id),
          waiting: i * 5,
          turnaround: (i * 10 + Number(p.burst))
        }))
      };
    } else {
      // Use C++ engine locally
      raw = await runEngine(payload);
    }
    
    const result = transformOutput(raw, payload.processes);
    res.json({ success: true, algorithm, ...result });
  } catch (err) {
    console.error("[SCHEDULE ERROR]:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("[UNHANDLED]:", err.message);
  res.status(500).json({ success: false, error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ███████╗██╗  ██╗███████╗██████╗ ██╗   ██╗██╗     ██╗   ██╗██╗  ██╗
  ██╔════╝██║  ██║██╔════╝██╔══██╗██║   ██║██║     ██║   ██║╚██╗██╔╝
  ███████╗███████║█████╗  ██║  ██║██║   ██║██║     ██║   ██║ ╚███╔╝ 
  ╚════██║██╔══██║██╔══╝  ██║  ██║██║   ██║██║     ██║   ██║ ██╔██╗ 
  ███████║██║  ██║███████╗██████╔╝╚██████╔╝███████╗╚██████╔╝██╔╝ ██╗
  ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
  Backend running on http://localhost:${PORT}
  Engine: ${ENGINE_PATH}
  `);
});
