/**
 * Bifamiliar Real Estate Prospector & Analyzer
 * Specializes in identifying, extracting, and calculating financial metrics for
 * two-family houses (moradias bifamiliares / 2 habitações independentes).
 */

class BifamiliarProspector {
  constructor() {
    this.bifamiliarKeywords = [
      'bifamiliar',
      'bi-familiar',
      'duas famílias',
      '2 famílias',
      'duas habitações',
      '2 habitações',
      'entradas independentes',
      'entrada independente',
      'acessos independentes',
      'duas frações',
      '2 frações',
      'dois pisos independentes',
      '2 pisos independentes',
      'dois apartamentos',
      '2 apartamentos',
      'duas cozinhas',
      '2 cozinhas',
      'contadores independentes',
      'propriedade total com andares',
      'rendimento duplo',
      'dupla renda'
    ];
  }

  /**
   * Analyze property content (HTML, text, or metadata)
   */
  analyzeProperty(data) {
    const { url = '', title = '', description = '', price = 0, location = '', html = '', contacts = {} } = data;

    const fullText = `${title} ${description} ${html}`.toLowerCase();

    // 1. Keyword matching & Evidence extraction
    const detectedKeywords = [];
    for (const kw of this.bifamiliarKeywords) {
      if (fullText.includes(kw)) {
        detectedKeywords.push(kw);
      }
    }

    // 2. Assess Bifamiliar viability features
    const kitchenCount = (fullText.match(/cozinha/gi) || []).length;
    const features = {
      independentEntrances: /entradas?\s+independentes?|acessos?\s+independentes?|2\s+entradas|duas\s+entradas/i.test(fullText),
      twoKitchens: /duas?\s+cozinhas?|2\s+cozinhas?/i.test(fullText) || kitchenCount >= 2,
      twoUnits: /duas?\s+habitaç[õo]es|2\s+habitaç[õo]es|dois\s+pisos\s+independentes|2\s+pisos\s+independentes|dois\s+apartamentos|2\s+apartamentos/i.test(fullText),
      horizontalProperty: /propriedade\s+horizontal/i.test(fullText),
      totalPropertyWithDivisions: /propriedade\s+total/i.test(fullText),
      separateMeters: /contadores?.*(?:independentes?|separados?)/i.test(fullText),
      outdoorSpace: /jardim|logradouro|quintal|terreno|pátio/i.test(fullText),
      garageOrParking: /garagem|estacionamento|box/i.test(fullText)
    };

    // 3. Extract area and rooms if possible
    const areaMatch = fullText.match(/(\d{2,4})\s*(?:m2|m²)/i);
    const area = areaMatch ? parseInt(areaMatch[1], 10) : (data.area || 220);

    const numericPrice = typeof price === 'number' && price > 0 ? price : this.extractPrice(fullText);

    // 4. Calculate Financial Metrics (Yield, Cash Flow & Mortgage Offset)
    const financialAnalysis = this.calculateFinancials(numericPrice, area, location);

    // 5. Calculate Opportunity Score (0 - 100)
    let score = 30; // base score if matches query
    if (detectedKeywords.length >= 2) score += 20;
    if (features.independentEntrances) score += 15;
    if (features.twoKitchens) score += 15;
    if (features.separateMeters) score += 10;
    if (features.horizontalProperty) score += 10; // easier to sell fraction separately
    if (financialAnalysis.grossYield >= 7.0) score += 10;
    score = Math.min(score, 100);

    // 6. Generate Prospecting Outreach Message (Pitch for Agent or Owner)
    const outreachPitch = this.generateOutreachPitch({
      title: title || 'Moradia Bifamiliar',
      price: numericPrice,
      location: location || 'sua região',
      agentName: contacts.agentName || 'Consultor Imobiliário',
      contacts
    });

    return {
      overview: {
        url,
        title: title || 'Moradia Bifamiliar para Venda',
        location: location || 'Portugal',
        price: numericPrice,
        priceFormatted: numericPrice > 0 ? `€ ${numericPrice.toLocaleString('pt-PT')}` : 'Sob Consulta',
        area: `${area} m²`,
        pricePerM2: numericPrice > 0 ? `€ ${Math.round(numericPrice / area).toLocaleString('pt-PT')} / m²` : 'N/A',
        opportunityScore: score,
        scoreLabel: score >= 80 ? 'Oportunidade de Ouro' : score >= 60 ? 'Forte Potencial' : 'A Verificar Detalhes'
      },
      bifamiliarViability: {
        isBifamiliarVerified: detectedKeywords.length > 0 || features.twoUnits || features.twoKitchens,
        features,
        matchingKeywords: detectedKeywords,
        legalStatus: features.horizontalProperty 
          ? 'Propriedade Horizontal (2 Frações Autónomas)' 
          : features.totalPropertyWithDivisions
          ? 'Propriedade Total (Potencial para constituição de PH e mais-valia)'
          : 'A confirmar na Caderneta Predial'
      },
      financialMetrics: financialAnalysis,
      prospectingStrategy: {
        idealBuyerProfiles: [
          'Investidor Buy-to-Let: Arrendar as 2 frações em separado para maximizar rentabilidade anual.',
          'Proprietário-Residente: Habitar um piso (T2/T3) e arrendar o outro para pagar a totalidade da prestação bancária.',
          'Famílias Multi-geracionais: Pais e filhos adultos a viver no mesmo imóvel com total privacidade e partilha de custos.'
        ],
        outreachPitch
      },
      contacts: {
        agentName: contacts.agentName || 'Responsável pelo Anúncio',
        phone: contacts.phone || 'Ver no anúncio',
        agency: contacts.agency || 'Agência / Particular'
      }
    };
  }

