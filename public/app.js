/**
 * Web-Searcher Frontend Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('ws-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ws-theme', newTheme);
  });

  // Elements
  const form = document.getElementById('analyzeForm');
  const urlInput = document.getElementById('urlInput');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const rawEvidenceCheckbox = document.getElementById('rawEvidenceCheckbox');

  const statusSection = document.getElementById('statusSection');
  const statusTitle = document.getElementById('statusTitle');
  const statusDesc = document.getElementById('statusDesc');
  const progressBar = document.getElementById('progressBar');
  const executionLogs = document.getElementById('executionLogs');

  const resultsSection = document.getElementById('resultsSection');
  const resultPageTitle = document.getElementById('resultPageTitle');
  const resultUrlLink = document.getElementById('resultUrlLink');
  const detectedCount = document.getElementById('detectedCount');
  const durationBadge = document.getElementById('durationBadge');
  const evidenceIdText = document.getElementById('evidenceIdText');
  const copyEvidenceBtn = document.getElementById('copyEvidenceBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const exportMdBtn = document.getElementById('exportMdBtn');

  // Preset Buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      urlInput.value = btn.getAttribute('data-url');
      form.requestSubmit();
    });
  });

  // Tab Navigation
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Copy Evidence ID
  copyEvidenceBtn.addEventListener('click', () => {
    const id = evidenceIdText.textContent;
    if (id && id !== 'N/A') {
      navigator.clipboard.writeText(id).then(() => {
        copyEvidenceBtn.textContent = 'Copiado!';
        setTimeout(() => copyEvidenceBtn.textContent = 'Copiar', 2000);
      });
    }
  });

  let currentReport = null;

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (!url) return;

    // Reset UI
    resultsSection.classList.add('hidden');
    statusSection.classList.remove('hidden');
    executionLogs.innerHTML = '';
    progressBar.style.width = '10%';
    submitBtn.disabled = true;
    btnText.textContent = 'A Inspecionar...';
    btnSpinner.classList.remove('hidden');

    updateStatus('A iniciar inspeção...', 'A preparar o ambiente do REA e Chromium Headless...', 20);
    appendLog(`[${new Date().toLocaleTimeString()}] A iniciar análise para: ${url}`);

    // Progress simulation
    const progressTimer = setInterval(() => {
      const cur = parseInt(progressBar.style.width) || 20;
      if (cur < 85) {
        progressBar.style.width = (cur + 15) + '%';
        if (cur === 35) {
          updateStatus('A capturar página via CDP...', 'A carregar o alvo no Chromium e a executar scripts...', 50);
          appendLog(`[${new Date().toLocaleTimeString()}] A sondar contexto dinâmico do navegador e scripts executados...`);
        } else if (cur === 65) {
          updateStatus('A extrair Evidência REA...', 'A executar rea inspect-web-page e a calcular hashes CDP...', 80);
          appendLog(`[${new Date().toLocaleTimeString()}] A processar recursos de rede, storage e árvore DOM...`);
        }
      }
    }, 1200);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          includeRawEvidence: rawEvidenceCheckbox.checked
        })
      });

      clearInterval(progressTimer);
      progressBar.style.width = '100%';

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido ao analisar o site.');
      }

      const data = await response.json();
      currentReport = data;

      updateStatus('Análise Concluída!', `Identificadas ${data.summary.detectedCount} tecnologias e plugins.`, 100);
      if (data.metadata?.logs) {
        data.metadata.logs.forEach(appendLog);
      }

      setTimeout(() => {
        statusSection.classList.add('hidden');
        renderResults(data);
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 600);

    } catch (err) {
      clearInterval(progressTimer);
      updateStatus('Erro na Análise', err.message, 100);
      appendLog(`[ERRO] ${err.message}`);
      alert(`Falha na análise: ${err.message}`);
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Analisar com REA';
      btnSpinner.classList.add('hidden');
    }
  });

  function updateStatus(title, desc, percent) {
    statusTitle.textContent = title;
    statusDesc.textContent = desc;
    progressBar.style.width = percent + '%';
  }

  function appendLog(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    executionLogs.appendChild(div);
    executionLogs.scrollTop = executionLogs.scrollHeight;
  }

  function renderResults(data) {
    const { summary, metadata, cms, plugins, themes, frameworks, ui, server, analytics, services, security, scriptsSummary } = data;

    // Header info
    resultPageTitle.textContent = summary.title || 'Sem Título';
    resultUrlLink.textContent = summary.targetUrl;
    resultUrlLink.href = summary.targetUrl;
    detectedCount.textContent = summary.detectedCount;
    durationBadge.textContent = `${metadata.durationMs || 0}ms`;
    evidenceIdText.textContent = summary.reaEvidenceId || 'N/A';

    // Counts on tab buttons
    document.getElementById('countPlugins').textContent = plugins.length + themes.length;
    document.getElementById('countFrameworks').textContent = frameworks.length + ui.length;
    document.getElementById('countServer').textContent = server.length + analytics.length;
    document.getElementById('countScripts').textContent = scriptsSummary?.totalScripts || 0;

    // 1. Overview Grid
    const overviewGrid = document.getElementById('overviewGrid');
    overviewGrid.innerHTML = `
      ${renderCategoryCard('📦 CMS & E-commerce', cms)}
      ${renderCategoryCard('🔌 Plugins WordPress & Apps', plugins)}
      ${renderCategoryCard('🎨 Temas', themes)}
      ${renderCategoryCard('⚡ Frameworks JavaScript', frameworks)}
      ${renderCategoryCard('💅 Estilo & UI', ui)}
      ${renderCategoryCard('🖥️ Servidor & CDN', server)}
      ${renderCategoryCard('📊 Analytics & Métricas', analytics)}
      ${renderCategoryCard('💳 Serviços & APIs', services)}
    `;

    // 2. Plugins Tab
    const pluginsList = document.getElementById('pluginsList');
    const allPluginsAndThemes = [...plugins, ...themes];
    if (allPluginsAndThemes.length === 0) {
      pluginsList.innerHTML = '<p class="empty-state">Nenhum plugin ou tema WordPress específico identificado explicitamente.</p>';
    } else {
      pluginsList.innerHTML = allPluginsAndThemes.map(renderTechCard).join('');
    }

    // 3. Frameworks Tab
    const frameworksList = document.getElementById('frameworksList');
    const allFrameworksAndUi = [...frameworks, ...ui];
    if (allFrameworksAndUi.length === 0) {
      frameworksList.innerHTML = '<p class="empty-state">Nenhum framework JS ou CSS detectado.</p>';
    } else {
      frameworksList.innerHTML = allFrameworksAndUi.map(renderTechCard).join('');
    }

    // 4. Server & CDN Tab
    const serverList = document.getElementById('serverList');
    const allServerAndAnalytics = [...server, ...analytics, ...services];
    if (allServerAndAnalytics.length === 0) {
      serverList.innerHTML = '<p class="empty-state">Nenhum servidor ou ferramenta de analytics detectada.</p>';
    } else {
      serverList.innerHTML = allServerAndAnalytics.map(renderTechCard).join('');
    }

    // 5. Scripts Tab
    const scriptsTableContainer = document.getElementById('scriptsTableContainer');
    if (!scriptsSummary || !scriptsSummary.scriptHashes || scriptsSummary.scriptHashes.length === 0) {
      scriptsTableContainer.innerHTML = '<p class="empty-state" style="padding:1.5rem">Nenhum script capturado pelo REA.</p>';
    } else {
      let rows = scriptsSummary.scriptHashes.map((s, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><code style="word-break:break-all">${escapeHtml(s.url || 'Script Inline / Dinâmico')}</code></td>
          <td>${s.length ? `${s.length} B` : '-'}</td>
          <td><code style="font-size:0.75rem">${s.hash ? s.hash.slice(0, 16) + '...' : '-'}</code></td>
        </tr>
      `).join('');

      scriptsTableContainer.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>URL do Script</th>
              <th>Tamanho</th>
              <th>Hash REA (CDP)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // 6. Security Tab
    const securityGrid = document.getElementById('securityGrid');
    securityGrid.innerHTML = `
      <div class="security-card">
        <div class="security-header">Content-Security-Policy (CSP)</div>
        <div class="security-value ${security.contentSecurityPolicy.includes('Configurado') ? 'security-status-active' : 'security-status-missing'}">
          ${escapeHtml(security.contentSecurityPolicy)}
        </div>
      </div>
      <div class="security-card">
        <div class="security-header">Strict-Transport-Security (HSTS)</div>
        <div class="security-value ${security.strictTransportSecurity.includes('Ativo') ? 'security-status-active' : 'security-status-missing'}">
          ${escapeHtml(security.strictTransportSecurity)}
        </div>
      </div>
      <div class="security-card">
        <div class="security-header">X-Frame-Options</div>
        <div class="security-value ${security.xFrameOptions !== 'Ausente' ? 'security-status-active' : 'security-status-missing'}">
          ${escapeHtml(security.xFrameOptions)}
        </div>
      </div>
      <div class="security-card">
        <div class="security-header">X-Content-Type-Options</div>
        <div class="security-value ${security.xContentTypeOptions !== 'Ausente' ? 'security-status-active' : 'security-status-missing'}">
          ${escapeHtml(security.xContentTypeOptions)}
        </div>
      </div>
      <div class="security-card">
        <div class="security-header">Referrer-Policy</div>
        <div class="security-value">
          ${escapeHtml(security.referrerPolicy)}
        </div>
      </div>
    `;

    // 7. Raw Evidence Tab
    const rawViewer = document.getElementById('rawEvidenceViewer');
    if (metadata.rawEvidence) {
      rawViewer.textContent = JSON.stringify(metadata.rawEvidence, null, 2);
    } else {
      rawViewer.textContent = JSON.stringify(data, null, 2);
    }
  }

  function renderCategoryCard(title, items) {
    const count = items ? items.length : 0;
    let content = '<p class="empty-state">Não detectado</p>';

    if (count > 0) {
      content = `
        <div class="item-badge-list">
          ${items.map(item => `
            <div class="item-row">
              <div>
                <span class="item-name">${escapeHtml(item.name)}</span>
                ${item.version ? `<span class="item-version">v${escapeHtml(item.version)}</span>` : ''}
              </div>
              <span class="item-evidence-tag" title="${escapeHtml(item.evidence?.[0] || '')}">
                ${escapeHtml(item.category || '')}
              </span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="category-card">
        <div class="category-card-header">
          <div class="category-card-title">${title}</div>
          <span class="category-count">${count}</span>
        </div>
        ${content}
      </div>
    `;
  }

  function renderTechCard(item) {
    const evidenceList = item.evidence ? item.evidence.map(e => `<li>${escapeHtml(e)}</li>`).join('') : '';
    return `
      <div class="tech-card">
        <div>
          <div class="tech-card-header">
            <div>
              <div class="tech-card-name">
                ${escapeHtml(item.name)}
                ${item.version ? `<span class="item-version">v${escapeHtml(item.version)}</span>` : ''}
              </div>
              <div class="tech-card-category">${escapeHtml(item.category || '')}</div>
            </div>
          </div>
          <div class="tech-evidence-box" style="margin-top:0.65rem;">
            <ul style="padding-left:1rem;margin:0;">
              ${evidenceList}
            </ul>
          </div>
        </div>
        <div class="tech-card-footer">
          ${item.website ? `<a href="${escapeHtml(item.website)}" target="_blank" rel="noopener noreferrer" class="tech-website-link">Página Oficial &rarr;</a>` : '<span></span>'}
          <span class="badge badge-neutral" style="font-size:0.7rem;">Evidência REA</span>
        </div>
      </div>
    `;
  }

  // Export Handlers
  exportJsonBtn.addEventListener('click', () => {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-rea-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  exportMdBtn.addEventListener('click', () => {
    if (!currentReport) return;
    const md = generateMarkdownReport(currentReport);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-rea-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

  function generateMarkdownReport(report) {
    const { summary, metadata, cms, plugins, themes, frameworks, ui, server, analytics, services, security } = report;
    let md = `# Relatório de Engenharia Reversa REA\n\n`;
    md += `- **URL Alvo:** ${summary.targetUrl}\n`;
    md += `- **Título:** ${summary.title}\n`;
    md += `- **Evidência REA ID:** \`${summary.reaEvidenceId || 'N/A'}\`\n`;
    md += `- **Deteções Totais:** ${summary.detectedCount}\n`;
    md += `- **Data de Análise:** ${summary.analyzedAt}\n\n`;

    const addSection = (title, items) => {
      if (!items || items.length === 0) return;
      md += `## ${title}\n\n`;
      for (const item of items) {
        md += `- **${item.name}** ${item.version ? `(v${item.version})` : ''} - *${item.category}*\n`;
        if (item.website) md += `  - Link: ${item.website}\n`;
        if (item.evidence && item.evidence.length > 0) {
          md += `  - Evidência REA: ${item.evidence[0]}\n`;
        }
      }
      md += `\n`;
    };

    addSection('CMS & Plataforma', cms);
    addSection('Plugins & Extensões', plugins);
    addSection('Temas', themes);
    addSection('Frameworks JavaScript', frameworks);
    addSection('UI & Estilização', ui);
    addSection('Servidor & Infraestrutura / CDN', server);
    addSection('Analytics & Rastreamento', analytics);
    addSection('Serviços de Terceiros & APIs', services);

    md += `## Cabeçalhos de Segurança\n\n`;
    for (const [k, v] of Object.entries(security)) {
      md += `- **${k}:** ${v}\n`;
    }

    return md;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
