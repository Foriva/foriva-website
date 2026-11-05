
/* FORIVA – Google Analytics mit Einwilligung */
(() => {
  const GA_ID = "G-4D4XW735J4";
  const KEY = "foriva_analytics_consent";
  const fr = document.documentElement.lang.toLowerCase().startsWith("fr");

  const t = fr ? {
    title: "Protection des données",
    message: "Nous utilisons Google Analytics uniquement avec votre accord afin de mesurer les visites de notre site.",
    accept: "Accepter",
    reject: "Refuser",
    settings: "Confidentialité"
  } : {
    title: "Datenschutz",
    message: "Wir verwenden Google Analytics nur mit Ihrer Zustimmung, um die Besuche auf unserer Website zu messen.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    settings: "Datenschutz"
  };

  let consent;
  try {
    consent = localStorage.getItem(KEY);
  } catch (_) {
    consent = null;
  }

  function startAnalytics() {
    if (window.forivaAnalyticsStarted) return;
    window.forivaAnalyticsStarted = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    gtag("js", new Date());
    gtag("config", GA_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);
  }

  if (consent === "yes") startAnalytics();

  function init() {
    const css = document.createElement("style");
    css.textContent = `
      #foriva-consent {
        position: fixed;
        bottom: 65px;
        right: 20px;
        z-index: 99999;
        max-width: 380px;
        padding: 22px;
        background: white;
        color: #102a37;
        border: 1px solid #dce5e4;
        border-radius: 12px;
        box-shadow: 0 6px 30px #0002;
        font: 15px/1.5 Arial, sans-serif;
      }
      #foriva-consent h3 {
        margin: 0 0 10px;
        font-size: 19px;
      }
      #foriva-consent p { margin: 0 0 16px; }
      #foriva-consent .actions {
        display: flex;
        gap: 10px;
      }
      #foriva-consent button {
        flex: 1;
        padding: 11px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }
      #foriva-accept {
        background: #008c91;
        color: white;
        border: none;
      }
      #foriva-reject {
        background: white;
        color: #102a37;
        border: 1px solid #888;
      }
      #foriva-privacy {
        position: fixed;
        bottom: 12px;
        left: 12px;
        z-index: 99998;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #102a37;
        padding: 7px 11px;
        font-size: 12px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(css);

    const privacy = document.createElement("button");
    privacy.id = "foriva-privacy";
    privacy.textContent = t.settings;
    document.body.appendChild(privacy);

    function showBanner() {
      if (document.getElementById("foriva-consent")) return;

      const box = document.createElement("div");
      box.id = "foriva-consent";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", t.title);
      box.innerHTML = `
        <h3>${t.title}</h3>
        <p>${t.message}</p>
        <div class="actions">
          <button id="foriva-reject">${t.reject}</button>
          <button id="foriva-accept">${t.accept}</button>
        </div>
      `;
      document.body.appendChild(box);

      function decide(value) {
        try {
          localStorage.setItem(KEY, value);
        } catch (_) {}
        box.remove();

        if (value === "yes") {
          startAnalytics();
       
        } else {
          window["ga-disable-" + GA_ID] = true;

          const cookies = document.cookie.split(";");

          cookies.forEach(cookie => {
            const name = cookie.trim().split("=")[0];

            if (/^(_ga($|_)|_gid$|_gat($|_))/.test(name)) {
              ["", "; domain=foriva.ch", "; domain=.foriva.ch"]
                .forEach(domain => {
                  document.cookie =
                    name + "=; Max-Age=0; path=/" +
                    domain + "; SameSite=Lax";
                });
            }
          });

          location.reload();
        }

      }

      document.getElementById("foriva-accept")
        .addEventListener("click", () => decide("yes"));

      document.getElementById("foriva-reject")
        .addEventListener("click", () => decide("no"));
    }

    privacy.addEventListener("click", showBanner);

    if (consent !== "yes" && consent !== "no") {
      showBanner();
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
