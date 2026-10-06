/**
 * The New Me - Mobile Responsiveness Scripts
 * Handles: hamburger menu, mobile drawer, scroll lock, sticky header shadow
 */

(function () {
  'use strict';

  // --- DOM references ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const header = document.querySelector('.header');

  let scrollPosition = 0;

  // --- Drawer open/close ---
  if (hamburgerBtn && mobileDrawer && drawerBackdrop && drawerClose) {
    function openDrawer() {
      // Save current scroll position before locking
      scrollPosition = window.pageYOffset;
      
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      
      // Lock body scroll
      document.body.classList.add('drawer-open');
      document.body.style.top = `-${scrollPosition}px`;
    }

    function closeDrawer() {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      
      // Restore body scroll
      document.body.classList.remove('drawer-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    }

    // Event listeners
    hamburgerBtn.addEventListener('click', function () {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerClose.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);

    // Close drawer on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer when a nav link is clicked
    const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Close drawer on window resize to desktop
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
      }, 150);
    });
  }

  // --- Sticky header shadow on scroll ---
  let ticking = false;
  function updateHeaderShadow() {
    if (header) {
      if (window.pageYOffset > 10) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = '';
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderShadow);
      ticking = true;
    }
  }, { passive: true });

  // --- Video Modal Logic ---
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const videoContainer = document.getElementById('modal-video-container');
  const openButtons = document.querySelectorAll('.js-open-video');

  function openModal(url, type) {
    if (!modal || !videoContainer) return;
    videoContainer.innerHTML = ''; // clear previous
    
    // Auto-configure YouTube embeds to enable autoplay
    let finalUrl = url;
    if (url.includes('youtube.com')) {
      finalUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    
    const iframe = document.createElement('iframe');
    iframe.src = finalUrl;
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    videoContainer.appendChild(iframe);
    
    // Set the modal class based on type (vertical or horizontal)
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.className = 'modal-content'; // reset
      if (type) modalContent.classList.add(`type-${type}`);
      else modalContent.classList.add('type-horizontal'); // default fallback
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // restore scroll
    
    // wipe iframe slightly after fade to prevent visual pop
    setTimeout(() => {
      if (videoContainer) videoContainer.innerHTML = '';
    }, 300);
  }

  if (modal && modalClose) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-url');
        const type = btn.getAttribute('data-type');
        if (url) openModal(url, type);
      });
    });

    modalClose.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // --- Search Overlay Logic ---
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInputDesktop = document.getElementById('searchInputDesktop');
  const openSearchBtns = document.querySelectorAll('.js-open-search');

  if (searchOverlay) {
    function openSearch() {
      searchOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (searchInputDesktop) searchInputDesktop.focus();
      }, 100);
    }

    function closeSearch() {
      searchOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }

    openSearchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
        closeSearch();
      }
    });
  }

})();