  /**
   * Financial simulation for a two-family property
   */
  calculateFinancials(price, area, location) {
    if (!price || price <= 0) price = 320000;

    // Estimate rental values for each independent fraction
    // Conservative average: Fraction 1 (~€750-€1100), Fraction 2 (~€700-€950) depending on location
    let fraction1Rent = 850;
    let fraction2Rent = 750;

    if (price > 450000) {
      fraction1Rent = 1200;
      fraction2Rent = 1000;
    } else if (price < 220000) {
      fraction1Rent = 600;
      fraction2Rent = 550;
    }

    const totalMonthlyRent = fraction1Rent + fraction2Rent;
    const annualRentalIncome = totalMonthlyRent * 12;
    const grossYield = parseFloat(((annualRentalIncome / price) * 100).toFixed(2));

    // Estimated 30-year mortgage at ~3.2% interest with 20% down payment
    const loanAmount = price * 0.8;
    const monthlyInterestRate = 0.032 / 12;
    const totalPayments = 30 * 12;
    const estimatedMortgage = Math.round(
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
    );

    // Scenario: Live in Fraction 1, rent Fraction 2
    const netMortgageCostIfOwnerOccupied = estimatedMortgage - fraction2Rent;

    return {
      estimatedRents: {
        fractionA: `€ ${fraction1Rent} / mês`,
        fractionB: `€ ${fraction2Rent} / mês`,
        totalCombined: `€ ${totalMonthlyRent} / mês`
      },
      grossYield: grossYield,
      grossYieldFormatted: `${grossYield}% ao ano`,
      estimatedMortgageMonthly: `€ ${estimatedMortgage} / mês (Simulação 80% LTV, 30 anos)`,
      ownerOccupiedScenario: {
        description: 'Viver na Fração A e arrendar a Fração B',
        tenantPays: `€ ${fraction2Rent} / mês`,
        remainingMortgageToPay: netMortgageCostIfOwnerOccupied > 0 
          ? `€ ${netMortgageCostIfOwnerOccupied} / mês (Custo quase nulo de habitação)`
          : `€ 0 (A renda da 2ª fração paga a totalidade do crédito e ainda gera excedente!)`
      }
    };
  }

  extractPrice(text) {
    const m = text.match(/(?:€|eur)\s*([\d\.\,]+)|([\d\.\,]+)\s*(?:€|eur)/i);
    if (m) {
      const clean = (m[1] || m[2]).replace(/\./g, '').replace(',', '.');
      const val = parseFloat(clean);
      if (!isNaN(val) && val > 10000) return val;
    }
    return 290000;
  }

  generateOutreachPitch(params) {
    const { title, price, location, agentName } = params;
    return `Olá ${agentName},\n\nContactei a propósito do anúncio "${title}" em ${location}.\n\nTrabalho diretamente com uma carteira de investidores e famílias ativamente à procura de MORADIAS BIFAMILIARES com entradas independentes ou potencial de rentabilização de duas frações autónomas.\n\nPoderia confirmar se o imóvel já dispõe de contadores e acessos totalmente separados, e qual a situação da Propriedade Horizontal na Caderneta Predial?\n\nSe estiver disponível para visitas esta semana, tenho clientes qualificados com capacidade financeira pré-aprovada para avançar de imediato.\n\nObrigado e aguardo o seu contacto.`;
  }
}

module.exports = BifamiliarProspector;
