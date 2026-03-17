const path = require('path');

module.exports = {
  ENGINE_PATH: path.join(__dirname, '../../../cpp-engine/build/cpu_scheduler.exe'),

  VALID_ALGORITHMS: [
    'FCFS',
    'SJF',
    'SRTF',
    'Prioritynp',
    'Priorityp',
    'RoundRobin',
    'MultilevelQueue',
    'MLFQ'
  ],

  COLORS: [
    '#7c5cff', '#00e5b0', '#ff4daa', '#ffb400',
    '#ff4466', '#48e0ff', '#a8ff3e', '#ff8c42',
    '#c77dff', '#00d4ff'
  ]
};