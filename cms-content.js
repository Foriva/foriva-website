// FORIVA: Content edited with Pages CMS (content/de.json and content/fr.json).
(async () => {
  const lang = document.currentScript?.dataset.lang || 'de';
  try {
    const response = await fetch(`content/${lang}.json`, {cache: 'no-cache'});
    if (!response.ok) return;
    const content = await response.json();
    for (const [key, value] of Object.entries(content)) {
      const el = document.querySelector(`[data-foriva-field="${key}"]`);
      if (!el || typeof value !== 'string') continue;
      if (['headline','services_title','profile_title','contact_title'].includes(key)) {
        el.replaceChildren(...value.split('\n').flatMap((line, i) => i ? [document.createElement('br'),document.createTextNode(line)] : [document.createTextNode(line)]));
      } else { el.textContent = value; }
    }
  } catch (error) { console.warn('FORIVA CMS content unavailable; showing original text.', error); }
})();
