// ============================================================
// 右腕サポート LP — main.js
// モバイルメニュー開閉 / フォーム仮送信処理
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initContactForm();
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

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // 仮実装: 本番運用時は下記のいずれかに差し替えてください。
  // 1) Googleフォームの action URL に action属性を差し替える
  // 2) Formspree等 (https://formspree.io) のエンドポイントに action属性を差し替える
  // 3) 独自のサーバーサイド送信APIを用意し、fetch()でPOSTする
  // 詳細は README.md「問い合わせフォームの本番運用」を参照してください。
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('【仮実装】送信内容を受け付けました（本番環境では未接続です）。\n実際の送信先は README.md の手順に沿って設定してください。');
    form.reset();
  });
}
