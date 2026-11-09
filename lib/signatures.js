/**
 * Signatures Database for Technology, CMS, Plugin, Library, and Infrastructure Detection.
 */

module.exports = {
  // CMS & Ecommerce platforms
  cms: [
    {
      name: 'WordPress',
      category: 'CMS',
      website: 'https://wordpress.org',
      icon: 'wordpress',
      matches: {
        dom: ['wp-content', 'wp-includes', 'link[rel*="wp-"]'],
        meta: [{ name: 'generator', regex: /WordPress\s*([\d.]+)?/i }],
        scripts: [/wp-content\/(?:themes|plugins)\//i, /wp-includes\/js\//i],
        headers: [{ name: 'x-powered-by', regex: /wp/i }],
        window: ['wp', 'wpData', '_wpemojiSettings']
      }
    },
    {
      name: 'WooCommerce',
      category: 'E-commerce',
      website: 'https://woocommerce.com',
      icon: 'woocommerce',
      matches: {
        dom: ['.woocommerce', '.woocommerce-page', 'body.woocommerce'],
        meta: [{ name: 'generator', regex: /WooCommerce\s*([\d.]+)?/i }],
        scripts: [/woocommerce(?:\.min)?\.js/i, /wp-content\/plugins\/woocommerce/i],
        window: ['woocommerce_params', 'wc_add_to_cart_params']
      }
    },
    {
      name: 'Shopify',
      category: 'E-commerce',
      website: 'https://shopify.com',
      icon: 'shopify',
      matches: {
        dom: ['link[href*="cdn.shopify.com"]', 'script[src*="cdn.shopify.com"]'],
        scripts: [/cdn\.shopify\.com/i, /shopify(?:\.min)?\.js/i],
        headers: [{ name: 'x-shopid', regex: /.+/i }, { name: 'powered-by', regex: /shopify/i }],
        window: ['Shopify', 'ShopifyBuy', 'BOOMR']
      }
    },
    {
      name: 'PrestaShop',
      category: 'E-commerce',
      website: 'https://prestashop.com',
      matches: {
        meta: [{ name: 'generator', regex: /PrestaShop/i }],
        scripts: [/prestashop\.js/i, /\/modules\/ps_/i],
        window: ['prestashop']
      }
    },
    {
      name: 'Magento',
      category: 'E-commerce',
      website: 'https://magento.com',
      matches: {
        scripts: [/mage\/cookies\.js/i, /static\/_requirejs/i, /mage\/template\.js/i],
        dom: ['script[type="text/x-magento-init"]'],
        window: ['Mage', 'requirejs']
      }
    },
    {
      name: 'Drupal',
      category: 'CMS',
      website: 'https://drupal.org',
      matches: {
        meta: [{ name: 'generator', regex: /Drupal\s*([\d.]+)?/i }],
        headers: [{ name: 'x-generator', regex: /Drupal\s*([\d.]+)?/i }, { name: 'x-drupal-cache', regex: /.+/i }],
        window: ['Drupal']
      }
    },
    {
      name: 'Joomla',
      category: 'CMS',
      website: 'https://joomla.org',
      matches: {
        meta: [{ name: 'generator', regex: /Joomla!\s*([\d.]+)?/i }],
        scripts: [/media\/jui\/js\//i, /media\/system\/js\//i],
        window: ['Joomla']
      }
    },
    {
      name: 'Ghost',
      category: 'CMS / Blog',
      website: 'https://ghost.org',
      matches: {
        meta: [{ name: 'generator', regex: /Ghost\s*([\d.]+)?/i }],
        headers: [{ name: 'x-ghost-cache-status', regex: /.+/i }]
      }
    },
    {
      name: 'Webflow',
      category: 'Website Builder',
      website: 'https://webflow.com',
      matches: {
        meta: [{ name: 'generator', regex: /Webflow/i }],
        dom: ['html[data-wf-page]', 'html[data-wf-site]'],
        scripts: [/webflow(?:\.[a-z0-9]+)?\.js/i],
        window: ['Webflow']
      }
    },
    {
      name: 'Wix',
      category: 'Website Builder',
      website: 'https://wix.com',
      matches: {
        dom: ['meta[name="generator"][content*="Wix.com"]'],
        scripts: [/static\.parastorage\.com/i, /wix-code/i],
        headers: [{ name: 'x-wix-request-id', regex: /.+/i }],
        window: ['wixBiSession', 'wixPerformanceMeasurements']
      }
    },
    {
      name: 'Squarespace',
      category: 'Website Builder',
      website: 'https://squarespace.com',
      matches: {
        dom: ['html[data-rendered-by="squarespace"]'],
        scripts: [/squarespace\.com/i, /static1\.squarespace\.com/i],
        headers: [{ name: 'x-servedby', regex: /squarespace/i }],
        window: ['Static', 'Squarespace']
      }
    }
  ],

  // Common WordPress Plugins dictionary for friendly metadata
  wpPluginsKnown: {
    'elementor': { name: 'Elementor Page Builder', category: 'Page Builder', url: 'https://elementor.com' },
    'elementor-pro': { name: 'Elementor Pro', category: 'Page Builder', url: 'https://elementor.com' },
    'essential-addons-for-elementor-lite': { name: 'Essential Addons for Elementor', category: 'Page Builder Addon', url: 'https://essential-addons.com/elementor/' },
    'google-site-kit': { name: 'Site Kit by Google', category: 'Analytics / SEO / Speed', url: 'https://sitekit.withgoogle.com' },
    'forminator': { name: 'Forminator Forms & Polls', category: 'Forms & Polls', url: 'https://wpmudev.com/project/forminator-pro/' },
    'cptui': { name: 'Custom Post Type UI (CPT UI)', category: 'Content Types / Developer', url: 'https://wordpress.org/plugins/custom-post-type-ui/' },
    'image-optimizer': { name: 'Image Optimizer', category: 'Media Optimization', url: 'https://wordpress.org/plugins/' },
    'hub-connector': { name: 'WPMU DEV Dashboard', category: 'Site Management', url: 'https://wpmudev.com' },
    'woocommerce': { name: 'WooCommerce', category: 'E-commerce', url: 'https://woocommerce.com' },
    'contact-form-7': { name: 'Contact Form 7', category: 'Forms', url: 'https://contactform7.com' },
    'wordpress-seo': { name: 'Yoast SEO', category: 'SEO', url: 'https://yoast.com' },
    'seo-by-rank-math': { name: 'Rank Math SEO', category: 'SEO', url: 'https://rankmath.com' },
    'all-in-one-seo-pack': { name: 'All in One SEO', category: 'SEO', url: 'https://aioseo.com' },
    'wp-rocket': { name: 'WP Rocket', category: 'Performance / Caching', url: 'https://wp-rocket.me' },
    'litespeed-cache': { name: 'LiteSpeed Cache', category: 'Performance / Caching', url: 'https://www.litespeedtech.com' },
    'w3-total-cache': { name: 'W3 Total Cache', category: 'Performance / Caching', url: 'https://w3-edge.com' },
    'wp-super-cache': { name: 'WP Super Cache', category: 'Performance / Caching', url: 'https://automattic.com' },
    'autoptimize': { name: 'Autoptimize', category: 'Performance / Minification', url: 'https://autoptimize.com' },
    'wordfence': { name: 'Wordfence Security', category: 'Security', url: 'https://wordfence.com' },
    'better-wp-security': { name: 'iThemes Security', category: 'Security', url: 'https://ithemes.com' },
    'sucuri-scanner': { name: 'Sucuri Security', category: 'Security', url: 'https://sucuri.net' },
    'jetpack': { name: 'Jetpack by WordPress.com', category: 'Multi-feature', url: 'https://jetpack.com' },
    'akismet': { name: 'Akismet Anti-Spam', category: 'Anti-Spam', url: 'https://akismet.com' },
    'wpforms-lite': { name: 'WPForms', category: 'Forms', url: 'https://wpforms.com' },
    'gravityforms': { name: 'Gravity Forms', category: 'Forms', url: 'https://gravityforms.com' },
    'ninja-forms': { name: 'Ninja Forms', category: 'Forms', url: 'https://ninjaforms.com' },
    'advanced-custom-fields': { name: 'Advanced Custom Fields (ACF)', category: 'Developer Tool', url: 'https://advancedcustomfields.com' },
    'advanced-custom-fields-pro': { name: 'ACF Pro', category: 'Developer Tool', url: 'https://advancedcustomfields.com' },
    'revslider': { name: 'Slider Revolution', category: 'Sliders', url: 'https://sliderrevolution.com' },
    'js_composer': { name: 'WPBakery Page Builder', category: 'Page Builder', url: 'https://wpbakery.com' },
    'sitepress-multilingual-cms': { name: 'WPML Multilingual', category: 'Translation', url: 'https://wpml.org' },
    'polylang': { name: 'Polylang', category: 'Translation', url: 'https://polylang.pro' },
    'translatepress-multilingual': { name: 'TranslatePress', category: 'Translation', url: 'https://translatepress.com' },
    'mailchimp-for-wp': { name: 'Mailchimp for WordPress', category: 'Marketing', url: 'https://mc4wp.com' },
    'duracelltomi-google-tag-manager': { name: 'GTM4WP (Google Tag Manager for WP)', category: 'Analytics', url: 'https://gtm4wp.com' },
    'cookie-law-info': { name: 'CookieYes / GDPR Cookie Consent', category: 'Privacy / GDPR', url: 'https://cookieyes.com' },
    'complianz-gdpr': { name: 'Complianz GDPR/CCPA', category: 'Privacy / GDPR', url: 'https://complianz.io' },
    'smushit': { name: 'WP Smush Image Optimizer', category: 'Media', url: 'https://wpmudev.com' },
    'imagify': { name: 'Imagify Image Optimizer', category: 'Media', url: 'https://imagify.io' },
    'shortpixel-image-optimiser': { name: 'ShortPixel Image Optimizer', category: 'Media', url: 'https://shortpixel.com' },
    'classic-editor': { name: 'Classic Editor', category: 'Editor', url: 'https://wordpress.org/plugins/classic-editor' }
  },

  // Frontend Frameworks & Libraries
  frameworks: [
    {
      name: 'React',
      category: 'JavaScript Framework',
      website: 'https://react.dev',
      icon: 'react',
      matches: {
        dom: ['[data-reactroot]', '[data-react-helmet]', 'div#root', 'div#__next'],
        scripts: [/react(?:\.production|\.development)?(?:\.min)?\.js/i, /react-dom/i, /_next\/static/i],
        window: ['React', '__REACT_DEVTOOLS_GLOBAL_HOOK__', '_reactListening']
      }
    },
    {
      name: 'Next.js',
      category: 'SSR / Fullstack Framework',
      website: 'https://nextjs.org',
      icon: 'nextjs',
      matches: {
        dom: ['#__next', 'script#__NEXT_DATA__'],
        scripts: [/\/_next\/static\//i],
        headers: [{ name: 'x-powered-by', regex: /Next\.js/i }],
        window: ['__NEXT_DATA__', 'next']
      }
    },
    {
      name: 'Vue.js',
      category: 'JavaScript Framework',
      website: 'https://vuejs.org',
      icon: 'vue',
      matches: {
        dom: ['[data-v-]', '[data-vue-meta]', '[v-cloak]'],
        scripts: [/vue(?:\.runtime)?(?:\.esm)?(?:\.min)?\.js/i, /_nuxt\/static/i],
        window: ['Vue', '__VUE__', '__vue_app__']
      }
    },
    {
      name: 'Nuxt.js',
      category: 'SSR / Fullstack Framework',
      website: 'https://nuxt.com',
      icon: 'nuxtjs',
      matches: {
        dom: ['#__nuxt', '#__layout'],
        scripts: [/\/_nuxt\//i],
        window: ['__NUXT__', '$nuxt']
      }
    },
    {
      name: 'Angular',
      category: 'JavaScript Framework',
      website: 'https://angular.dev',
      icon: 'angular',
      matches: {
        dom: ['[ng-version]', '[ng-app]', '[ng-binding]'],
        scripts: [/angular(?:\.min)?\.js/i, /main\.[a-z0-9]+\.js.*ng/i, /runtime\.[a-z0-9]+\.js/i],
        window: ['angular', 'ng']
      }
    },
    {
      name: 'Svelte',
      category: 'JavaScript Framework',
      website: 'https://svelte.dev',
      icon: 'svelte',
      matches: {
        dom: ['[class*="svelte-"]'],
        scripts: [/svelte/i],
        window: ['__svelte']
      }
    },
    {
      name: 'SvelteKit',
      category: 'SSR Framework',
      website: 'https://kit.svelte.dev',
      matches: {
        dom: ['div[data-sveltekit-hydrate]', 'script[data-sveltekit-preload-data]'],
        scripts: [/\/_app\/immutable\//i]
      }
    },
    {
      name: 'jQuery',
      category: 'JavaScript Library',
      website: 'https://jquery.com',
      icon: 'jquery',
      matches: {
        scripts: [/jquery(?:\.min|\.slim)?\.js/i, /jquery\/([\d.]+)\/jquery/i],
        window: ['jQuery', '$']
      }
    },
    {
      name: 'Alpine.js',
      category: 'JavaScript Framework',
      website: 'https://alpinejs.dev',
      matches: {
        dom: ['[x-data]', '[x-init]', '[x-show]'],
        scripts: [/alpine(?:\.min)?\.js/i],
        window: ['Alpine']
      }
    },
    {
      name: 'HTMX',
      category: 'JavaScript Library',
      website: 'https://htmx.org',
      matches: {
        dom: ['[hx-get]', '[hx-post]', '[hx-target]', '[hx-swap]'],
        scripts: [/htmx(?:\.min)?\.js/i],
        window: ['htmx']
      }
    },
    {
      name: 'Astro',
      category: 'Web Framework',
      website: 'https://astro.build',
      matches: {
        dom: ['astro-island'],
        meta: [{ name: 'generator', regex: /Astro\s*v?([\d.]+)?/i }]
      }
    },
    {
      name: 'Gatsby',
      category: 'Static Site Generator',
      website: 'https://gatsbyjs.com',
      matches: {
        dom: ['div#___gatsby'],
        meta: [{ name: 'generator', regex: /Gatsby\s*([\d.]+)?/i }],
        window: ['___gatsby']
      }
    }
  ],

  // UI & CSS Frameworks
  ui: [
    {
      name: 'Tailwind CSS',
      category: 'CSS Framework',
      website: 'https://tailwindcss.com',
      matches: {
        dom: ['link[href*="tailwind"]', 'script[src*="tailwindcss.com"]', 'style[data-tailwind]'],
        scripts: [/cdn\.tailwindcss\.com/i, /tailwind(?:\.min)?\.css/i],
        // Sample common combined tailwind class patterns
        classesRegex: /\b(flex|grid|items-center|justify-between|text-sm|bg-slate-|bg-gray-|rounded-lg|space-x-|p-[0-9]|py-[0-9]|px-[0-9])\b/g
      }
    },
    {
      name: 'Bootstrap',
      category: 'CSS Framework',
      website: 'https://getbootstrap.com',
      matches: {
        dom: ['link[href*="bootstrap"]', '.container-fluid', '.row > .col-md-', '.navbar-nav'],
        scripts: [/bootstrap(?:\.bundle)?(?:\.min)?\.js/i, /bootstrap(?:\.min)?\.css/i],
        window: ['bootstrap']
      }
    },
    {
      name: 'Bulma',
      category: 'CSS Framework',
      website: 'https://bulma.io',
      matches: {
        dom: ['link[href*="bulma"]', '.columns > .column', '.navbar-burger']
      }
    },
    {
      name: 'Font Awesome',
      category: 'Icon Set',
      website: 'https://fontawesome.com',
      matches: {
        dom: ['link[href*="font-awesome"]', 'link[href*="fontawesome"]', '.fa', '.fas', '.far', '.fab'],
        scripts: [/fontawesome/i, /fontawesome(?:\.min)?\.js/i]
      }
    },
    {
      name: 'Google Fonts',
      category: 'Web Fonts',
      website: 'https://fonts.google.com',
      matches: {
        dom: ['link[href*="fonts.googleapis.com"]', 'link[href*="fonts.gstatic.com"]']
      }
    }
  ],

  // Analytics & Tracking
  analytics: [
    {
      name: 'Google Analytics 4 / Universal',
      category: 'Analytics',
      website: 'https://analytics.google.com',
      matches: {
        scripts: [/google-analytics\.com\/(?:analytics|ga)\.js/i, /googletagmanager\.com\/gtag\/js\?id=(?:G-|UA-)/i],
        window: ['ga', 'gtag', 'GoogleAnalyticsObject']
      }
    },
    {
      name: 'Google Tag Manager',
      category: 'Tag Management',
      website: 'https://tagmanager.google.com',
      matches: {
        scripts: [/googletagmanager\.com\/gtm\.js/i],
        window: ['google_tag_manager', 'dataLayer']
      }
    },
    {
      name: 'Meta Pixel (Facebook)',
      category: 'Analytics / Advertising',
      website: 'https://business.facebook.com',
      matches: {
        scripts: [/connect\.facebook\.net\/(?:[a-zA-Z_]+\/)?fbevents\.js/i],
        window: ['fbq', '_fbq']
      }
    },
    {
      name: 'Hotjar',
      category: 'Heatmaps & Behavior',
      website: 'https://hotjar.com',
      matches: {
        scripts: [/static\.hotjar\.com\/c\/hotjar-/i],
        window: ['hj', '_hjSettings']
      }
    },
    {
      name: 'Microsoft Clarity',
      category: 'Heatmaps & Behavior',
      website: 'https://clarity.microsoft.com',
      matches: {
        scripts: [/clarity\.ms\/tag\//i],
        window: ['clarity']
      }
    },
    {
      name: 'TikTok Pixel',
      category: 'Advertising',
      website: 'https://ads.tiktok.com',
      matches: {
        scripts: [/analytics\.tiktok\.com\/i18n\/pixel\//i],
        window: ['ttq']
      }
    },
    {
      name: 'LinkedIn Insight Tag',
      category: 'Advertising',
      website: 'https://linkedin.com',
      matches: {
        scripts: [/snap\.licdn\.com\/li\.lms-analytics\/insight\.min\.js/i],
        window: ['_linkedin_partner_id', '_linkedin_data_partner_ids']
      }
    }
  ],

  // Infrastructure, Cloud, CDN & Web Servers
  server: [
    {
      name: 'Cloudflare',
      category: 'CDN / Security / Proxy',
      website: 'https://cloudflare.com',
      matches: {
        headers: [
          { name: 'server', regex: /cloudflare/i },
          { name: 'cf-ray', regex: /.+/i },
          { name: 'cf-cache-status', regex: /.+/i }
        ],
        cookies: [/__cf_bm/i, /__cfuid/i]
      }
    },
    {
      name: 'Amazon Web Services (CloudFront / S3)',
      category: 'Cloud / CDN',
      website: 'https://aws.amazon.com/cloudfront',
      matches: {
        headers: [
          { name: 'x-amz-cf-id', regex: /.+/i },
          { name: 'via', regex: /CloudFront/i },
          { name: 'x-amz-cf-pop', regex: /.+/i }
        ]
      }
    },
    {
      name: 'Vercel',
      category: 'Hosting & Edge Platform',
      website: 'https://vercel.com',
      matches: {
        headers: [
          { name: 'x-vercel-id', regex: /.+/i },
          { name: 'server', regex: /Vercel/i }
        ]
      }
    },
    {
      name: 'Netlify',
      category: 'Hosting & Edge Platform',
      website: 'https://netlify.com',
      matches: {
        headers: [
          { name: 'x-nf-request-id', regex: /.+/i },
          { name: 'server', regex: /Netlify/i }
        ]
      }
    },
    {
      name: 'Nginx',
      category: 'Web Server',
      website: 'https://nginx.org',
      matches: {
        headers: [{ name: 'server', regex: /^nginx(?:[\/\s]([\d.]+))?/i }]
      }
    },
    {
      name: 'Apache HTTP Server',
      category: 'Web Server',
      website: 'https://httpd.apache.org',
      matches: {
        headers: [{ name: 'server', regex: /^Apache(?:[\/\s]([\d.]+))?/i }]
      }
    },
    {
      name: 'Hostinger (HCDN)',
      category: 'Cloud / Hosting / CDN',
      website: 'https://hostinger.com',
      matches: {
        headers: [
          { name: 'platform', regex: /hostinger/i },
          { name: 'server', regex: /hcdn/i },
          { name: 'x-hcdn-request-id', regex: /.+/i },
          { name: 'panel', regex: /hpanel/i }
        ]
      }
    },
    {
      name: 'LiteSpeed',
      category: 'Web Server / Cache',
      website: 'https://litespeedtech.com',
      matches: {
        headers: [
          { name: 'server', regex: /LiteSpeed/i },
          { name: 'x-turbo-charged-by', regex: /LiteSpeed/i },
          { name: 'x-litespeed-cache', regex: /.+/i }
        ]
      }
    },
    {
      name: 'PHP',
      category: 'Backend Language',
      website: 'https://php.net',
      matches: {
        headers: [
          { name: 'x-powered-by', regex: /PHP(?:[\/\s]([\d.]+))?/i }
        ]
      }
    },
    {
      name: 'Microsoft IIS',
      category: 'Web Server',
      website: 'https://iis.net',
      matches: {
        headers: [{ name: 'server', regex: /Microsoft-IIS(?:[\/\s]([\d.]+))?/i }]
      }
    },
    {
      name: 'Fastly',
      category: 'CDN',
      website: 'https://fastly.com',
      matches: {
        headers: [{ name: 'x-fastly-request-id', regex: /.+/i }, { name: 'x-served-by', regex: /cache-/i }]
      }
    },
    {
      name: 'Akamai',
      category: 'CDN',
      website: 'https://akamai.com',
      matches: {
        headers: [{ name: 'x-akamai-transformed', regex: /.+/i }, { name: 'server', regex: /AkamaiGHost/i }]
      }
    }
  ],

  // Third-party APIs, Security & Widgets
  services: [
    {
      name: 'Stripe',
      category: 'Payment Gateway',
      website: 'https://stripe.com',
      matches: {
        scripts: [/js\.stripe\.com\/v[23]/i],
        window: ['Stripe']
      }
    },
    {
      name: 'PayPal',
      category: 'Payment Gateway',
      website: 'https://paypal.com',
      matches: {
        scripts: [/paypal\.com\/sdk\/js/i, /paypalobjects\.com/i],
        window: ['paypal']
      }
    },
    {
      name: 'Google reCAPTCHA',
      category: 'Security / Anti-Bot',
      website: 'https://google.com/recaptcha',
      matches: {
        scripts: [/google\.com\/recaptcha\/api\.js/i, /recaptcha\/releases/i],
        window: ['grecaptcha']
      }
    },
    {
      name: 'Cloudflare Turnstile',
      category: 'Security / Anti-Bot',
      website: 'https://developers.cloudflare.com/turnstile',
      matches: {
        scripts: [/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/i],
        window: ['turnstile']
      }
    },
    {
      name: 'Intercom',
      category: 'Customer Support / Chat',
      website: 'https://intercom.com',
      matches: {
        scripts: [/widget\.intercom\.io/i],
        window: ['Intercom']
      }
    },
    {
      name: 'Zendesk Chat',
      category: 'Customer Support / Chat',
      website: 'https://zendesk.com',
      matches: {
        scripts: [/static\.zdassets\.com\/ekr\/snippet\.js/i],
        window: ['zE', 'zEmbed']
      }
    },
    {
      name: 'Tawk.to',
      category: 'Live Chat',
      website: 'https://tawk.to',
      matches: {
        scripts: [/embed\.tawk\.to/i],
        window: ['Tawk_API']
      }
    },
    {
      name: 'Crisp Chat',
      category: 'Live Chat',
      website: 'https://crisp.chat',
      matches: {
        scripts: [/client\.crisp\.chat/i],
        window: ['$crisp']
      }
    }
  ]
};
