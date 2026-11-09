/**
 * REA Runner - Executes REA commands (Reverse Engineer Anything) to inspect browser targets and recover code.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ReaRunner {
  constructor(reaPackage = 'rea-agents@6.8.0') {
    this.reaPackage = reaPackage;
  }

  /**
   * Run rea command and parse JSON output
   */
  async runReaCommand(args, timeoutMs = 30000) {
    const cmd = `npx -y ${this.reaPackage} ${args.join(' ')}`;
    return new Promise((resolve, reject) => {
      exec(cmd, { maxBuffer: 30 * 1024 * 1024, timeout: timeoutMs }, (error, stdout, stderr) => {
        if (stdout && stdout.trim()) {
          try {
            // Find JSON inside stdout (ignore potential npm notices or logs)
            const firstBrace = stdout.indexOf('{');
            const lastBrace = stdout.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              const jsonStr = stdout.slice(firstBrace, lastBrace + 1);
              const parsed = JSON.parse(jsonStr);
              return resolve(parsed);
            }
          } catch (e) {
            // fallback
          }
        }

        if (error) {
          return reject(new Error(`REA command failed: ${error.message} - Stderr: ${stderr}`));
        }

        resolve({ rawOutput: stdout });
      });
    });
  }

  /**
   * Run REA list-browser-targets against CDP endpoint
   */
  async listBrowserTargets(cdpEndpoint = 'http://127.0.0.1:9222') {
    const args = ['list-browser-targets', cdpEndpoint, '--format', 'json'];
    return await this.runReaCommand(args, 15000);
  }

  /**
   * Run REA inspect-web-page to capture scripts, DOM URLs, resources, storage and console
   */
  async inspectWebPage(cdpEndpoint, targetId, options = {}) {
    const args = [
      'inspect-web-page',
      cdpEndpoint,
      targetId,
      '--include-script-sources',
      '--include-storage-keys',
      '--include-console-text',
      '--include-json-body-shapes',
      '--observation-ms', String(options.observationMs || 1000),
      '--format', 'json'
    ];
    return await this.runReaCommand(args, 40000);
  }

  /**
   * Recover readable JavaScript modules with REA recover-javascript-sources
   */
  async recoverJavascriptSources(scriptContent, scriptName = 'app.js') {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rea-js-'));
    const sourceFile = path.join(tempDir, scriptName);
    const outputDir = path.join(tempDir, 'recovered');

    try {
      fs.writeFileSync(sourceFile, scriptContent, 'utf-8');
      const args = [
        'recover-javascript-sources',
        sourceFile,
        outputDir,
        '--format', 'json'
      ];
      const result = await this.runReaCommand(args, 25000);
      return {
        success: true,
        evidence: result,
        outputDir
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

module.exports = ReaRunner;
