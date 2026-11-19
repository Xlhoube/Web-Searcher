/**
 * Web-Searcher Web Server & API
 * Provides HTTP interface and Web UI for REA Site Technology Analysis
 */

const express = require('express');
const path = require('path');
const SiteAnalyzer = require('./lib/analyzer');

const ReportCompiler = require('./lib/compiler');
const BifamiliarProspector = require('./lib/bifamiliar-prospector');

const app = express();
const PORT = process.env.PORT || 3000;
const analyzer = new SiteAnalyzer();
const compiler = new ReportCompiler();
const prospector = new BifamiliarProspector();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isCdpAlive = await analyzer.chromium.checkAlive();
  res.json({
    status: 'ok',
    cdpAlive: isCdpAlive,
    reaPackage: analyzer.rea.reaPackage,
    timestamp: new Date().toISOString()
  });
});

// Analyze website endpoint
app.post('/api/analyze', async (req, res) => {
  const { url, includeRawEvidence } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'É necessário fornecer um endereço de site (URL) válido.' });
  }

  try {
    const report = await analyzer.analyze(url, {
      includeRawEvidence: !!includeRawEvidence
    });
    res.json(report);
  } catch (err) {
    console.error('Erro na análise:', err);
    res.status(500).json({
      error: `Falha ao analisar o site: ${err.message}`,
      details: err.stack
    });
  }
});

// Compile executive dossier endpoint (HTML, MD or JSON)
app.post('/api/compile', async (req, res) => {
  const { url, format = 'json' } = req.body;
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'É necessário fornecer um endereço de site (URL) válido.' });
  }

  try {
    const report = await analyzer.analyze(url);
    const dossier = compiler.compile(report);

    if (format === 'html') {
      const htmlReport = compiler.generateHtmlReport(dossier);
      return res.type('html').send(htmlReport);
    }
    if (format === 'md' || format === 'markdown') {
      const mdReport = compiler.generateMarkdownReport(dossier);
      return res.type('text').send(mdReport);
    }

    res.json(dossier);
  } catch (err) {
    res.status(500).json({ error: `Falha ao compilar dossiê: ${err.message}` });
  }
});

// Prospect bifamiliar real estate property endpoint
app.post('/api/prospect-bifamiliar', async (req, res) => {
  const { url, title, description, price, location, contacts } = req.body;
  try {
    let html = '';
    let fetchedTitle = title || '';
    if (url && /^https?:\/\//i.test(url)) {
      try {
        const fetchRes = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0' },
          signal: AbortSignal.timeout(8000)
        });
        html = await fetchRes.text();
        const tm = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (tm && !fetchedTitle) fetchedTitle = tm[1].trim();
      } catch (e) {
        // continue
      }
    }

    const evaluation = prospector.analyzeProperty({
      url,
      title: fetchedTitle,
      description: description || html.slice(0, 5000),
      price: price ? parseFloat(price) : undefined,
      location,
      html,
      contacts: contacts || {}
    });

    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ error: `Falha ao avaliar imóvel bifamiliar: ${err.message}` });
  }
});

// Recover/Decompile JavaScript module endpoint via REA
app.post('/api/recover-script', async (req, res) => {
  const { scriptContent, scriptName } = req.body;
  if (!scriptContent) {
    return res.status(400).json({ error: 'Conteúdo do script não fornecido.' });
  }

  try {
    const recoveryResult = await analyzer.rea.recoverJavascriptSources(
      scriptContent,
      scriptName || 'bundle.js'
    );
    res.json(recoveryResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Web-Searcher REA Server ativo em http://localhost:${PORT}`);
  console.log(`💡 Interface Web disponível e pronta para inspeção de tecnologias e plugins.`);
});
