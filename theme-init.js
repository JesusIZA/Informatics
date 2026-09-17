// Застосовує збережену тему ще до першого рендеру сторінки,
// щоб не було миготіння базової теми. Логіка тем — у background.js.
(function () {
  try {
    var raw = localStorage.getItem('siteTheme');
    if (!raw) return;
    var saved = JSON.parse(raw);
    if (saved && saved.theme && saved.day === new Date().toDateString()) {
      document.documentElement.setAttribute('data-theme', saved.theme);
    }
  } catch (e) { /* localStorage недоступний — лишаємо базову тему */ }
})();
