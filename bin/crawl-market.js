#!/usr/bin/env node

/**
 * CLI Tool: Crawl Market for Bifamiliar Houses
 * Usage:
 *   ./bin/crawl-market.js [--portal casasapo|imovirtual|all] [--district porto|lisboa|all] [--max-price 400000] [--json]
 */

const MarketCrawler = require('../lib/market-crawler');

const args = process.argv.slice(2);
const isJson = args.includes('--json');

let portal = 'all';
let district = 'todos';
let maxPrice = 0;
let sortBy = 'score';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--portal' && args[i + 1]) {
    portal = args[i + 1];
  } else if (args[i] === '--district' && args[i + 1]) {
    district = args[i + 1];
  } else if (args[i] === '--max-price' && args[i + 1]) {
    maxPrice = parseFloat(args[i + 1]);
  } else if (args[i] === '--sort' && args[i + 1]) {
    sortBy = args[i + 1];
  }
}

(async () => {
  const crawler = new MarketCrawler();

  if (!isJson) {
    console.log(`\n========================================================================`);
    console.log(`🌐 Web-Searcher: Varredura de Mercado de Moradias Bifamiliares`);
    console.log(`========================================================================`);
    console.log(`📡 Portal: ${portal.toUpperCase()} | 📍 Distrito: ${district.toUpperCase()} | 💶 Preço Máx: ${maxPrice > 0 ? '€ ' + maxPrice.toLocaleString('pt-PT') : 'Sem Limite'}\n`);
  }

  const report = await crawler.searchMarket({
    portal,
    district,
    maxPrice,
    sortBy
  });

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
  }

  console.log(`🔍 Total de Imóveis Encontrados: ${report.totalFound}`);
  console.log(`📈 Yield Bruto Médio: ${report.averageYield}%\n`);

  if (report.results.length === 0) {
    console.log(`Nenhuma oportunidade encontrada com os filtros especificados.`);
    process.exit(0);
  }

  console.log(`------------------------------------------------------------------------`);
  report.results.forEach((item, idx) => {
    console.log(`[#${idx + 1}] ${item.title}`);
    console.log(`    🏢 Portal: ${item.portal} | 📍 Localização: ${item.location} (${item.area})`);
    console.log(`    💶 Preço: ${item.priceFormatted} (${item.pricePerM2})`);
    console.log(`    📈 Renda Dupla Estimada: ${item.totalMonthlyRent} | Yield: ${item.grossYieldFormatted}`);
    console.log(`    🏆 Score: ${item.opportunityScore}/100 (${item.scoreLabel})`);
    console.log(`    ⚖️ Jurídico: ${item.legalStatus}`);
    console.log(`    📞 Contacto: ${item.contacts?.agency} (${item.contacts?.phone})`);
    console.log(`    🔗 URL: ${item.url}`);
    console.log(`------------------------------------------------------------------------`);
  });

  console.log(`\n💡 Dica: Pode auditar qualquer destes imóveis detalhadamente com:`);
  console.log(`   ./bin/prospect-bifamiliar.js "${report.results[0].title}" --price ${report.results[0].price}\n`);
})();
