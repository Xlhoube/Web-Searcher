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

  // =========================================================================
  // Top Navigation Mode Switcher (Bifamiliar Suite vs REA Tech Scanner)
  // =========================================================================
  const navBifamiliarBtn = document.getElementById('navBifamiliarBtn');
  const navReaBtn = document.getElementById('navReaBtn');
  const bifamiliarSection = document.getElementById('bifamiliarSection');
  const reaSection = document.getElementById('reaSection');

  if (navBifamiliarBtn && navReaBtn) {
    navBifamiliarBtn.addEventListener('click', () => {
      navBifamiliarBtn.classList.add('active');
      navReaBtn.classList.remove('active');
      bifamiliarSection.classList.remove('hidden');
      bifamiliarSection.classList.add('active');
      reaSection.classList.add('hidden');
      reaSection.classList.remove('active');
    });

    navReaBtn.addEventListener('click', () => {
      navReaBtn.classList.add('active');
      navBifamiliarBtn.classList.remove('active');
      reaSection.classList.remove('hidden');
      reaSection.classList.add('active');
      bifamiliarSection.classList.add('hidden');
      bifamiliarSection.classList.remove('active');
    });
  }

  // =========================================================================
  // BIFAMILIAR REAL ESTATE PROSPECTOR SUITE
  // =========================================================================
  const BIFAMILIAR_PRESETS = {
    gaia: {
      title: 'Moradia Bifamiliar T3+T2 com Entradas Independentes',
      location: '📍 Vila Nova de Gaia / Porto • 280 m² área bruta',
      price: 345000,
      area: 280,
      rentA: 850,
      rentB: 750,
      score: 90,
      badgeType: 'Moradia Bifamiliar Pronta',
      scoreLabel: 'Score Oportunidade: 90/100',
      legalStatus: 'A confirmar na Caderneta',
      features: {
        independentEntrances: true,
        twoKitchens: true,
        separateMeters: true,
        outdoor: true
      },
      pitchText: `Olá,\n\nContactei a propósito da moradia bifamiliar T3+T2 em Vila Nova de Gaia.\n\nTrabalho diretamente com uma carteira de investidores e famílias ativamente à procura de MORADIAS BIFAMILIARES com entradas independentes e duas cozinhas operacionais.\n\nPoderia confirmar se o imóvel já dispõe de contadores de eletricidade/água separados e qual a situação da Propriedade Horizontal na Caderneta Predial?\n\nTenho clientes qualificados com crédito pré-aprovado para visitas imediatas esta semana.\n\nObrigado e aguardo o seu contacto.`
    },
    sintra: {
      title: 'Quinta / Moradia Bi-familiar com Jardim e Garagem',
      location: '📍 Sintra / Colares • 340 m² área bruta',
      price: 480000,
      area: 340,
      rentA: 1200,
      rentB: 950,
      score: 85,
      badgeType: 'Bi-familiar c/ Terreno',
      scoreLabel: 'Score Oportunidade: 85/100',
      legalStatus: 'Propriedade Total (Com divisões)',
      features: {
        independentEntrances: true,
        twoKitchens: true,
        separateMeters: true,
        outdoor: true
      },
      pitchText: `Olá,\n\nContactei sobre a moradia bi-familiar com jardim em Sintra (€ 480.000).\n\nTenho clientes com interesse específico no formato bifamiliar (habitação própria num piso e exploração turística ou arrendamento noutro).\n\nPoderia informar se as duas habitações têm acessos autónomos pelo exterior e contadores individualizados?\n\nFico a aguardar a sua disponibilidade para agendar visita.\n\nCom os melhores cumprimentos.`
    },
    braga: {
      title: 'Moradia com 2 Andares-Moradia em Propriedade Horizontal',
      location: '📍 Braga (São Victor) • 230 m² área bruta',
      price: 295000,
      area: 230,
      rentA: 750,
      rentB: 700,
      score: 95,
      badgeType: 'Propriedade Horizontal (2 Frações)',
      scoreLabel: 'Score Oportunidade: 95/100 (Excelente)',
      legalStatus: 'Propriedade Horizontal (Frações A e B)',
      features: {
        independentEntrances: true,
        twoKitchens: true,
        separateMeters: true,
        outdoor: false
      },
      pitchText: `Olá,\n\nTenho grande interesse no prédio em propriedade horizontal com 2 andares moradia em Braga (€ 295.000).\n\nSendo duas frações autónomas já constituídas, o imóvel encaixa perfeitamente no perfil dos meus investidores buy-to-let para arrendamento simultâneo das frações A e B com yield superior a 5.8%.\n\nPodemos falar brevemente sobre a disponibilidade para visita e se os contratos atuais estão ativos?\n\nObrigado.`
    },
    setubal: {
      title: 'Moradia de 2 Pisos Independentes com Logradouro',
      location: '📍 Azeitão / Setúbal • 210 m² área bruta',
      price: 310000,
      area: 210,
      rentA: 800,
      rentB: 750,
      score: 80,
      badgeType: '2 Pisos Independentes',
      scoreLabel: 'Score Oportunidade: 80/100',
      legalStatus: 'A confirmar na Caderneta',
      features: {
        independentEntrances: true,
        twoKitchens: true,
        separateMeters: false,
        outdoor: true
      },
      pitchText: `Olá,\n\nVi o vosso anúncio da moradia de 2 pisos em Azeitão / Setúbal.\n\nGostaria de confirmar se o acesso ao piso superior é feito exclusivamente pelo exterior e se é viável a instalação de contadores independentes para utilização bifamiliar.\n\nTenho clientes prontos para visitar esta semana.\n\nAguardo o vosso retorno. Obrigado!`
    }
  };

  // Bifamiliar DOM Elements
  const bifamiliarInput = document.getElementById('bifamiliarInput');
  const btnAuditBifamiliar = document.getElementById('btnAuditBifamiliar');
  const bfBadgeType = document.getElementById('bfBadgeType');
  const bfScoreBadge = document.getElementById('bfScoreBadge');
  const bfTitle = document.getElementById('bfTitle');
  const bfLocation = document.getElementById('bfLocation');
  const bfPrice = document.getElementById('bfPrice');
  const bfM2 = document.getElementById('bfM2');
  const bfYield = document.getElementById('bfYield');
  const bfTotalRent = document.getElementById('bfTotalRent');
  const bfMortgage = document.getElementById('bfMortgage');
  const bfOwnerCost = document.getElementById('bfOwnerCost');
  const bfLegalStatus = document.getElementById('bfLegalStatus');
  const chkRowEntrances = document.getElementById('chkRowEntrances');
  const chkRowKitchens = document.getElementById('chkRowKitchens');
  const chkRowMeters = document.getElementById('chkRowMeters');
  const chkRowOutdoor = document.getElementById('chkRowOutdoor');
  const bfPitchArgument = document.getElementById('bfPitchArgument');

  // Simulator Elements
  const simPrice = document.getElementById('simPrice');
  const simRentA = document.getElementById('simRentA');
  const simRentB = document.getElementById('simRentB');
  const simInterest = document.getElementById('simInterest');
  const simAnnualIncome = document.getElementById('simAnnualIncome');
  const simRecalcYield = document.getElementById('simRecalcYield');
  const simRecalcMortgage = document.getElementById('simRecalcMortgage');
  const simCashFlow = document.getElementById('simCashFlow');
  const btnRecalc = document.getElementById('btnRecalc');

  // Outreach Pitch Elements
  const bfOutreachText = document.getElementById('bfOutreachText');
  const btnCopyBfPitch = document.getElementById('btnCopyBfPitch');

  // Helper to recalculate simulator metrics
  function recalculateBifamiliarMetrics() {
    const price = parseFloat(simPrice?.value) || 345000;
    const rentA = parseFloat(simRentA?.value) || 850;
    const rentB = parseFloat(simRentB?.value) || 750;
    const interestRate = parseFloat(simInterest?.value) || 3.2;

    const totalRent = rentA + rentB;
    const annualIncome = totalRent * 12;
    const grossYield = price > 0 ? ((annualIncome / price) * 100).toFixed(2) : 0;

    // 30-year mortgage simulation (80% LTV)
    const loanAmount = price * 0.8;
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = 30 * 12;
    const mortgage = monthlyRate > 0 && numPayments > 0
      ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1))
      : 0;

    const ownerCost = Math.max(0, mortgage - rentB);
    const cashFlow = totalRent - mortgage;
    const tenantAmortPct = mortgage > 0 ? Math.min(100, Math.round((rentB / mortgage) * 100)) : 60;

    // Update Simulator Output
    if (simAnnualIncome) simAnnualIncome.textContent = `€ ${annualIncome.toLocaleString('pt-PT')} / ano`;
    if (simRecalcYield) simRecalcYield.textContent = `${grossYield}%`;
    if (simRecalcMortgage) simRecalcMortgage.textContent = `€ ${mortgage.toLocaleString('pt-PT')} / mês`;
    if (simCashFlow) {
      simCashFlow.textContent = `${cashFlow >= 0 ? '+ ' : ''}€ ${cashFlow.toLocaleString('pt-PT')} / mês`;
      simCashFlow.className = cashFlow >= 0 ? 'text-green' : 'text-danger';
    }

    // Update Top Dashboard Cards
    if (bfYield) bfYield.textContent = `${grossYield}%`;
    if (bfTotalRent) bfTotalRent.textContent = `€ ${totalRent.toLocaleString('pt-PT')} / mês`;
    if (bfMortgage) bfMortgage.textContent = `€ ${mortgage.toLocaleString('pt-PT')} / mês`;
    if (bfOwnerCost) bfOwnerCost.textContent = `€ ${ownerCost.toLocaleString('pt-PT')} / mês`;

    // Dynamic Killer Argument Text
    if (bfPitchArgument) {
      bfPitchArgument.textContent = `Se o comprador habitar a Fração Principal (Renda ref. € ${rentA}) e arrendar a 2ª fração por € ${rentB}/mês, o inquilino amortiza ${tenantAmortPct}% da prestação bancária estimada (€ ${mortgage.toLocaleString('pt-PT')}), restando ao proprietário pagar apenas € ${ownerCost.toLocaleString('pt-PT')}/mês para viver numa moradia independente com quintal e garagem!`;
    }
  }

  // Load Preset
  function loadBifamiliarPreset(presetKey) {
    const data = BIFAMILIAR_PRESETS[presetKey];
    if (!data) return;

    if (bfTitle) bfTitle.textContent = data.title;
    if (bfLocation) bfLocation.textContent = data.location;
    if (bfBadgeType) bfBadgeType.textContent = data.badgeType;
    if (bfScoreBadge) {
      bfScoreBadge.textContent = data.scoreLabel;
      bfScoreBadge.className = data.score >= 90 ? 'badge-green' : 'badge-amber';
    }
    if (bfPrice) bfPrice.textContent = `€ ${data.price.toLocaleString('pt-PT')}`;
    if (bfM2) bfM2.textContent = `€ ${Math.round(data.price / data.area).toLocaleString('pt-PT')} / m²`;
    if (bfLegalStatus) bfLegalStatus.textContent = data.legalStatus;

    // Checklist toggles
    updateChecklistRow(chkRowEntrances, data.features.independentEntrances);
    updateChecklistRow(chkRowKitchens, data.features.twoKitchens);
    updateChecklistRow(chkRowMeters, data.features.separateMeters);
    updateChecklistRow(chkRowOutdoor, data.features.outdoor);

    // Update inputs
    if (simPrice) simPrice.value = data.price;
    if (simRentA) simRentA.value = data.rentA;
    if (simRentB) simRentB.value = data.rentB;
    if (bfOutreachText) bfOutreachText.value = data.pitchText;

    recalculateBifamiliarMetrics();
  }

  function updateChecklistRow(rowElem, isPositive) {
    if (!rowElem) return;
    const icon = rowElem.querySelector('.check-icon');
    if (icon) {
      icon.textContent = isPositive ? '✅' : '⚠️';
      icon.className = isPositive ? 'check-icon text-green' : 'check-icon text-amber';
    }
  }

  // Preset Chips Event Listeners
  document.querySelectorAll('.chip-bifamiliar').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-bifamiliar').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const pid = chip.getAttribute('data-bif-id');
      loadBifamiliarPreset(pid);
    });
  });

  // Simulator Listeners
  [simPrice, simRentA, simRentB, simInterest].forEach(input => {
    if (input) {
      input.addEventListener('input', recalculateBifamiliarMetrics);
    }
  });

  if (btnRecalc) {
    btnRecalc.addEventListener('click', recalculateBifamiliarMetrics);
  }

  // Copy Outreach Message
  if (btnCopyBfPitch && bfOutreachText) {
    btnCopyBfPitch.addEventListener('click', () => {
      const text = bfOutreachText.value;
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          const original = btnCopyBfPitch.textContent;
          btnCopyBfPitch.textContent = '✅ Copiado!';
          setTimeout(() => btnCopyBfPitch.textContent = original, 2000);
        });
      }
    });
  }

  // Audit Button via /api/prospect-bifamiliar
  if (btnAuditBifamiliar && bifamiliarInput) {
    btnAuditBifamiliar.addEventListener('click', async () => {
      const query = bifamiliarInput.value.trim();
      if (!query) {
        alert('Por favor, insira o link de um anúncio ou descrição do imóvel.');
        return;
      }

      btnAuditBifamiliar.disabled = true;
      const originalText = btnAuditBifamiliar.innerHTML;
      btnAuditBifamiliar.innerHTML = '<span>A auditar...</span>';

      try {
        const payload = {
          url: /^https?:\/\//i.test(query) ? query : '',
          description: query,
          title: 'Moradia Bifamiliar Auditada'
        };

        const res = await fetch('/api/prospect-bifamiliar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error(`Erro na resposta: ${res.statusText}`);
        }

        const data = await res.json();
        const { overview, bifamiliarViability, financialMetrics, prospectingStrategy } = data;

        // Populate Dashboard
        if (bfTitle) bfTitle.textContent = overview.title;
        if (bfLocation) bfLocation.textContent = `📍 ${overview.location} • ${overview.area}`;
        if (bfPrice) bfPrice.textContent = overview.priceFormatted;
        if (bfM2) bfM2.textContent = overview.pricePerM2;
        if (bfScoreBadge) {
          bfScoreBadge.textContent = `Score Oportunidade: ${overview.opportunityScore}/100`;
          bfScoreBadge.className = overview.opportunityScore >= 80 ? 'badge-green' : 'badge-amber';
        }
        if (bfLegalStatus) bfLegalStatus.textContent = bifamiliarViability.legalStatus;

        // Viability features
        const f = bifamiliarViability.features;
        updateChecklistRow(chkRowEntrances, f.independentEntrances);
        updateChecklistRow(chkRowKitchens, f.twoKitchens);
        updateChecklistRow(chkRowMeters, f.separateMeters);
        updateChecklistRow(chkRowOutdoor, f.outdoorSpace);

        // Simulator inputs update
        if (simPrice) simPrice.value = overview.price || 320000;
        const rentANum = parseInt((financialMetrics?.estimatedRents?.fractionA || '850').replace(/\D/g, ''), 10) || 850;
        const rentBNum = parseInt((financialMetrics?.estimatedRents?.fractionB || '750').replace(/\D/g, ''), 10) || 750;
        if (simRentA) simRentA.value = rentANum;
        if (simRentB) simRentB.value = rentBNum;

        // Outreach
        if (bfOutreachText && prospectingStrategy?.outreachPitch) {
          bfOutreachText.value = prospectingStrategy.outreachPitch;
        }

        recalculateBifamiliarMetrics();

      } catch (err) {
        alert(`Falha ao auditar imóvel: ${err.message}`);
      } finally {
        btnAuditBifamiliar.disabled = false;
        btnAuditBifamiliar.innerHTML = originalText;
      }
    });
  }

  // Initialize initial preset (Gaia)
  loadBifamiliarPreset('gaia');

  // =========================================================================
  // REA SCANNER ENGINE
  // =========================================================================
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
  const compileDossierBtn = document.getElementById('compileDossierBtn');
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
  if (compileDossierBtn) {
    compileDossierBtn.addEventListener('click', async () => {
      if (!currentReport) return;
      compileDossierBtn.disabled = true;
      const originalText = compileDossierBtn.textContent;
      compileDossierBtn.textContent = 'A compilar...';

      try {
        const res = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentReport.summary.targetUrl, format: 'html' })
        });
        const html = await res.text();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (!win) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `dossie-${new Date().toISOString().slice(0, 10)}.html`;
          a.click();
        }
      } catch (err) {
        alert('Erro ao compilar dossiê: ' + err.message);
      } finally {
        compileDossierBtn.disabled = false;
        compileDossierBtn.textContent = originalText;
      }
    });
  }

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
