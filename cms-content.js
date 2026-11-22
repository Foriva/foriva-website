/* FORIVA: vorhandene HTML-Texte funktionieren auch ohne CMS oder Webserver. */
(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (location.protocol === 'file:') return;
  const lang = document.documentElement.lang.startsWith('fr') ? 'fr' : 'de';
  fetch(`content/${lang}.json`, {cache:'no-store'})
    .then(response => {if (!response.ok) throw new Error('Content unavailable'); return response.json();})
    .then(data => {
      document.querySelectorAll('[data-foriva-field]').forEach(element => {
        const value = data[element.dataset.forivaField];
        if (typeof value === 'string') element.textContent = value;
      });
      if (typeof data.page_title === 'string') document.title = data.page_title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta && typeof data.meta_description === 'string') meta.content = data.meta_description;
    })
    .catch(() => {/* Die aktualisierten HTML-Texte bleiben als Rückfall erhalten. */});
})();
