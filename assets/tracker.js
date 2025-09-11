
(function() {
  try {
    // Avoid double firing
    if (window.__tp_trk_loaded) return;
    window.__tp_trk_loaded = true;

    var siteId = document.currentScript && document.currentScript.dataset.trkSite || 'default';
    var endpoint = document.currentScript && document.currentScript.dataset.trkEndpoint || '/.netlify/functions/log';

    function uuid() { // RFC4122-ish
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
    function getSessionId() {
      try {
        var k = '_tp_sid';
        var v = localStorage.getItem(k);
        if (!v) { v = uuid(); localStorage.setItem(k, v); }
        return v;
      } catch (e) { return null; }
    }
    function post(payload) {
      try {
        navigator.sendBeacon
          ? navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: 'application/json' }))
          : fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } catch (e) {}
    }

    function send(eventType, meta) {
      post({
        url: location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId: getSessionId(),
        eventType: eventType || 'pageview',
        meta: meta || {}
      });
    }

    // Page view
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      send('pageview');
    } else {
      window.addEventListener('DOMContentLoaded', function() { send('pageview'); });
    }

    // Click tracking for links
    document.addEventListener('click', function(e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      send('click', { href: href, text: (a.textContent||'').trim().slice(0,120) });
    }, true);

  } catch (e) { /* swallow */ }
})();
