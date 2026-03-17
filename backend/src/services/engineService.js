const { spawn } = require('child_process');
const { ENGINE_PATH } = require('../config/engineConfig');

function runEngine(payload) {
  return new Promise((resolve, reject) => {
    const engine = spawn(ENGINE_PATH);

    let stdout = '';
    let stderr = '';

    engine.stdout.on('data', d => { stdout += d.toString(); });
    engine.stderr.on('data', d => { stderr += d.toString(); });

    engine.on('close', code => {
      console.log('[ENGINE STDERR]:', stderr);

      if (code !== 0) {
        return reject(new Error(`Engine exited with code ${code}: ${stderr}`));
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse engine output: ${stdout}`));
      }
    });

    engine.on('error', err => {
      reject(new Error(`Failed to spawn engine: ${err.message}`));
    });

    engine.stdin.write(JSON.stringify(payload));
    engine.stdin.end();
  });
}

module.exports = { runEngine };