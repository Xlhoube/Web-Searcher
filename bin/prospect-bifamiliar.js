#!/usr/bin/env node

/**
 * CLI Tool: Bifamiliar Real Estate Prospector & Opportunity Evaluator
 * Usage:
 *   node bin/prospect-bifamiliar.js <url_ou_texto>
 *   node bin/prospect-bifamiliar.js --demo
 */

const BifamiliarProspector = require('../lib/bifamiliar-prospector');

async function main() {
  const args = process.argv.slice(2);
  const input = args[0];

  const prospector = new BifamiliarProspector();

  if (!input || input === '--help') {
    console.log(`
🏠 Web-Searcher: Prospetor Especializado em Moradias Bifamiliares

Uso:
  node bin/prospect-bifamiliar.js <url_do_anuncio>
  node bin/prospect-bifamiliar.js --demo

Exemplos:
  node bin/prospect-bifamiliar.js https://www.imovirtual.com/anuncio/moradia-bifamiliar...
  node bin/prospect-bifamiliar.js --demo
    `);
    process.exit(1);
  }

  let propertyData = {};

  if (input === '--demo') {
    propertyData = {
      url: 'https://exemplo-portal.pt/imovel/moradia-bifamiliar-porto',
      title: 'Moradia Bifamiliar T3+T2 com Entradas Independentes e Garagem Dupla',
      location: 'Vila Nova de Gaia / Porto',
      price: 345000,
      area: 280,
      description: `
        Excelente moradia bi-familiar composta por duas habitações com entradas totalmente independentes.
        Piso 0: Apartamento T2 com cozinha equipada, sala ampla, 2 quartos e acesso a logradouro privativo.
        Piso 1: Apartamento T3 com cozinha, varanda espaçosa, suite e 2 quartos.
        Dispõe de contadores de água e eletricidade separados.
        Garagem box para 2 viaturas e quintal comum.
        Ideal para duas famílias ou para investimento (habitar um piso e rentabilizar o outro).
      `,
      contacts: {
        agentName: 'Gonçalo Silva',
        agency: 'Imobiliária Prime Norte',
        phone: '+351 912 345 678'
      }
    };
  } else {
    // Live URL fetch
    console.log(`\n🔍 A inspecionar anúncio imobiliário em: ${input} ...`);
    try {
      const res = await fetch(input, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(12000)
      });
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Imóvel Bifamiliar';

      propertyData = {
        url: input,
        title,
        html,
        description: html.slice(0, 5000),
        contacts: {
          agentName: 'Consultor Imobiliário',
          agency: 'Portal Imobiliário'
        }
      };
    } catch (err) {
      console.log(`Aviso ao descarregar URL: ${err.message}. A prosseguir com análise textual.`);
      propertyData = {
        url: input,
        title: 'Moradia com Potencial Bifamiliar',
        description: input
      };
    }
  }

  const analysis = prospector.analyzeProperty(propertyData);

  console.log(`\n================================================================`);
  console.log(`🏡 PROSPECÇÃO DE MORADIA BIFAMILIAR & AUDITORIA DE INVESTIMENTO`);
  console.log(`================================================================`);
  console.log(`📍 Imóvel:         ${analysis.overview.title}`);
  console.log(`🗺️ Localização:    ${analysis.overview.location}`);
  console.log(`💰 Preço:          ${analysis.overview.priceFormatted} (${analysis.overview.pricePerM2})`);
  console.log(`📐 Área Bruta:     ${analysis.overview.area}`);
  console.log(`⭐ Oportunidade:   \x1b[32m${analysis.overview.opportunityScore}/100\x1b[0m (${analysis.overview.scoreLabel})`);
  console.log(`----------------------------------------------------------------\n`);

  console.log(`🔍 VIABILIDADE BIFAMILIAR:`);
  console.log(`  • Entradas Independentes:  ${analysis.bifamiliarViability.features.independentEntrances ? '✅ Sim (Privacidade Total)' : '⚠️ A verificar no local'}`);
  console.log(`  • 2 Cozinhas Completas:    ${analysis.bifamiliarViability.features.twoKitchens ? '✅ Sim (2 Frações Operacionais)' : '⚠️ Apenas 1 descrita'}`);
  console.log(`  • Contadores Separados:    ${analysis.bifamiliarViability.features.separateMeters ? '✅ Sim (Água/Luz autónomos)' : '⚠️ Contadores partilhados'}`);
  console.log(`  • Espaço Exterior/Quintal: ${analysis.bifamiliarViability.features.outdoorSpace ? '✅ Sim (Logradouro/Jardim)' : '❌ Sem logradouro'}`);
  console.log(`  • Regime Jurídico:         📑 ${analysis.bifamiliarViability.legalStatus}\n`);

  console.log(`📈 SIMULAÇÃO FINANCEIRA & RENTABILIDADE DUPLA:`);
  console.log(`  • Renda Estimada Fração 1 (Piso 0): ${analysis.financialMetrics.estimatedRents.fractionA}`);
  console.log(`  • Renda Estimada Fração 2 (Piso 1): ${analysis.financialMetrics.estimatedRents.fractionB}`);
  console.log(`  • Renda Total Mensal (Duplo Arrendamento): \x1b[32m${analysis.financialMetrics.estimatedRents.totalCombined}\x1b[0m`);
  console.log(`  • Yield Bruto Anual Estimado:              \x1b[32m${analysis.financialMetrics.grossYieldFormatted}\x1b[0m`);
  console.log(`  • Prestação Bancária Estimada (Crédito):   ${analysis.financialMetrics.estimatedMortgageMonthly}`);
  console.log(`  • Cenário 'Viver num piso e inquilino paga o crédito':`);
  console.log(`    👉 ${analysis.financialMetrics.ownerOccupiedScenario.remainingMortgageToPay}\n`);

  console.log(`🎯 PITCH / MENSAGEM DE ABORDAGEM AO AGENTE / PROPRIETÁRIO:`);
  console.log(`----------------------------------------------------------------`);
  console.log(analysis.prospectingStrategy.outreachPitch);
  console.log(`----------------------------------------------------------------\n`);
  console.log(`✅ Auditoria de prospecção concluída com sucesso.\n`);
}

main();
