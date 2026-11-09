/**
 * Site Analyzer Orchestrator
 * Coordinates Chromium CDP, REA inspect-web-page, and TechnologyDetector
 */

const ChromiumManager = require('./chromium-manager');
const ReaRunner = require('./rea-runner');
const TechnologyDetector = require('./detector');

class SiteAnalyzer {
  constructor(options = {}) {
    this.cdpPort = options.cdpPort || 9222;
    this.cdpHost = options.cdpHost || '127.0.0.1';
    this.chromium = new ChromiumManager(this.cdpPort, this.cdpHost);
    this.rea = new ReaRunner();
    this.detector = new TechnologyDetector();
  }

  normalizeUrl(rawUrl) {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return new URL(url).href;
  }

  async analyze(targetUrl, options = {}) {
    const startTime = Date.now();
    const finalUrl = this.normalizeUrl(targetUrl);
    const logs = [];
    const addLog = (msg) => logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);

    addLog(`Iniciando análise para: ${finalUrl}`);

    // Step 1: Direct HTTP fetch for wire headers and initial HTML
    let httpHeaders = {};
    let html = '';
    let cookies = [];
    try {
      addLog('Consultando cabeçalhos HTTP e HTML inicial da página...');
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/156.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000)
      });

      for (const [key, value] of response.headers.entries()) {
        httpHeaders[key.toLowerCase()] = value;
      }
      const rawCookies = response.headers.get('set-cookie');
      if (rawCookies) {
        cookies = rawCookies.split(/,(?=[^;]+;)/).map(c => c.trim().split(';')[0]);
      }
      html = await response.text();
      addLog(`Resposta HTTP ${response.status} recebida (${html.length} bytes)`);
    } catch (err) {
      addLog(`Aviso na requisição direta: ${err.message}. Continuando via navegador Chromium...`);
    }

    // Step 2: Open page in Chromium via CDP
    let tabInfo = null;
    let windowVars = {};
    let reaEvidence = {};

    try {
      addLog('Garantindo instância do Chromium Headless com CDP...');
      await this.chromium.ensureRunning();

      addLog('Carregando URL em aba controlada via Chrome DevTools Protocol...');
      tabInfo = await this.chromium.openTab(finalUrl);
      addLog(`Aba CDP criada com ID: ${tabInfo.targetId}`);

      // Wait a moment for dynamic scripts, hydration, and runtime objects to mount
      await new Promise(r => setTimeout(r, options.waitTimeMs || 2500));

      // Step 3: Probe runtime window globals through CDP
      addLog('Sondando objetos globais de execução (window.React, Vue, jQuery, Next, etc.)...');
      const probeScript = `
        (() => {
          try {
            return {
              wp: !!window.wp,
              wpData: !!window.wpData,
              _wpemojiSettings: !!window._wpemojiSettings,
              React: !!window.React || !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
              reactVersion: window.React ? window.React.version : null,
              Vue: !!window.Vue || !!window.__VUE__,
              vueVersion: window.Vue ? window.Vue.version : null,
              jQuery: !!window.jQuery || !!window.$,
              jqueryVersion: (window.jQuery && window.jQuery.fn) ? window.jQuery.fn.jquery : ((window.$ && window.$.fn) ? window.$.fn.jquery : null),
              __NEXT_DATA__: !!window.__NEXT_DATA__,
              __NUXT__: !!window.__NUXT__,
              Shopify: !!window.Shopify,
              angular: !!window.angular || !!window.ng,
              Alpine: !!window.Alpine,
              htmx: !!window.htmx,
              dataLayer: Array.isArray(window.dataLayer) && window.dataLayer.length > 0,
              gtag: typeof window.gtag === 'function',
              ga: typeof window.ga === 'function',
              fbq: typeof window.fbq === 'function',
              hj: typeof window.hj === 'function',
              clarity: typeof window.clarity === 'function',
              Stripe: typeof window.Stripe === 'function',
              turnstile: typeof window.turnstile === 'object',
              grecaptcha: typeof window.grecaptcha === 'object',
              bootstrap: typeof window.bootstrap === 'object'
            };
          } catch(e) {
            return { error: e.message };
          }
        })()
      `;

      const evaluated = await this.chromium.evaluate(tabInfo.wsUrl, probeScript, 3000);
      if (evaluated && typeof evaluated === 'object') {
        windowVars = evaluated;
        addLog('Sondagem de runtime concluída com sucesso');
      }

      // Step 4: Run REA inspect-web-page command
      addLog('Executando REA (Reverse Engineer Anything) inspect-web-page...');
      const cdpEndpoint = `http://${this.cdpHost}:${this.cdpPort}`;
      reaEvidence = await this.rea.inspectWebPage(cdpEndpoint, tabInfo.targetId, {
        observationMs: 1200
      });

      if (reaEvidence && reaEvidence.evidence_id) {
        addLog(`Evidência REA gerada com ID: ${reaEvidence.evidence_id}`);
      } else if (reaEvidence && reaEvidence.error) {
        addLog(`Aviso REA: ${reaEvidence.error}`);
      }
    } catch (err) {
      addLog(`Erro durante inspeção CDP/REA: ${err.message}`);
    } finally {
      // Step 5: Close CDP tab
      if (tabInfo && tabInfo.targetId) {
        await this.chromium.closeTab(tabInfo.targetId);
        addLog('Aba do navegador fechada');
      }
    }

    // Step 6: Process evidence with TechnologyDetector
    addLog('Processando evidências e identificando tecnologias e plugins...');
    const result = this.detector.detect({
      url: finalUrl,
      httpHeaders,
      html,
      cookies,
      reaEvidence,
      windowVars
    });

    result.metadata = {
      durationMs: Date.now() - startTime,
      logs,
      reaTool: 'rea inspect-web-page (CDP Reverse Engineering)',
      rawEvidence: options.includeRawEvidence ? reaEvidence : undefined
    };

    addLog(`Análise finalizada em ${result.metadata.durationMs}ms com ${result.summary.detectedCount} tecnologias/plugins encontrados.`);
    return result;
  }
}

module.exports = SiteAnalyzer;
