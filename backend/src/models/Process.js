class Process {
  constructor({ id, arrival = 0, burst = 1, priority = 1, queueLevel = 0 }) {
    this.id = String(id);
    this.arrival = Number(arrival);
    this.burst = Number(burst);
    this.priority = Number(priority);
    this.queueLevel = Number(queueLevel);
  }

  toEngineJSON() {
    return {
      id: this.id,
      arrival: this.arrival,
      burst: this.burst,
      priority: this.priority,
      queueLevel: this.queueLevel
    };
  }
}

module.exports = Process;