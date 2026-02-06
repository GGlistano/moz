(function() {
  'use strict';

  function captureAndRedirect() {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams();

    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    utmParams.forEach(param => {
      const value = currentUrl.searchParams.get(param);
      if (value) {
        params.append(param, value);
      }
    });

    const referrer = document.referrer;
    if (referrer) {
      params.append('referrer', referrer);
    }

    const timestamp = Date.now();
    params.append('timestamp', timestamp);

    sessionStorage.setItem('leadAttribution', JSON.stringify({
      utm_source: currentUrl.searchParams.get('utm_source') || '',
      utm_medium: currentUrl.searchParams.get('utm_medium') || '',
      utm_campaign: currentUrl.searchParams.get('utm_campaign') || '',
      utm_content: currentUrl.searchParams.get('utm_content') || '',
      utm_term: currentUrl.searchParams.get('utm_term') || '',
      referrer: referrer,
      timestamp: timestamp
    }));

    const destinationDomain = 'https://seu-site-destino.com';

    if (params.toString()) {
      const redirectUrl = `${destinationDomain}?${params.toString()}`;
      console.log('[UTM Tracking] Redirecionando para:', redirectUrl);
      window.location.href = redirectUrl;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', captureAndRedirect);
  } else {
    captureAndRedirect();
  }
})();
