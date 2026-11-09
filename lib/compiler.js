/**
 * Report Compiler for Web-Searcher
 * Compiles exhaustive technical dossiers of websites into structured formats:
 * - Executive Dossier (JSON)
 * - Standalone Printable HTML Report
 * - Markdown Audit Documentation
 */

class ReportCompiler {
  constructor() {
    this.hostingProviderPrefixes = [
      'hostinger',
      'godaddy',
      'bluehost',
      'siteground',
      'wpengine',
      'kinsta',
      'dreamhost',
      'automattic'
    ];
  }

  /**
   * Compile raw analysis into an organized executive dossier
   */
  compile(analysisResult) {
    const { summary, cms, plugins, themes, frameworks, ui, server, analytics, services, security, scriptsSummary, metadata } = analysisResult;

    // Segregate plugins into Independent (3rd-party) vs Hosting Provider bundle
    const independentPlugins = [];
    const hostingPlugins = [];

    for (const plugin of plugins || []) {
      const slugLower = (plugin.slug || plugin.name).toLowerCase();
      const isHosting = this.hostingProviderPrefixes.some(h => slugLower.includes(h));
      if (isHosting) {
        hostingPlugins.push({ ...plugin, isHostingBundle: true });
      } else {
        independentPlugins.push({ ...plugin, isHostingBundle: false });
      }
    }

    // Determine security score
    let securityScore = 0;
    const maxScore = 5;
    if (security.contentSecurityPolicy && security.contentSecurityPolicy !== 'Ausente') securityScore++;
    if (security.strictTransportSecurity && security.strictTransportSecurity !== 'Ausente') securityScore++;
    if (security.xFrameOptions && security.xFrameOptions !== 'Ausente') securityScore++;
    if (security.xContentTypeOptions && security.xContentTypeOptions !== 'Ausente') securityScore++;
    if (security.referrerPolicy && !security.referrerPolicy.includes('Padrão')) securityScore++;

    const compiledDossier = {
      meta: {
        targetUrl: summary.targetUrl,
        pageTitle: summary.title,
        generatedAt: new Date().toISOString(),
        analysisDurationMs: metadata?.durationMs || 0,
        reaEvidenceId: summary.reaEvidenceId || 'N/A',
        reaConfidence: summary.reaConfidence || 'observed',
        reaTool: metadata?.reaTool || 'rea inspect-web-page'
      },
      executiveSummary: {
        cms: cms.length > 0 ? cms[0].name + (cms[0].version ? ` v${cms[0].version}` : '') : 'Não identificado / Custom SPA',
        activeTheme: themes.length > 0 ? themes[0].name : 'Nenhum tema específico',
        totalPlugins: (plugins || []).length,
        independentPluginsCount: independentPlugins.length,
        hostingPluginsCount: hostingPlugins.length,
        frameworksCount: (frameworks || []).length,
        serverStack: server.map(s => s.name).join(', ') || 'N/A',
        securityRating: `${securityScore}/${maxScore}`
      },
      pluginsDossier: {
        independent: independentPlugins,
        hostingBundle: hostingPlugins
      },
      architecture: {
        cms,
        themes,
        frameworks,
        uiFrameworks: ui,
        analytics,
        thirdPartyServices: services
      },
      infrastructure: {
        serverStack: server,
        securityHeaders: security,
        securityScore: `${securityScore}/${maxScore}`
      },
      scriptsAudit: {
        totalScriptsLoaded: scriptsSummary?.totalScripts || 0,
        totalResourcesMonitored: scriptsSummary?.totalResources || 0,
        scriptsList: (scriptsSummary?.scriptHashes || []).slice(0, 50)
      }
    };

    return compiledDossier;
  }

