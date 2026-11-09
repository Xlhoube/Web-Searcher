/**
 * Chromium Manager - Controls headless Chromium with Chrome DevTools Protocol (CDP)
 */

const { spawn } = require('child_process');
const http = require('http');

class ChromiumManager {
  constructor(port = 9222, cdpHost = '127.0.0.1') {
    this.port = port;
    this.cdpHost = cdpHost;
    this.baseUrl = `http://${cdpHost}:${port}`;
    this.process = null;
    this.isLaunching = false;
  }

  async checkAlive() {
    try {
      const res = await fetch(`${this.baseUrl}/json/version`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        return true;
      }
    } catch {
      // not running
    }
    return false;
  }

  async ensureRunning() {
    if (await this.checkAlive()) {
      return true;
    }

    if (this.isLaunching) {
      // Wait up to 5s if already launching
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 200));
        if (await this.checkAlive()) return true;
      }
    }

    this.isLaunching = true;
    try {
      const chromiumBin = '/usr/bin/chromium';
      const args = [
        '--headless=new',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors',
        `--remote-debugging-port=${this.port}`,
        `--remote-debugging-address=${this.cdpHost}`,
        'about:blank'
      ];

      this.process = spawn(chromiumBin, args, {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore']
      });
      this.process.unref();

      // Poll until CDP is available
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 200));
        if (await this.checkAlive()) {
          this.isLaunching = false;
          return true;
        }
      }
    } finally {
      this.isLaunching = false;
    }

    throw new Error('Failed to start headless Chromium process with CDP.');
  }

  async openTab(url) {
    await this.ensureRunning();
    const targetUrl = `${this.baseUrl}/json/new?${encodeURIComponent(url)}`;
    const res = await fetch(targetUrl, { method: 'PUT' });
    if (!res.ok) {
      throw new Error(`Failed to create browser tab for ${url}: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      targetId: data.id,
      wsUrl: data.webSocketDebuggerUrl,
      url: data.url,
      title: data.title
    };
  }

  async closeTab(targetId) {
    try {
      await fetch(`${this.baseUrl}/json/close/${targetId}`);
    } catch {
      // ignore
    }
  }

  /**
   * Evaluate a JavaScript expression inside the page via CDP WebSocket
   */
  async evaluate(wsUrl, expression, timeoutMs = 4000) {
    if (!wsUrl) return null;
    return new Promise((resolve) => {
      let isSettled = false;
      const timeout = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try { ws.terminate(); } catch {}
          resolve(null);
        }
      }, timeoutMs);

      // Simple lightweight WebSocket client using node's http upgrade or 'ws' package if present, or native WebSocket
      const WebSocketClient = globalThis.WebSocket;
      if (!WebSocketClient) {
        clearTimeout(timeout);
        return resolve(null);
      }

      try {
        const ws = new WebSocketClient(wsUrl);
        const reqId = 100;

        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: reqId,
            method: 'Runtime.evaluate',
            params: {
              expression,
              returnByValue: true,
              awaitPromise: true
            }
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.id === reqId) {
              if (!isSettled) {
                isSettled = true;
                clearTimeout(timeout);
                ws.close();
                resolve(data.result?.result?.value ?? null);
              }
            }
          } catch {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              ws.close();
              resolve(null);
            }
          }
        };

        ws.onerror = () => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timeout);
            try { ws.close(); } catch {}
            resolve(null);
          }
        };
      } catch {
        clearTimeout(timeout);
        resolve(null);
      }
    });
  }

  async listTargets() {
    await this.ensureRunning();
    const res = await fetch(`${this.baseUrl}/json/list`);
    if (!res.ok) return [];
    return await res.json();
  }
}

module.exports = ChromiumManager;
