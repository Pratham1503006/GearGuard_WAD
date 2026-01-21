(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const STORAGE_KEY = 'gearGuardVanilla.savedItems.v1';
  const THEME_KEY = 'gearGuardVanilla.theme';
  const CURRENT_USER_KEY = 'gearGuard.currentUser';

  function getCurrentUser() {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error reading current user:', e);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    updateAuthButton();
    alert('You have been logged out successfully.');
  }

  function updateAuthButton() {
    const authBtn = qs('#authBtn');
    if (!authBtn) return;

    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser.loggedIn) {
      authBtn.textContent = 'Logout';
      authBtn.onclick = () => {
        logout();
      };
    } else {
      authBtn.textContent = 'Login';
      authBtn.onclick = () => {
        window.location.href = 'login.html';
      };
    }
  }

  function loadSavedItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function renderSaved(items) {
    const list = qs('#savedList');
    if (!list) return;

    list.innerHTML = '';

    if (items.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No saved items yet.';
      list.appendChild(li);
      return;
    }

    for (const item of items) {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    }
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    const btn = qs('#themeBtn');
    if (btn) {
      const isLight = theme === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.textContent = isLight ? 'Toggle theme (light)' : 'Toggle theme (dark)';
    }

    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    setTheme(saved === 'light' ? 'light' : 'dark');

    const btn = qs('#themeBtn');
    btn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  function initNav() {
    const toggle = qs('#navToggle');
    const list = qs('#navList');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close menu after clicking a link on small screens
    qsa('a[href^="#"]', list).forEach((a) => {
      a.addEventListener('click', () => {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initMachineFilters() {
    const search = qs('#machineSearch');
    const status = qs('#statusFilter');
    const reset = qs('#resetFilters');
    const items = qsa('#machineList .table__row');

    function apply() {
      const q = (search?.value ?? '').trim().toLowerCase();
      const s = status?.value ?? 'all';

      for (const row of items) {
        const text = row.textContent?.toLowerCase() ?? '';
        const rowStatus = row.getAttribute('data-status') ?? '';

        const matchText = q === '' || text.includes(q);
        const matchStatus = s === 'all' || rowStatus === s;

        row.style.display = matchText && matchStatus ? '' : 'none';
      }
    }

    search?.addEventListener('input', apply);
    status?.addEventListener('change', apply);
    reset?.addEventListener('click', () => {
      if (search) search.value = '';
      if (status) status.value = 'all';
      apply();
    });

    apply();
  }

  function initRequests() {
    const cards = qs('#requestCards');
    if (!cards) return;

    cards.addEventListener('click', (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest('button[data-action]') : null;
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const req = btn.closest('.req');
      if (!req) return;

      if (action === 'details') {
        const body = qs('.req__body', req)?.textContent?.trim() ?? 'No details.';
        alert(`Request details:\n\n${body}`);
      }

      if (action === 'resolve') {
        req.style.opacity = '0.6';
        btn.textContent = 'Resolved';
        btn.setAttribute('disabled', 'true');
      }
    });
  }

  function initForm() {
    const form = qs('#newRequestForm');
    const status = qs('#formStatus');
    if (!form || !(form instanceof HTMLFormElement) || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const requester = String(fd.get('requester') ?? '').trim();
      const asset = String(fd.get('asset') ?? '').trim();
      const priority = String(fd.get('priority') ?? '').trim();
      const summary = String(fd.get('summary') ?? '').trim();

      if (!requester || !asset || !priority || !summary) {
        status.textContent = 'Please fill all required fields.';
        return;
      }

      // local-only UX: add a new mock card, no network
      const cards = qs('#requestCards');
      if (cards) {
        const card = document.createElement('div');
        card.className = 'req';

        const badgeClass = priority === 'High' || priority === 'Critical'
          ? 'badge--warn'
          : 'badge--ok';

        const id = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
        card.innerHTML = `
          <div class="req__top">
            <span class="badge ${badgeClass}">${priority}</span>
            <strong>${id}</strong>
          </div>
          <p class="req__body">${escapeHtml(summary)} (${escapeHtml(asset)})</p>
          <div class="req__bottom">
            <button class="btn btn--ghost" type="button" data-action="details">Details</button>
            <button class="btn btn--secondary" type="button" data-action="resolve">Mark resolved</button>
          </div>
        `;
        cards.prepend(card);
      }

      status.textContent = 'Request created locally (no API).';
      form.reset();
    });

    form.addEventListener('reset', () => {
      status.textContent = '';
    });
  }

  function initSidebarStorage() {
    const addBtn = qs('#addMockItemBtn');
    const clearBtn = qs('#clearMockBtn');

    let items = loadSavedItems();
    renderSaved(items);

    addBtn?.addEventListener('click', () => {
      const label = `Saved item ${items.length + 1} — ${new Date().toLocaleString()}`;
      items = [label, ...items].slice(0, 8);
      saveItems(items);
      renderSaved(items);
    });

    clearBtn?.addEventListener('click', () => {
      items = [];
      saveItems(items);
      renderSaved(items);
    });
  }

  function initCtaScroll() {
    const cta = qs('#ctaBtn');
    cta?.addEventListener('click', () => {
      qs('#requestForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      qs('input[name="requester"]')?.focus();
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // init
  initTheme();
  initNav();
  initMachineFilters();
  initRequests();
  initForm();
  initSidebarStorage();
  initCtaScroll();
  updateAuthButton();
})();
