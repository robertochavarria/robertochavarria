(() => {
  'use strict';

  const STORAGE_KEY = 'rc-consent-v1';
  const GA_ID = 'G-Q1C5X36GE1';
  const META_PIXEL_ID = '1062700936626882';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved.analytics === 'boolean' && typeof saved.marketing === 'boolean' ? saved : null;
    } catch (_) {
      return null;
    }
  };

  const loadScript = (src, id) => {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };

  const enableAnalytics = () => {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, 'rc-ga4-tag');
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  };

  const enableMarketing = () => {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  };

  const applyConsent = (consent) => {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied'
    });
    if (consent.analytics) enableAnalytics();
    if (consent.marketing) enableMarketing();
  };

  const saveConsent = (consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, updatedAt: new Date().toISOString() }));
    applyConsent(consent);
    document.getElementById('rc-consent-banner')?.remove();
    document.getElementById('rc-consent-settings')?.remove();
    document.getElementById('rc-consent-toggle')?.removeAttribute('hidden');
  };

  const renderBanner = () => {
    if (document.getElementById('rc-consent-banner')) return;
    const banner = document.createElement('section');
    banner.id = 'rc-consent-banner';
    banner.className = 'rc-consent-banner';
    banner.setAttribute('aria-label', 'Privacy choices');
    banner.innerHTML = `
      <div class="rc-consent-copy">
        <h2>Your privacy choices</h2>
        <p>We use optional analytics to understand site use and optional marketing tools to measure ads. You can accept, reject non-essential tracking, or choose by category. <a href="/privacy/">Privacy Policy</a></p>
      </div>
      <div class="rc-consent-actions">
        <button type="button" class="rc-button rc-button--secondary" data-rc-action="reject">Reject non-essential</button>
        <button type="button" class="rc-button rc-button--secondary" data-rc-action="manage">Manage choices</button>
        <button type="button" class="rc-button rc-button--primary" data-rc-action="accept">Accept all</button>
      </div>`;
    document.body.appendChild(banner);
    banner.addEventListener('click', (event) => {
      const action = event.target.closest('[data-rc-action]')?.dataset.rcAction;
      if (action === 'accept') saveConsent({ analytics: true, marketing: true });
      if (action === 'reject') saveConsent({ analytics: false, marketing: false });
      if (action === 'manage') renderSettings();
    });
  };

  const renderSettings = () => {
    if (document.getElementById('rc-consent-settings')) return;
    const current = readConsent() || { analytics: false, marketing: false };
    const dialog = document.createElement('div');
    dialog.id = 'rc-consent-settings';
    dialog.className = 'rc-consent-dialog-backdrop';
    dialog.innerHTML = `
      <section class="rc-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="rc-consent-title">
        <h2 id="rc-consent-title">Manage privacy choices</h2>
        <p>Necessary storage is used to remember this choice. The categories below are optional.</p>
        <label class="rc-consent-option"><input type="checkbox" name="analytics" ${current.analytics ? 'checked' : ''}><span><strong>Analytics</strong><small>Google Analytics helps us understand which pages people use and how they arrive here.</small></span></label>
        <label class="rc-consent-option"><input type="checkbox" name="marketing" ${current.marketing ? 'checked' : ''}><span><strong>Marketing</strong><small>Meta Pixel helps us measure advertising and improve its relevance.</small></span></label>
        <div class="rc-dialog-actions"><button type="button" class="rc-button rc-button--secondary" data-rc-close>Cancel</button><button type="button" class="rc-button rc-button--primary" data-rc-save>Save choices</button></div>
      </section>`;
    document.body.appendChild(dialog);
    dialog.querySelector('[data-rc-close]').addEventListener('click', () => dialog.remove());
    dialog.querySelector('[data-rc-save]').addEventListener('click', () => saveConsent({
      analytics: dialog.querySelector('[name="analytics"]').checked,
      marketing: dialog.querySelector('[name="marketing"]').checked
    }));
  };

  const addSettingsControl = () => {
    const button = document.createElement('button');
    button.id = 'rc-consent-toggle';
    button.className = 'rc-consent-toggle';
    button.type = 'button';
    button.hidden = !readConsent();
    button.textContent = 'Privacy choices';
    button.addEventListener('click', renderSettings);
    document.body.appendChild(button);
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyConsent(readConsent() || { analytics: false, marketing: false });
    addSettingsControl();
    if (!readConsent()) renderBanner();
  });
})();
