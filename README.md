# 🔍 Web-Searcher

> **Engenharia Reversa de Tecnologias, Plugins e Infraestrutura Web com REA (Reverse Engineer Anything)**

O **Web-Searcher** permite que ao introduzir qualquer endereço de site (URL), seja feita uma análise profunda de engenharia reversa com o **REA**, extraindo:
- **CMS & Plataformas:** WordPress, Shopify, WooCommerce, PrestaShop, Drupal, Joomla, Ghost, Webflow, Wix, Squarespace, etc.
- **Plugins & Extensões:** Deteção automática e precisa de plugins WordPress a partir de caminhos `/wp-content/plugins/<slug>/`, temas `/wp-content/themes/<slug>/`, Shopify apps e extensões.
- **Frameworks Frontend:** React, Next.js, Vue.js, Nuxt.js, Angular, Svelte, SvelteKit, jQuery, Alpine.js, HTMX, Astro, etc. (com versões quando disponíveis).
- **Estilização & UI:** Tailwind CSS, Bootstrap, Bulma, Font Awesome, Google Fonts, etc.
- **Servidor & Infraestrutura / CDN:** Cloudflare, AWS CloudFront, Vercel, Netlify, Nginx, Apache, LiteSpeed, Fastly, Akamai, IIS.
- **Analytics & Rastreamento:** Google Analytics 4, Google Tag Manager, Meta Pixel, Hotjar, Microsoft Clarity, TikTok Pixel, LinkedIn Insight.
- **Serviços & Pagamentos:** Stripe, PayPal, Google reCAPTCHA, Cloudflare Turnstile, Intercom, Zendesk, Tawk.to, Crisp.
- **Cabeçalhos de Segurança HTTP:** Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Scripts & Evidência Criptográfica:** Lista de todos os scripts carregados com tamanho em bytes e hash SHA-256 / CDP do REA, além do ID de Evidência normalizado.

---

## 🛠️ Como Funciona com o REA

1. **Chromium Headless & CDP (Chrome DevTools Protocol):**
   O sistema inicializa ou conecta-se a uma instância controlada do Chromium através da porta de depuração remota (`9222`).
2. **Navegação & Execução Dinâmica:**
   A página é carregada na íntegra, permitindo que scripts modernos de hidratação e chamadas dinâmicas sejam executados.
3. **Sondagem de Runtime:**
   O context bridge interroga variáveis globais de execução no objeto `window` (`window.React`, `window.Vue`, `window.wp`, `window.__NEXT_DATA__`, etc.).
4. **Inspeção REA (`rea inspect-web-page`):**
   A ferramenta do REA extrai a árvore de recursos observados, código-fonte de scripts, chaves de armazenamento local/sessão e metadados de rede, gerando uma evidência com ID único rastreável.
5. **Classificador de Assinaturas & Plugins:**
   O motor de regras analisa a evidência REA combinada para catalogar tecnologias, versões e plugins com suas respetivas provas de evidência.

---

## 🚀 Como Executar

### 1. Interface Web (Aplicação Completa)

Inicie o servidor Express:

```bash
npm start
```

