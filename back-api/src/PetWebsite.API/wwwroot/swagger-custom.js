// Modern Swagger UI Enhancements
(function () {
  'use strict';

  // Wait for Swagger UI to load
  const interval = setInterval(() => {
    if (document.querySelector('.swagger-ui')) {
      clearInterval(interval);
      initializeCustomizations();
    }
  }, 100);

  function initializeCustomizations() {
    // Add custom branding
    addCustomBranding();

    // Enhance operation blocks with animations
    addAnimations();

    // Add keyboard shortcuts
    addKeyboardShortcuts();

    // Add smooth scrolling
    enableSmoothScroll();

    // Add copy functionality improvements
    enhanceCopyButtons();

    // Auto-expand operations on hash change
    handleDeepLinks();

    // Add search functionality
    addSearchFunctionality();
  }

  function addCustomBranding() {
    const topbar = document.querySelector('.topbar-wrapper');
    if (topbar) {
      const titleElement = topbar.querySelector('.link');
      if (titleElement) {
        titleElement.style.fontSize = '1.5rem';
        titleElement.style.fontWeight = '700';
        titleElement.innerHTML =
          '<span style="background: linear-gradient(135deg, #fff, #e0e7ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🐾 Pet Website API</span>';
      }
    }

    // Add version info if available
    const info = document.querySelector('.info');
    if (info && !document.querySelector('.api-meta-info')) {
      const metaDiv = document.createElement('div');
      metaDiv.className = 'api-meta-info';
      metaDiv.style.cssText =
        'margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; gap: 20px; color: var(--text-secondary); font-size: 0.875rem;';
      metaDiv.innerHTML = `
                <div><strong>Environment:</strong> ${window.location.hostname === 'localhost' ? 'Development' : 'Production'}</div>
                <div><strong>Base URL:</strong> ${window.location.origin}</div>
                <div><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</div>
            `;
      info.appendChild(metaDiv);
    }
  }

  function addAnimations() {
    // Add fade-in animation to operation blocks
    const style = document.createElement('style');
    style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .opblock {
                animation: fadeInUp 0.3s ease-out;
            }
            
            .opblock-tag {
                animation: fadeInUp 0.4s ease-out;
            }

            .btn-group .btn:active {
                transform: scale(0.95);
            }

            .authorize.unlocked {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }
        `;
    document.head.appendChild(style);
  }

  function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + A: Focus on authorization
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        const authorizeBtn = document.querySelector('.btn.authorize');
        if (authorizeBtn) authorizeBtn.click();
      }

      // Alt + S: Focus on search (if implemented)
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('.swagger-search-input');
        if (searchInput) searchInput.focus();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.dialog-ux');
        if (modal) {
          const closeBtn = modal.querySelector('.btn-done, .modal-btn.cancel');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }

  function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      });
    });
  }

  function enhanceCopyButtons() {
    // Observe for dynamically added code blocks
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.copy-to-clipboard').forEach((btn) => {
        if (!btn.dataset.enhanced) {
          btn.dataset.enhanced = 'true';
          const button = btn.querySelector('button');
          if (button) {
            button.addEventListener('click', () => {
              // Visual feedback
              const originalText = button.textContent;
              button.textContent = '✓ Copied!';
              button.style.color = 'var(--success-color)';
              setTimeout(() => {
                button.textContent = originalText;
                button.style.color = '';
              }, 2000);
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function handleDeepLinks() {
    // Auto-expand operation when linked directly
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const opblock = element.closest('.opblock');
            if (opblock && !opblock.classList.contains('is-open')) {
              const summary = opblock.querySelector('.opblock-summary');
              if (summary) summary.click();
            }
          }
        }, 500);
      }
    });

    // Trigger on initial load
    if (window.location.hash) {
      window.dispatchEvent(new Event('hashchange'));
    }
  }

  function addSearchFunctionality() {
    const info = document.querySelector('.info');
    if (!info || document.querySelector('.swagger-search-container')) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'swagger-search-container';
    searchContainer.style.cssText = 'margin: 20px 0; position: relative;';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'swagger-search-input';
    searchInput.placeholder = '🔍 Search endpoints... (Alt+S)';
    searchInput.style.cssText = `
            width: 100%;
            padding: 12px 40px 12px 16px;
            background: var(--surface) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 8px;
            color: var(--text-primary) !important;
            font-size: 1rem;
            transition: all 0.2s ease;
        `;

    searchInput.addEventListener('focus', () => {
      searchInput.style.borderColor = 'var(--primary-color)';
      searchInput.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    });

    searchInput.addEventListener('blur', () => {
      searchInput.style.borderColor = 'var(--border-color)';
      searchInput.style.boxShadow = 'none';
    });

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const opblocks = document.querySelectorAll('.opblock');

      opblocks.forEach((opblock) => {
        const path = opblock.querySelector('.opblock-summary-path')?.textContent.toLowerCase() || '';
        const description = opblock.querySelector('.opblock-summary-description')?.textContent.toLowerCase() || '';
        const method = opblock.querySelector('.opblock-summary-method')?.textContent.toLowerCase() || '';

        const matches = path.includes(searchTerm) || description.includes(searchTerm) || method.includes(searchTerm);

        if (searchTerm === '' || matches) {
          opblock.style.display = '';
          opblock.style.opacity = '1';
        } else {
          opblock.style.display = 'none';
          opblock.style.opacity = '0';
        }
      });

      // Show/hide operation tags based on whether they have visible operations
      document.querySelectorAll('.opblock-tag').forEach((tag) => {
        const visibleOps = tag.querySelectorAll('.opblock:not([style*="display: none"])').length;
        tag.style.display = visibleOps > 0 ? '' : 'none';
      });
    });

    searchContainer.appendChild(searchInput);
    info.parentNode.insertBefore(searchContainer, info.nextSibling);
  }

  // Add notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Expose notification to window for use in responses
  window.swaggerNotification = showNotification;

  console.log('🎨 Modern Swagger UI customizations loaded successfully!');
})();
