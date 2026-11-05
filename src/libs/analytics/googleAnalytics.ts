// Keep the approved hosts independent of SITE_URL: a copied deployment can
// change its canonical URL without enabling this site's Google tag on the copy.
// This prevents accidental reuse; GA4 hostname filters still need to reject
// events sent by older copies or directly to Google's collection endpoint.
export const googleAnalyticsScript = `
  (function () {
    var hostname = window.location.hostname;
    var pathname = window.location.pathname;
    var isPrimarySite = hostname === 'ahnafnafee.dev' || hostname === 'www.ahnafnafee.dev';
    var isUniversityMirror = hostname === 'mason.gmu.edu' &&
      (pathname === '/~aannafee' || pathname.indexOf('/~aannafee/') === 0);
    if (!isPrimarySite && !isUniversityMirror) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;

    // Queue consent before configuration and before loading the Google tag.
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
      region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH']
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('js', new Date());
    gtag('config', 'G-7S76865HNX');

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7S76865HNX';
    document.head.appendChild(script);
  })();
`