Abra o seu navegador em [http://localhost:3000](http://localhost:3000).

- Introduza o endereço do site desejado (ex: `https://wordpress.org` ou `https://react.dev`).
- Acompanhe o progresso em tempo real (Chromium CDP -> REA inspect -> Classificação).
- Explore as abas de resultados e exporte relatórios em **JSON** ou **Markdown**.

### 2. Linha de Comandos (CLI)

Pode analisar qualquer site diretamente pelo terminal:

```bash
# Análise padrão formatada
node bin/analyze-site.js https://wordpress.org

# Saída em formato JSON
node bin/analyze-site.js https://wordpress.org --json

# Ver logs detalhados do REA
node bin/analyze-site.js https://wordpress.org --verbose
```

---

## 🏡 Suite de Prospecção de Moradias Bifamiliares

O **Web-Searcher** inclui um módulo especializado para **prospecção, auditoria e simulação de rentabilidade de casas bifamiliares** (imóveis com 2 habitações independentes):

- **Auditoria de Viabilidade Bifamiliar:**
  - Entradas e acessos 100% independentes.
  - Verificação de 2 cozinhas completas.
  - Separação de contadores de água e eletricidade.
  - Espaço exterior privativo (jardim, logradouro, garagem).
  - Enquadramento jurídico (Propriedade Horizontal vs. Propriedade Total com divisões).
- **Simulador Financeiro em Tempo Real:**
  - Cálculo de renda dupla combinada (Fração A + Fração B) e Yield Bruto anual.
  - Simulação de crédito à habitação (80% LTV, 30 anos).
  - Estratégia de habitação a "Custo Quase Nulo": a renda da 2ª fração amortiza 60% a 100% da prestação do banco.
  - Cálculo de Cash Flow líquido para investidores *buy-to-let*.
- **Gerador de Mensagens de Abordagem (*Pitch*):**
  - Textos de contacto qualificado prontos para envio a consultores ou proprietários via WhatsApp / Email.

```bash
# Auditar anúncio ou descrição de imóvel bifamiliar via CLI
./bin/prospect-bifamiliar.js "Moradia bifamiliar com 2 entradas independentes e 2 cozinhas em Gaia" --price 345000

# Executar modo de demonstração completo com casos práticos
./bin/prospect-bifamiliar.js --demo
```

---

## 📄 Compilador de Dossiês Técnicos & Executivos

Gera relatórios executivos completos em formato **HTML (pronto para impressão ou PDF)**, **Markdown** ou **JSON**:
- Segregação de plugins independentes de 3ºs face a bundles de alojamento (ex: Hostinger).
- Pontuação de postura de segurança HTTP (0-100%).
- Descoberta exaustiva via endpoints da WordPress REST API (`/wp-json/`).

```bash
# Compilar dossiê em HTML imprimível
./bin/compile-report.js https://igrejafamilia.net/ --format html --output dossie.html

# Compilar dossiê em Markdown
./bin/compile-report.js https://igrejafamilia.net/ --format md
```

---

## 🚀 Como Executar

### 1. Interface Web (Aplicação Completa)

Inicie o servidor Express:

```bash
npm start
```

Abra o seu navegador em [http://localhost:3000](http://localhost:3000).

- Alterne facilmente no topo entre **🏡 Prospetor Bifamiliar** e **🔍 Scanner REA**.
- Simule preços, rendas e taxas de juro em tempo real.
- Exporte Dossiês Completos em HTML/PDF com um clique.

### 2. Linha de Comandos (CLI)

```bash
# Scanner REA de tecnologias
node bin/analyze-site.js https://wordpress.org

# Compilador de Dossiê Executivo
node bin/compile-report.js https://wordpress.org --format html

# Prospetor de Moradias Bifamiliares
node bin/prospect-bifamiliar.js --demo
```

---

## 📁 Estrutura do Projeto

```
Web-Searcher/
├── bin/
│   ├── analyze-site.js         # CLI de análise técnica e plugins com REA
│   ├── compile-report.js       # CLI de compilação de dossiês executivos
│   └── prospect-bifamiliar.js  # CLI de prospecção de moradias bifamiliares
├── lib/
│   ├── analyzer.js             # Orquestrador central (CDP + REA + Detector + REST API)
│   ├── bifamiliar-prospector.js# Motor de auditoria de viabilidade e simulador bifamiliar
│   ├── chromium-manager.js     # Gestor do Chromium Headless com CDP
│   ├── compiler.js             # Compilador de relatórios técnicos e executivos
│   ├── detector.js             # Motor classificador de tecnologias e namespaces WP
│   ├── rea-runner.js           # Interface com o comando REA (rea-agents)
│   └── signatures.js           # Base de assinaturas, plugins, headers e CMS
├── public/
│   ├── index.html              # Interface web unificada (Bifamiliar + REA)
│   ├── app.js                  # Lógica interativa, simulador e exportações
│   └── style.css               # Sistema de design responsivo com modo claro/escuro
├── server.js                   # Servidor Express com APIs REST integradas
└── package.json
```
