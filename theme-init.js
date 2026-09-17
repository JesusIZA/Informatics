// Застосовує тему ще до першого рендеру сторінки, щоб не було миготіння.
// Збережений у браузері вибір має пріоритет; інакше — типова тема "retro".
// Логіка тем і перемикач — у background.js.
(function () {
  var DEFAULT_THEME = 'retro';
  var theme = DEFAULT_THEME;
  try {
    var saved = JSON.parse(localStorage.getItem('siteTheme') || 'null');
    if (saved && typeof saved.theme === 'string' && saved.theme) theme = saved.theme;
  } catch (e) { /* localStorage недоступний — лишаємо типову тему */ }
  document.documentElement.setAttribute('data-theme', theme);
})();
