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

## 📁 Estrutura do Projeto

```
Web-Searcher/
├── bin/
│   └── analyze-site.js      # Ferramenta CLI executável
├── lib/
│   ├── analyzer.js          # Orquestrador central (CDP + REA + Detector)
│   ├── chromium-manager.js  # Gestor do Chromium Headless com CDP
│   ├── rea-runner.js        # Interface com o comando REA (rea-agents)
│   ├── detector.js          # Motor classificador de tecnologias
│   └── signatures.js        # Base de conhecimento de assinaturas e plugins
├── public/
│   ├── index.html           # Interface web limpa e moderna
│   ├── app.js               # Lógica interativa e exportação
│   └── style.css            # Sistema de design responsivo com modo claro/escuro
├── server.js                # Servidor Express com APIs REST
└── package.json
```
