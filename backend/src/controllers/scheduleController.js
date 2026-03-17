const { runEngine } = require('../services/engineService');
const { transformOutput } = require('../utils/transformOutput');
const { VALID_ALGORITHMS } = require('../config/engineConfig');
const Process = require('../models/Process');

async function schedule(req, res, next) {
  try {
    const { algorithm, processes, quantum } = req.body;

    if (!algorithm || !VALID_ALGORITHMS.includes(algorithm)) {
      return res.status(400).json({
        error: `Invalid algorithm. Valid options: ${VALID_ALGORITHMS.join(', ')}`
      });
    }

    if (!Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ error: 'processes array is required and cannot be empty' });
    }

    const parsedProcesses = processes.map(p => new Process(p));

    const payload = {
      algorithm,
      processes: parsedProcesses.map(p => p.toEngineJSON()),
      ...(algorithm === 'RoundRobin' && { quantum: Number(quantum) || 2 }),
      ...(algorithm === 'MLFQ' && { quantum: Number(quantum) || 2 })
    };

    const raw = await runEngine(payload);
    const result = transformOutput(raw, parsedProcesses);

    res.json({ success: true, algorithm, ...result });

  } catch (err) {
    next(err);
  }
}

module.exports = { schedule };