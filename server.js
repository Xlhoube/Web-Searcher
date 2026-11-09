/**
 * Web-Searcher Web Server & API
 * Provides HTTP interface and Web UI for REA Site Technology Analysis
 */

const express = require('express');
const path = require('path');
const SiteAnalyzer = require('./lib/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;
const analyzer = new SiteAnalyzer();

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
