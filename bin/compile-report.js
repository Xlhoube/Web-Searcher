#!/usr/bin/env node

/**
 * CLI Tool: Web-Searcher Report Compiler
 * Compiles a full audit dossier of any website in HTML, Markdown or JSON.
 * Usage: node bin/compile-report.js <url> [--format html|md|json] [--output path]
 */

const fs = require('fs');
const path = require('path');
const SiteAnalyzer = require('../lib/analyzer');
const ReportCompiler = require('../lib/compiler');

async function main() {
  const args = process.argv.slice(2);
  const targetUrl = args.find(a => !a.startsWith('--'));

  let format = 'html';
  const formatArgIdx = args.indexOf('--format');
  if (formatArgIdx !== -1 && args[formatArgIdx + 1]) {
    format = args[formatArgIdx + 1].toLowerCase();
  }

  let outputFile = null;
  const outputArgIdx = args.indexOf('--output');
  if (outputArgIdx !== -1 && args[outputArgIdx + 1]) {
    outputFile = args[outputArgIdx + 1];
  }

  if (!targetUrl) {
    console.log(`
Uso:
  node bin/compile-report.js <url> [opções]

Opções:
  --format <html|md|json>   Formato do dossiê (padrão: html)
  --output <caminho>        Salva o dossiê compilado no arquivo especificado
  --help                    Exibe esta ajuda

Exemplos:
  node bin/compile-report.js https://igrejafamilia.net/ --format html --output relatorio.html
  node bin/compile-report.js https://igrejafamilia.net/ --format md
    `);
    process.exit(1);
  }

  console.log(`\n📦 A recolher e a compilar dossiê completo para: ${targetUrl} ...`);
  const analyzer = new SiteAnalyzer();
  const compiler = new ReportCompiler();

  try {
    const rawAnalysis = await analyzer.analyze(targetUrl);
    const dossier = compiler.compile(rawAnalysis);

    let outputContent = '';
    let defaultExt = '.html';

    if (format === 'json') {
      outputContent = JSON.stringify(dossier, null, 2);
      defaultExt = '.json';
    } else if (format === 'md' || format === 'markdown') {
      outputContent = compiler.generateMarkdownReport(dossier);
      defaultExt = '.md';
    } else {
      outputContent = compiler.generateHtmlReport(dossier);
      defaultExt = '.html';
    }

    if (outputFile) {
      const resolvedPath = path.resolve(process.cwd(), outputFile);
      fs.writeFileSync(resolvedPath, outputContent, 'utf-8');
      console.log(`\n✅ Dossiê compilado com sucesso e gravado em:`);
      console.log(`   📄 ${resolvedPath}\n`);
    } else {
      if (format === 'json' || format === 'md') {
        console.log('\n' + outputContent);
      } else {
        const tempName = `dossie-${new Date().toISOString().slice(0, 10)}${defaultExt}`;
        const tempPath = path.resolve(process.cwd(), tempName);
        fs.writeFileSync(tempPath, outputContent, 'utf-8');
        console.log(`\n✅ Relatório HTML executivo compilado e gerado em:`);
        console.log(`   📄 ${tempPath}\n`);
      }
    }
  } catch (err) {
    console.error(`\n❌ Erro ao compilar dossiê: ${err.message}`);
    process.exit(1);
  }
}

main();
