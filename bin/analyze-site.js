#!/usr/bin/env node

/**
 * CLI Tool: Web-Searcher Analyzer powered by REA
 * Usage: node bin/analyze-site.js <url> [--json] [--verbose]
 */

const SiteAnalyzer = require('../lib/analyzer');

async function main() {
  const args = process.argv.slice(2);
  const targetUrl = args.find(a => !a.startsWith('--'));
  const isJson = args.includes('--json');
  const isVerbose = args.includes('--verbose');

  if (!targetUrl) {
    console.log(`
Uso:
  node bin/analyze-site.js <url> [opções]

Opções:
  --json       Exibe a saída completa em formato JSON
  --verbose    Mostra os logs detalhados da execução do REA
  --help       Exibe esta mensagem de ajuda

Exemplo:
  node bin/analyze-site.js https://wordpress.org
    `);
    process.exit(1);
  }

  const analyzer = new SiteAnalyzer();

  if (!isJson) {
    console.log('\n🔍 Analisando site com REA (Reverse Engineer Anything)...');
    console.log(`🎯 Alvo: ${targetUrl}\n`);
  }

  try {
    const result = await analyzer.analyze(targetUrl, {
      includeRawEvidence: isJson
    });

    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (isVerbose) {
      console.log('--- LOGS DE EXECUÇÃO REA ---');
      result.metadata.logs.forEach(l => console.log(l));
      console.log('----------------------------\n');
    }

    console.log(`=======================================================`);
    console.log(`🌐 Título da Página: ${result.summary.title}`);
    console.log(`🔗 URL Final:        ${result.summary.targetUrl}`);
    console.log(`🆔 Evidência REA:    ${result.summary.reaEvidenceId || 'N/A'}`);
    console.log(`⏱️ Tempo de Análise:  ${result.metadata.durationMs}ms`);
    console.log(`✨ Total Detectado:  ${result.summary.detectedCount} tecnologias/plugins`);
    console.log(`=======================================================\n`);

    printSection('📦 CMS & Plataforma', result.cms);
    printSection('🔌 Plugins & Extensões', result.plugins);
    printSection('🎨 Temas Detectados', result.themes);
    printSection('⚡ Frameworks & Bibliotecas JS', result.frameworks);
    printSection('💅 UI & Frameworks CSS', result.ui);
    printSection('🖥️ Servidor & Infraestrutura / CDN', result.server);
    printSection('📊 Analytics & Rastreamento', result.analytics);
    printSection('💳 Serviços & APIs de Terceiros', result.services);

    console.log('🛡️  Cabeçalhos de Segurança:');
    for (const [k, v] of Object.entries(result.security)) {
      console.log(`  • ${k}: ${v}`);
    }
    console.log('');

    console.log(`📜 Scripts Carregados no Navegador: ${result.scriptsSummary.totalScripts}`);
    console.log(`📦 Recursos Totais Monitorados:     ${result.scriptsSummary.totalResources}`);
    console.log('\n✅ Análise concluída com sucesso.\n');
  } catch (err) {
    console.error('\n❌ Erro durante a análise:', err.message);
    process.exit(1);
  }
}

function printSection(title, items) {
  if (!items || items.length === 0) return;
  console.log(`${title}:`);
  for (const item of items) {
    const versionStr = item.version ? ` (v${item.version})` : '';
    const catStr = item.category ? ` [${item.category}]` : '';
    console.log(`  • \x1b[32m${item.name}\x1b[0m${versionStr}${catStr}`);
    if (item.website) {
      console.log(`    Site: ${item.website}`);
    }
    if (item.evidence && item.evidence.length > 0) {
      console.log(`    Evidência REA: ${item.evidence[0]}`);
    }
  }
  console.log('');
}

main();
