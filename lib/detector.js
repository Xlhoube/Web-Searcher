/**
 * Technology & Plugin Detector Engine
 * Analyzes REA Evidence, HTTP metadata, DOM, and runtime context.
 */

const signatures = require('./signatures');

class TechnologyDetector {
  constructor() {
    this.signatures = signatures;
  }

  /**
   * Run full detection pipeline
   */
  detect(data) {
    const {
      url,
      httpHeaders = {},
      html = '',
      cookies = [],
      reaEvidence = {},
      windowVars = {},
      wpJsonData = null
    } = data;

    const normalizedResult = reaEvidence.normalized_result || {};
    const domUrls = (normalizedResult.metadata?.dom_urls || []).map(u => u.url).filter(Boolean);
    const resources = normalizedResult.resources || [];
    const resourceUrls = resources.map(r => r.url).filter(Boolean);
    const scripts = normalizedResult.scripts?.items || [];
    const scriptUrls = scripts.map(s => s.url).filter(Boolean);
    const storageKeys = normalizedResult.storage?.keys || [];
    const consoleMessages = (normalizedResult.console?.messages || []).map(m => m.text).filter(Boolean);

    // Combine all observed URLs
    const allUrls = Array.from(new Set([...domUrls, ...resourceUrls, ...scriptUrls]));

    const detected = {
      summary: {
        targetUrl: url,
        title: this.extractTitle(html, normalizedResult),
        detectedCount: 0,
        reaEvidenceId: reaEvidence.evidence_id || null,
        reaConfidence: reaEvidence.confidence || 'observed',
        analyzedAt: new Date().toISOString()
      },
      cms: [],
      plugins: [],
      themes: [],
      frameworks: [],
      ui: [],
      server: [],
      analytics: [],
      services: [],
      scriptsSummary: {
        totalScripts: scripts.length,
        totalResources: resources.length,
        externalScripts: scriptUrls.filter(u => !u.startsWith('data:') && !u.startsWith('blob:')),
        scriptHashes: scripts.map(s => ({
          url: s.url,
          length: s.length,
          hash: s.cdp_hash || s.source?.artifact?.sha256
        }))
      },
      security: this.assessSecurity(httpHeaders)
    };

    // 1. Detect CMS & Platforms
    this.detectGroup(this.signatures.cms, detected.cms, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // 2. Detect WordPress Plugins & Theme specifically if WP or wp-content is present
    const wpPlugins = this.extractWordPressPlugins(allUrls, html, wpJsonData);
    detected.plugins.push(...wpPlugins);

    const wpThemes = this.extractWordPressThemes(allUrls, html);
    detected.themes.push(...wpThemes);

    // 3. Detect Frontend Frameworks
    this.detectGroup(this.signatures.frameworks, detected.frameworks, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // 4. Detect UI & Styling Frameworks
    this.detectGroup(this.signatures.ui, detected.ui, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // 5. Detect Server & Infrastructure
    this.detectGroup(this.signatures.server, detected.server, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // 6. Detect Analytics & Trackers
    this.detectGroup(this.signatures.analytics, detected.analytics, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // 7. Detect Third-party Services & APIs
    this.detectGroup(this.signatures.services, detected.services, {
      allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages
    });

    // Count total unique detected items
    detected.summary.detectedCount =
      detected.cms.length +
      detected.plugins.length +
      detected.themes.length +
      detected.frameworks.length +
      detected.ui.length +
      detected.server.length +
      detected.analytics.length +
      detected.services.length;

    return detected;
  }

  detectGroup(groupSignatures, targetList, context) {
    const { allUrls, html, httpHeaders, cookies, windowVars, scripts, consoleMessages } = context;

    for (const item of groupSignatures) {
      let matched = false;
      const reasons = [];
      let detectedVersion = null;

      // Match headers
      if (item.matches?.headers) {
        for (const hRule of item.matches.headers) {
          const headerValue = this.findHeader(httpHeaders, hRule.name);
          if (headerValue) {
            if (hRule.regex) {
              const m = headerValue.match(hRule.regex);
              if (m) {
                matched = true;
                if (m[1]) detectedVersion = m[1];
                reasons.push(`HTTP Header "${hRule.name}: ${headerValue}"`);
              }
            } else {
              matched = true;
              reasons.push(`HTTP Header "${hRule.name}" presente`);
            }
          }
        }
      }

      // Match scripts URLs
      if (item.matches?.scripts) {
        for (const sRegex of item.matches.scripts) {
          const matchingUrl = allUrls.find(u => sRegex.test(u));
          if (matchingUrl) {
            matched = true;
            const m = matchingUrl.match(sRegex);
            if (m && m[1]) detectedVersion = m[1];
            reasons.push(`Script/Resource URL: ${this.shortenUrl(matchingUrl)}`);
            break;
          }
        }
      }

      // Match Window variables
      if (item.matches?.window && windowVars) {
        for (const varName of item.matches.window) {
          const val = windowVars[varName];
          if (val === true || (typeof val === 'string' && val.trim() !== '') || (typeof val === 'number' && val > 0) || (typeof val === 'object' && val !== null)) {
            matched = true;
            let valPreview = '';
            if (typeof val === 'string') {
              valPreview = ` (v${val})`;
              if (/^[\d.]+$/.test(val)) detectedVersion = val;
            }
            reasons.push(`Objeto global 'window.${varName}' detectado${valPreview}`);
          }
        }
      }

      // Match meta tags & HTML DOM strings
      if (item.matches?.meta && html) {
        for (const metaRule of item.matches.meta) {
          const metaRegex = new RegExp(`<meta[^>]+name=["']${metaRule.name}["'][^>]+content=["']([^"']+)["']`, 'i');
          const m = html.match(metaRegex);
          if (m) {
            if (metaRule.regex) {
              const rm = m[1].match(metaRule.regex);
              if (rm) {
                matched = true;
                if (rm[1]) detectedVersion = rm[1];
                reasons.push(`Meta tag <meta name="${metaRule.name}" content="${m[1]}">`);
              }
            } else {
              matched = true;
              reasons.push(`Meta tag <meta name="${metaRule.name}">`);
            }
          }
        }
      }

      // Match DOM markers in HTML
      if (item.matches?.dom && html) {
        for (const domMarker of item.matches.dom) {
          if (html.includes(domMarker)) {
            matched = true;
            reasons.push(`Elemento DOM/Marcador "${domMarker}" detectado`);
            break;
          }
        }
      }

      // Match cookies
      if (item.matches?.cookies && cookies.length > 0) {
        for (const cookieRegex of item.matches.cookies) {
          const matchedCookie = cookies.find(c => cookieRegex.test(c.name || c));
          if (matchedCookie) {
            matched = true;
            reasons.push(`Cookie "${typeof matchedCookie === 'string' ? matchedCookie : matchedCookie.name}"`);
            break;
          }
        }
      }

      if (matched) {
        targetList.push({
          name: item.name,
          category: item.category,
          version: detectedVersion,
          website: item.website || null,
          evidence: reasons
        });
      }
    }
  }

  /**
   * Scan URLs & HTML for WordPress plugins: /wp-content/plugins/<plugin-slug>/
   */
  extractWordPressPlugins(allUrls, html, wpJsonData) {
    const pluginRegex = /\/wp-content\/plugins\/([a-zA-Z0-9_\-]+)\//gi;
    const foundSlugs = new Map();

    const scanString = (text, sourceDescription) => {
      let match;
      while ((match = pluginRegex.exec(text)) !== null) {
        const slug = match[1].toLowerCase();
        if (!foundSlugs.has(slug)) {
          foundSlugs.set(slug, []);
        }
        if (foundSlugs.get(slug).length < 3) {
          foundSlugs.get(slug).push(sourceDescription || match[0]);
        }
      }
    };

    // 1. Scan all gathered URLs
    for (const url of allUrls) {
      scanString(url, `Carregado em: ${this.shortenUrl(url)}`);
    }

    // 2. Scan initial HTML
    if (html) {
      scanString(html, 'Encontrado no código HTML inicial');

      // Check Elementor DOM presence
      if (html.includes('elementor-') && !foundSlugs.has('elementor')) {
        foundSlugs.set('elementor', ['Classes e seletores Elementor presentes no DOM']);
      }
    }

    // 3. Scan WordPress REST API namespaces & routes if available
    if (wpJsonData && Array.isArray(wpJsonData.namespaces)) {
      const coreNamespaces = new Set(['wp', 'oembed', 'wp-site-health', 'wp-block-editor', 'wp-abilities', 'batch', 'mcp']);
      for (const ns of wpJsonData.namespaces) {
        const prefix = ns.split('/')[0].toLowerCase();
        if (coreNamespaces.has(prefix) || prefix.startsWith('wp-')) continue;

        let slug = prefix;
        if (prefix.startsWith('elementor')) {
          slug = 'elementor';
        } else if (prefix === 'litespeed') {
          slug = 'litespeed-cache';
        } else if (prefix === 'wpmudev_pcs' || prefix === 'hub-connector') {
          slug = 'hub-connector';
        }

        if (!foundSlugs.has(slug)) {
          foundSlugs.set(slug, []);
        }
        foundSlugs.get(slug).push(`Namespace REST API ativo: /wp-json/${ns}`);
      }
    }

    const plugins = [];
    for (const [slug, evidence] of foundSlugs.entries()) {
      const known = this.signatures.wpPluginsKnown[slug];
      const friendlyName = known ? known.name : this.slugToTitle(slug);
      const category = known ? known.category : 'WordPress Plugin';
      const website = known ? known.url : `https://wordpress.org/plugins/${slug}/`;

      plugins.push({
        slug,
        name: friendlyName,
        category,
        website,
        evidence: Array.from(new Set(evidence))
      });
    }

    return plugins;
  }

  /**
   * Scan URLs & HTML for WordPress themes: /wp-content/themes/<theme-slug>/
   */
  extractWordPressThemes(allUrls, html) {
    const themeRegex = /\/wp-content\/themes\/([a-zA-Z0-9_\-]+)\//gi;
    const foundThemes = new Map();

    const scan = (text, src) => {
      let m;
      while ((m = themeRegex.exec(text)) !== null) {
        const slug = m[1].toLowerCase();
        if (!foundThemes.has(slug)) {
          foundThemes.set(slug, []);
        }
        if (foundThemes.get(slug).length < 3) {
          foundThemes.get(slug).push(src);
        }
      }
    };

    for (const url of allUrls) scan(url, `Carregado em: ${this.shortenUrl(url)}`);
    if (html) scan(html, 'Referência no HTML');

    const themes = [];
    for (const [slug, evidence] of foundThemes.entries()) {
      themes.push({
        slug,
        name: this.slugToTitle(slug),
        category: 'WordPress Theme',
        evidence: Array.from(new Set(evidence))
      });
    }
    return themes;
  }

  assessSecurity(headers) {
    const secHeaders = {
      contentSecurityPolicy: this.findHeader(headers, 'content-security-policy') ? 'Configurado' : 'Ausente',
      strictTransportSecurity: this.findHeader(headers, 'strict-transport-security') ? 'Ativo (HSTS)' : 'Ausente',
      xFrameOptions: this.findHeader(headers, 'x-frame-options') || 'Ausente',
      xContentTypeOptions: this.findHeader(headers, 'x-content-type-options') || 'Ausente',
      referrerPolicy: this.findHeader(headers, 'referrer-policy') || 'Padrão do navegador'
    };
    return secHeaders;
  }

  findHeader(headers, name) {
    if (!headers) return null;
    const target = name.toLowerCase();
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() === target) {
        return Array.isArray(v) ? v.join(', ') : String(v);
      }
    }
    return null;
  }

  slugToTitle(slug) {
    return slug
      .split(/[-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  shortenUrl(url) {
    try {
      const u = new URL(url);
      const pathParts = u.pathname.split('/');
      const filename = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || '';
      return `${u.hostname}/.../${filename}`;
    } catch {
      return url.length > 50 ? url.slice(0, 47) + '...' : url;
    }
  }

  extractTitle(html, normalizedResult) {
    if (normalizedResult.target?.title) return normalizedResult.target.title;
    if (!html) return 'Sem título';
    const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return m ? m[1].trim() : 'Sem título';
  }
}

module.exports = TechnologyDetector;
