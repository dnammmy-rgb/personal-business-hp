// ============================================================
// Flow Design LP — main.js
// モバイルメニュー開閉
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
});

function initMobileNav() {
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  if (!header || !menuBtn) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = header.classList.toggle('header--nav-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  header.querySelectorAll('.header__nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('header--nav-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
