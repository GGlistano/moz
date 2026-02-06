(function() {
  'use strict';

  function readUtmAndStore() {
    const url = new URL(window.location.href);

    const attribution = {
      utm_source: url.searchParams.get('utm_source') || '',
      utm_medium: url.searchParams.get('utm_medium') || '',
      utm_campaign: url.searchParams.get('utm_campaign') || '',
      utm_content: url.searchParams.get('utm_content') || '',
      utm_term: url.searchParams.get('utm_term') || '',
      referrer: url.searchParams.get('referrer') || '',
      timestamp: url.searchParams.get('timestamp') || Date.now()
    };

    if (attribution.utm_source || attribution.utm_medium || attribution.utm_campaign) {
      localStorage.setItem('leadAttribution', JSON.stringify(attribution));
      console.log('[UTM Tracking] Dados capturados e armazenados:', attribution);
    } else {
      const existing = localStorage.getItem('leadAttribution');
      if (!existing) {
        console.log('[UTM Tracking] Nenhum parâmetro UTM encontrado na URL');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', readUtmAndStore);
  } else {
    readUtmAndStore();
  }
})();