  /**
   * Generate a standalone, printable, professional HTML dossier
   */
  generateHtmlReport(compiledDossier) {
    const { meta, executiveSummary, pluginsDossier, architecture, infrastructure, scriptsAudit } = compiledDossier;

    const renderPluginRows = (list) => {
      if (!list || list.length === 0) return '<tr><td colspan="4" style="text-align:center;color:#64748b;padding:12px;">Nenhum plugin identificado nesta categoria.</td></tr>';
      return list.map((p, idx) => `
        <tr>
          <td><strong>${idx + 1}. ${this.escape(p.name)}</strong></td>
          <td><span class="badge badge-cat">${this.escape(p.category)}</span></td>
          <td><code class="code-sm">${this.escape(p.slug || p.name)}</code></td>
          <td class="text-sm">${this.escape(p.evidence?.[0] || 'Detectado')}</td>
        </tr>
      `).join('');
    };

    return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <title>Dossiê Técnico &bull; ${this.escape(meta.pageTitle)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 2rem; line-height: 1.5; }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 2.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.6rem; color: #0f172a; }
    .url { font-family: monospace; color: #2563eb; font-size: 0.95rem; word-break: break-all; }
    .meta-box { background: #f1f5f9; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; font-size: 0.85rem; font-family: monospace; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; }
    .grid-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card-kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; }
    .card-kpi-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 0.25rem; }
    .card-kpi-val { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
    h2 { font-size: 1.2rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem; }
    th { background: #f8fafc; text-align: left; padding: 0.75rem; border-bottom: 1px solid #cbd5e1; color: #475569; font-weight: 600; }
    td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .badge-cat { background: #eff6ff; color: #1e40af; }
    .badge-pill { background: #e0f2fe; color: #0369a1; border-radius: 9999px; padding: 0.15rem 0.5rem; font-size: 0.75rem; }
    .code-sm { font-family: monospace; font-size: 0.8rem; background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 4px; }
    .text-sm { font-size: 0.8rem; color: #475569; }
    .footer { text-align: center; margin-top: 3rem; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; }
    @media print { body { background: #fff; padding: 0; } .container { box-shadow: none; border: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>Dossiê de Tecnologias & Plugins</h1>
        <div class="url">${this.escape(meta.targetUrl)}</div>
        <div style="font-size:0.85rem;color:#64748b;margin-top:0.35rem;">Título: ${this.escape(meta.pageTitle)}</div>
      </div>
      <button onclick="window.print()" style="cursor:pointer;background:#2563eb;color:#fff;border:none;padding:0.5rem 1rem;border-radius:6px;font-weight:600;font-size:0.85rem;">Imprimir / PDF</button>
    </div>

    <div class="meta-box">
      <div><strong>Data da Auditoria:</strong> ${this.escape(meta.generatedAt.slice(0, 19).replace('T', ' '))}</div>
      <div><strong>Evidência REA ID:</strong> ${this.escape(meta.reaEvidenceId)}</div>
      <div><strong>Ferramenta:</strong> ${this.escape(meta.reaTool)}</div>
      <div><strong>Duração:</strong> ${meta.analysisDurationMs}ms</div>
    </div>

    <div class="grid-summary">
      <div class="card-kpi">
        <div class="card-kpi-label">Plataforma Principal</div>
        <div class="card-kpi-val">${this.escape(executiveSummary.cms)}</div>
      </div>
      <div class="card-kpi">
        <div class="card-kpi-label">Plugins Independentes</div>
        <div class="card-kpi-val" style="color:#2563eb;">${executiveSummary.independentPluginsCount}</div>
      </div>
      <div class="card-kpi">
        <div class="card-kpi-label">Bundle de Hospedagem</div>
        <div class="card-kpi-val" style="color:#64748b;">${executiveSummary.hostingPluginsCount}</div>
      </div>
      <div class="card-kpi">
        <div class="card-kpi-label">Segurança HTTP</div>
        <div class="card-kpi-val" style="color:#059669;">${executiveSummary.securityRating}</div>
      </div>
    </div>

    <h2>
      <span>🔌 Plugins em Uso (Fora da Hospedagem)</span>
      <span class="badge-pill">${executiveSummary.independentPluginsCount} Plugins</span>
    </h2>
    <table>
      <thead>
        <tr>
          <th>Nome do Plugin</th>
          <th>Função / Categoria</th>
          <th>Slug / Identificador</th>
          <th>Evidência Rastreável</th>
        </tr>
      </thead>
      <tbody>
        ${renderPluginRows(pluginsDossier.independent)}
      </tbody>
    </table>

    ${pluginsDossier.hostingBundle.length > 0 ? `
      <h2>
        <span>🏢 Plugins do Bundle do Fornecedor de Hospedagem</span>
        <span class="badge-pill">${executiveSummary.hostingPluginsCount} Plugins</span>
      </h2>
      <table>
        <thead>
          <tr>
            <th>Nome do Plugin</th>
            <th>Função / Categoria</th>
            <th>Slug</th>
            <th>Evidência</th>
          </tr>
        </thead>
        <tbody>
          ${renderPluginRows(pluginsDossier.hostingBundle)}
        </tbody>
      </table>
    ` : ''}

    <h2><span>🎨 Temas do Sistema</span></h2>
    <table>
      <thead>
        <tr>
          <th>Tema</th>
          <th>Categoria</th>
          <th>Evidência</th>
        </tr>
      </thead>
      <tbody>
        ${architecture.themes.length > 0 ? architecture.themes.map(t => `
          <tr>
            <td><strong>${this.escape(t.name)}</strong></td>
            <td>${this.escape(t.category)}</td>
            <td class="text-sm">${this.escape(t.evidence?.[0] || 'Ativo')}</td>
          </tr>
        `).join('') : '<tr><td colspan="3">Nenhum tema específico identificado.</td></tr>'}
      </tbody>
    </table>

    <h2><span>🖥️ Infraestrutura, Servidor & Segurança</span></h2>
    <table>
      <thead>
        <tr>
          <th>Componente</th>
          <th>Classificação</th>
          <th>Evidência Observada</th>
        </tr>
      </thead>
      <tbody>
        ${infrastructure.serverStack.map(s => `
          <tr>
            <td><strong>${this.escape(s.name)}</strong> ${s.version ? `v${this.escape(s.version)}` : ''}</td>
            <td><span class="badge badge-cat">${this.escape(s.category)}</span></td>
            <td class="text-sm">${this.escape(s.evidence?.[0] || 'Ativo')}</td>
          </tr>
        `).join('')}
        <tr>
          <td><strong>Content-Security-Policy (CSP)</strong></td>
          <td>Proteção XSS</td>
          <td class="text-sm">${this.escape(infrastructure.securityHeaders.contentSecurityPolicy)}</td>
        </tr>
        <tr>
          <td><strong>Strict-Transport-Security (HSTS)</strong></td>
          <td>Criptografia HTTPS</td>
          <td class="text-sm">${this.escape(infrastructure.securityHeaders.strictTransportSecurity)}</td>
        </tr>
        <tr>
          <td><strong>X-Frame-Options</strong></td>
          <td>Anti-Clickjacking</td>
          <td class="text-sm">${this.escape(infrastructure.securityHeaders.xFrameOptions)}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      Relatório compilado automaticamente pelo <strong>Web-Searcher</strong> via <strong>REA (Reverse Engineer Anything)</strong> &bull; Análise auditável com ID <code>${this.escape(meta.reaEvidenceId)}</code>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate clean Markdown document
   */
  generateMarkdownReport(compiledDossier) {
    const { meta, executiveSummary, pluginsDossier, architecture, infrastructure } = compiledDossier;

    let md = `# Dossiê Técnico de Engenharia Reversa\n\n`;
    md += `> **Alvo:** [${meta.targetUrl}](${meta.targetUrl})\n`;
    md += `> **Título:** ${meta.pageTitle}\n`;
    md += `> **Evidência REA ID:** \`${meta.reaEvidenceId}\`\n`;
    md += `> **Data da Auditoria:** ${meta.generatedAt.slice(0, 19).replace('T', ' ')}\n\n`;

    md += `## 📊 Resumo Executivo\n\n`;
    md += `- **CMS / Plataforma:** ${executiveSummary.cms}\n`;
    md += `- **Tema Ativo:** ${executiveSummary.activeTheme}\n`;
    md += `- **Plugins Independentes (3rd-Party):** ${executiveSummary.independentPluginsCount}\n`;
    md += `- **Plugins de Hospedagem (Bundle):** ${executiveSummary.hostingPluginsCount}\n`;
    md += `- **Servidor & Stack:** ${executiveSummary.serverStack}\n`;
    md += `- **Pontuação de Segurança HTTP:** ${executiveSummary.securityRating}\n\n`;

    md += `## 🔌 Plugins em Uso (Fora da Hospedagem)\n\n`;
    if (pluginsDossier.independent.length === 0) {
      md += `*Nenhum plugin independente identificado.*\n\n`;
    } else {
      md += `| # | Plugin | Categoria | Evidência |\n`;
      md += `| :-: | :--- | :--- | :--- |\n`;
      pluginsDossier.independent.forEach((p, idx) => {
        md += `| ${idx + 1} | **${p.name}** | ${p.category} | \`${p.evidence?.[0] || 'Ativo'}\` |\n`;
      });
      md += `\n`;
    }

    if (pluginsDossier.hostingBundle.length > 0) {
      md += `## 🏢 Plugins do Fornecedor de Hospedagem\n\n`;
      md += `| # | Plugin | Categoria | Evidência |\n`;
      md += `| :-: | :--- | :--- | :--- |\n`;
      pluginsDossier.hostingBundle.forEach((p, idx) => {
        md += `| ${idx + 1} | **${p.name}** | ${p.category} | \`${p.evidence?.[0] || 'Ativo'}\` |\n`;
      });
      md += `\n`;
    }

    md += `## 🎨 Temas & Frameworks\n\n`;
    architecture.themes.forEach(t => {
      md += `- **Tema:** ${t.name} (${t.category})\n`;
    });
    architecture.frameworks.forEach(f => {
      md += `- **Framework:** ${f.name} ${f.version ? `v${f.version}` : ''} (${f.category})\n`;
    });
    md += `\n`;

    md += `## 🖥️ Infraestrutura & Segurança\n\n`;
    infrastructure.serverStack.forEach(s => {
      md += `- **Servidor/CDN:** ${s.name} ${s.version ? `v${s.version}` : ''} (${s.category})\n`;
    });
    md += `- **CSP:** ${infrastructure.securityHeaders.contentSecurityPolicy}\n`;
    md += `- **HSTS:** ${infrastructure.securityHeaders.strictTransportSecurity}\n`;
    md += `- **X-Frame-Options:** ${infrastructure.securityHeaders.xFrameOptions}\n\n`;

    md += `---\n*Gerado automaticamente pelo motor Web-Searcher REA.*\n`;
    return md;
  }

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = ReportCompiler;
