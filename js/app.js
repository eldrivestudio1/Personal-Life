/* Ritme — aplikasi pengelola kegiatan harian, Vanilla JavaScript */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = 'ritme.tasks.v1';
  const THEME_KEY = 'ritme.theme.v1';
  const todayKey = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const formatDate = (date, options = {}) => new Intl.DateTimeFormat('id-ID', options).format(date);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const iconSvg = name => {
    const paths = {
      check: '<path d="m5 12 4 4L19 6"/>',
      play: '<path d="m9 6 9 6-9 6z"/>',
      edit: '<path d="m14 5 5 5M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z"/>',
      trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4m11.6 11.6 1.4 1.4M2.5 12h2m15 0h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"/>',
      moon: '<path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5z"/>'
    };
    return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  };
  const makeId = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  let tasks = loadTasks();
  let currentFilter = 'all';
  let editingTaskId = null;
  let toastTimer = null;
  let subtaskDraft = [];

  const dialog = $('#taskDialog');

  function loadTasks() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored)
        ? stored.filter(task => task && task.id && task.title && task.date)
        : [];
    } catch (error) {
      console.warn('Data Ritme tidak dapat dibaca:', error);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Data Ritme tidak dapat disimpan:', error);
      showToast('Penyimpanan gagal. Periksa ruang penyimpanan browser.');
      return false;
    }
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function getTodayTasks() {
    return tasks.filter(task => task.date === todayKey());
  }

  function isDone(task) {
    return Boolean(task.completed);
  }

  function countStatuses(list) {
    return {
      total: list.length,
      done: list.filter(isDone).length,
      inProgress: list.filter(task => !isDone(task) && task.started).length,
      pending: list.filter(task => !isDone(task) && !task.started).length,
      remainingMinutes: list.filter(task => !isDone(task))
        .reduce((total, task) => total + (Number(task.duration) || 0), 0)
    };
  }

  function updateDateLabels() {
    const now = new Date();
    $('#todayDate').textContent = formatDate(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('#taskDate').textContent = formatDate(now, { day: 'numeric', month: 'short', year: 'numeric' });
    $('#footerYear').textContent = now.getFullYear();
  }

  function renderSummary() {
    const today = getTodayTasks();
    const counts = countStatuses(today);
    const percentage = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;

    $('#completedNumber').textContent = counts.done;
    $('#totalNumber').textContent = counts.total;
    const completedFocus = today.filter(isDone).reduce((total, task) => total + (Number(task.duration) || 0), 0);
    $('#focusDoneNumber').innerHTML = `${completedFocus} <em>mnt</em>`;
    $('#remainingNumber').textContent = counts.total - counts.done;
    $('#focusNumber').textContent = `${counts.remainingMinutes} mnt`;
    $('#heroPercent').textContent = `${percentage}%`;
    $('#heroRing').style.background = `conic-gradient(var(--accent) ${percentage}%, var(--line) ${percentage}% 100%)`;
    $('#todayProgress').style.width = `${percentage}%`;
    $('#sidePercent').textContent = `${percentage}%`;
    $('#sideProgress').style.width = `${percentage}%`;

    $('#allCount').textContent = counts.total;
    $('#allCountFilter').textContent = counts.total;
    $('#activeCount').textContent = counts.total - counts.done;
    $('#doneCount').textContent = counts.done;

    if (counts.total === 0) {
      $('#heroTitle').textContent = 'Awali dengan satu langkah.';
      $('#heroSubtitle').textContent = 'Atur prioritasmu dan nikmati progres kecil setiap hari.';
      $('#welcomeMessage').textContent = 'Satu per satu, kamu pasti bisa.';
    } else if (percentage === 100) {
      $('#heroTitle').textContent = 'Kamu menuntaskan harimu!';
      $('#heroSubtitle').textContent = 'Luar biasa. Luangkan waktu untuk mengapresiasi dirimu.';
      $('#welcomeMessage').textContent = 'Semua rencana hari ini berhasil kamu tuntaskan.';
    } else {
      $('#heroTitle').textContent = percentage > 0 ? 'Terus jaga momentummu.' : 'Waktunya mulai bergerak.';
      $('#heroSubtitle').textContent = `${counts.done} dari ${counts.total} kegiatan selesai. Setiap langkah tetap berarti.`;
      $('#welcomeMessage').textContent = 'Pilih satu hal, lalu mulai dari sana.';
    }
  }

  function priorityLabel(priority) {
    return ({ high: 'Tinggi', medium: 'Menengah', low: 'Rendah' })[priority] || 'Menengah';
  }

  function renderTasks() {
    const query = $('#searchInput').value.trim().toLocaleLowerCase('id-ID');
    const filtered = getTodayTasks().filter(task => {
      const filterMatch = currentFilter === 'all'
        || (currentFilter === 'done' && isDone(task))
        || (currentFilter === 'active' && !isDone(task));
      const haystack = `${task.title} ${task.notes || ''} ${task.category || ''} ${(task.subtasks || []).map(item => item.title).join(' ')}`.toLocaleLowerCase('id-ID');
      return filterMatch && haystack.includes(query);
    });

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
      || (a.time || '99:99').localeCompare(b.time || '99:99')
      || (b.createdAt || 0) - (a.createdAt || 0));

    const list = $('#taskList');
    list.innerHTML = filtered.map((task, index) => `
      <article class="task-card ${isDone(task) ? 'is-done' : ''}" style="animation-delay:${Math.min(index * 35, 180)}ms">
        <button class="task-check" data-action="toggle" data-id="${escapeHTML(task.id)}"
          aria-label="${isDone(task) ? 'Tandai belum selesai' : 'Tandai selesai'}"
          aria-pressed="${isDone(task)}">${isDone(task) ? iconSvg('check') : ''}</button>
        <div class="task-main">
          <div class="task-title">${escapeHTML(task.title)}</div>
          ${task.notes ? `<p class="task-note">${escapeHTML(task.notes)}</p>` : ''}
          ${(task.subtasks || []).length ? `<div class="subtask-progress"><div class="subtask-progress-label"><span>Langkah kecil</span><strong>${(task.subtasks || []).filter(item => item.completed).length}/${task.subtasks.length}</strong></div><div class="subtask-progress-track"><span style="width:${Math.round((task.subtasks.filter(item => item.completed).length / task.subtasks.length) * 100)}%"></span></div><div class="subtask-list">${task.subtasks.map(item => `<label class="subtask-item ${item.completed ? 'is-done' : ''}"><input type="checkbox" data-action="toggle-subtask" data-id="${escapeHTML(task.id)}" data-subtask-id="${escapeHTML(item.id)}" ${item.completed ? 'checked' : ''} aria-label="Tandai langkah ${escapeHTML(item.title)} selesai"><span>${escapeHTML(item.title)}</span></label>`).join('')}</div></div>` : ''}
          <div class="task-meta">
            <span class="category-tag">${escapeHTML(task.category || 'Lainnya')}</span>
            ${task.time ? `<span>${iconSvg('clock')}${escapeHTML(task.time)}</span>` : ''}
            <span>${iconSvg('clock')}${Number(task.duration) || 0} mnt</span>
            <span class="priority-${escapeHTML(task.priority || 'medium')}"><i class="priority-dot"></i>${priorityLabel(task.priority)}</span>
            ${task.started && !isDone(task) ? '<span class="status-running"><i class="status-dot"></i>Berjalan</span>' : ''}
          </div>
        </div>
        <div class="task-actions">
          ${!isDone(task) && !task.started ? `<button class="task-action" data-action="start" data-id="${escapeHTML(task.id)}" aria-label="Mulai kegiatan" title="Mulai">${iconSvg('play')}</button>` : ''}
          <button class="task-action" data-action="edit" data-id="${escapeHTML(task.id)}" aria-label="Edit kegiatan" title="Edit">${iconSvg('edit')}</button>
          <button class="task-action" data-action="delete" data-id="${escapeHTML(task.id)}" aria-label="Hapus kegiatan" title="Hapus">${iconSvg('trash')}</button>
        </div>
      </article>
    `).join('');

    $('#emptyState').hidden = filtered.length > 0;
    list.hidden = filtered.length === 0;
  }

  function renderAnalytics() {
    const today = getTodayTasks();
    const counts = countStatuses(today);
    const days = [];
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const plannedTasks = tasks.filter(task => task.date === key);
      const completedTasks = plannedTasks.filter(isDone);
      days.push({
        key,
        label: formatDate(date, { weekday: 'short' }).replace('.', ''),
        planned: plannedTasks.length,
        completed: completedTasks.length,
        focus: completedTasks.reduce((total, task) => total + (Number(task.duration) || 0), 0),
        today: offset === 0
      });
    }

    const plannedWeek = days.reduce((total, day) => total + day.planned, 0);
    const completedWeek = days.reduce((total, day) => total + day.completed, 0);
    const focusWeek = days.reduce((total, day) => total + day.focus, 0);
    const activeDays = days.filter(day => day.completed > 0).length;
    const rate = plannedWeek ? Math.round(completedWeek / plannedWeek * 100) : 0;

    $('#metricDone').textContent = completedWeek;
    $('#metricRate').textContent = `${rate}%`;
    $('#metricFocus').innerHTML = `${focusWeek} <em>mnt</em>`;
    $('#metricActiveDays').innerHTML = `${activeDays} <em>/ 7</em>`;
    $('#donutTotal').textContent = counts.total;
    $('#legendDone').textContent = counts.done;
    $('#legendProgress').textContent = counts.inProgress;
    $('#legendPending').textContent = counts.pending;

    const doneDegrees = counts.total ? counts.done / counts.total * 360 : 0;
    const progressDegrees = counts.total ? counts.inProgress / counts.total * 360 : 0;
    $('#statusDonut').style.background = `conic-gradient(var(--accent) 0deg ${doneDegrees}deg, var(--accent-strong) ${doneDegrees}deg ${doneDegrees + progressDegrees}deg, var(--line) ${doneDegrees + progressDegrees}deg 360deg)`;

    const maxPlanned = Math.max(1, ...days.map(day => day.planned));
    $('#weeklyChart').innerHTML = days.map(day => `
      <div class="bar-column">
        <span class="bar-value">${day.completed}/${day.planned}</span>
        <div class="bar-stack" title="${day.completed} selesai dari ${day.planned} tugas">
          <div class="bar-fill bar-planned" style="height:${day.planned ? Math.max(4, day.planned / maxPlanned * 100) : 2}%"><span class="bar-completed" style="height:${day.planned ? day.completed / day.planned * 100 : 0}%"></span></div>
        </div>
        <span class="bar-label ${day.today ? 'today' : ''}">${escapeHTML(day.label)}</span>
      </div>
    `).join('');

    const maxFocus = Math.max(1, ...days.map(day => day.focus));
    $('#focusChart').innerHTML = days.map(day => `
      <div class="bar-column">
        <span class="bar-value">${day.focus}</span>
        <div class="bar-stack"><div class="bar-fill focus-fill" title="${day.focus} menit estimasi fokus" style="height:${day.focus ? Math.max(4, day.focus / maxFocus * 100) : 2}%"></div></div>
        <span class="bar-label ${day.today ? 'today' : ''}">${escapeHTML(day.label)}</span>
      </div>
    `).join('');

    $('#effectivenessChart').innerHTML = days.map(day => {
      const dailyRate = day.planned ? Math.round(day.completed / day.planned * 100) : 0;
      return `<div class="rate-day" title="${dailyRate}% · ${day.completed} dari ${day.planned} tugas"><span class="rate-value">${day.planned ? `${dailyRate}%` : '—'}</span><div class="rate-track"><span style="height:${dailyRate}%"></span></div><span class="bar-label ${day.today ? 'today' : ''}">${escapeHTML(day.label)}</span></div>`;
    }).join('');

    $('#weekDoneTotal').textContent = completedWeek;
    const maxHomeDone = Math.max(1, ...days.map(day => day.completed));
    $('#homeTrend').innerHTML = days.map(day => `
      <div class="mini-week-day" title="${day.completed} tugas selesai">
        <span class="mini-week-value">${day.completed}</span>
        <div class="mini-week-track"><span style="height:${day.completed ? Math.max(5, day.completed / maxHomeDone * 100) : 2}%"></span></div>
        <span class="mini-week-label ${day.today ? 'today' : ''}">${escapeHTML(day.label)}</span>
      </div>
    `).join('');

    if (!plannedWeek) {
      $('#insightText').textContent = 'Belum ada data tugas untuk tujuh hari ini. Mulai catat rencana agar tren penyelesaian dan estimasi fokusmu mulai terbentuk.';
    } else {
      $('#insightText').textContent = `Dalam tujuh hari, ${completedWeek} dari ${plannedWeek} tugas selesai (${rate}%), dengan aktivitas selesai pada ${activeDays} hari. Waktu fokus adalah estimasi durasi tugas yang ditandai selesai, bukan pelacakan waktu otomatis.`;
    }
  }

  function renderApp() {
    updateDateLabels();
    renderSummary();
    renderTasks();
    renderAnalytics();
  }

  function openTaskDialog(task = null) {
    editingTaskId = task ? task.id : null;
    $('#taskForm').reset();
    $('#dialogTitle').textContent = task ? 'Edit kegiatan' : 'Kegiatan baru';
    $('#saveTaskButton').textContent = task ? 'Simpan perubahan' : 'Simpan kegiatan';
    $('#taskTitle').value = task?.title || '';
    $('#taskNotes').value = task?.notes || '';
    $('#taskCategory').value = task?.category || 'Kerja';
    $('#taskPriority').value = task?.priority || 'medium';
    $('#taskTime').value = task?.time || '';
    $('#taskDuration').value = task?.duration ?? 30;
    subtaskDraft = (task?.subtasks || []).map(item => ({ ...item }));
    renderSubtaskEditor();

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.setTimeout(() => $('#taskTitle').focus(), 50);
  }

  function closeTaskDialog() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }


  function renderSubtaskEditor() {
    const list = $('#subtaskDraftList');
    if (!list) return;
    list.innerHTML = subtaskDraft.map(item => `<li class="subtask-draft-item"><span class="draft-bullet" aria-hidden="true"></span><span>${escapeHTML(item.title)}</span><button type="button" data-remove-subtask="${escapeHTML(item.id)}" aria-label="Hapus langkah ${escapeHTML(item.title)}">${iconSvg('trash')}</button></li>`).join('');
    $('#subtaskDraftCount').textContent = `${subtaskDraft.length} langkah`;
  }

  function addSubtaskDraft() {
    const input = $('#subtaskInput');
    const title = input.value.trim();
    if (!title) { input.focus(); return; }
    if (subtaskDraft.length >= 20) { showToast('Maksimal 20 langkah kecil per kegiatan.'); return; }
    subtaskDraft.push({ id: makeId(), title, completed: false });
    input.value = '';
    renderSubtaskEditor();
    input.focus();
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = $('#taskTitle').value.trim();
    if (!title) {
      $('#taskTitle').focus();
      return;
    }

    const previous = editingTaskId ? tasks.find(task => task.id === editingTaskId) : null;
    const task = {
      id: previous?.id || makeId(),
      title,
      notes: $('#taskNotes').value.trim(),
      category: $('#taskCategory').value,
      priority: $('#taskPriority').value,
      time: $('#taskTime').value,
      duration: Math.max(0, Math.min(1440, Number($('#taskDuration').value) || 0)),
      date: previous?.date || todayKey(),
      completed: previous?.completed || false,
      started: previous?.started || false,
      createdAt: previous?.createdAt || Date.now(),
      completedAt: previous?.completedAt || null,
      subtasks: subtaskDraft.map(item => ({ ...item }))
    };
    if (task.subtasks.length && task.subtasks.every(item => item.completed)) { task.completed = true; task.started = false; task.completedAt = task.completedAt || Date.now(); }
    else if (task.subtasks.some(item => item.completed)) { task.completed = false; task.completedAt = null; }

    if (previous) tasks = tasks.map(item => item.id === previous.id ? task : item);
    else tasks.push(task);

    saveTasks();
    renderApp();
    closeTaskDialog();
    showToast(previous ? 'Kegiatan berhasil diperbarui.' : 'Kegiatan berhasil ditambahkan.');
  }

  function handleTaskAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'toggle-subtask' && event.type !== 'change') return;
    const task = tasks.find(item => item.id === button.dataset.id);
    if (!task) return;

    switch (button.dataset.action) {
      case 'toggle-subtask': {
        const subtask = (task.subtasks || []).find(item => item.id === button.dataset.subtaskId);
        if (!subtask) return;
        subtask.completed = button.checked;
        if ((task.subtasks || []).length && task.subtasks.every(item => item.completed)) { task.completed = true; task.completedAt = Date.now(); task.started = false; }
        else { task.completed = false; task.completedAt = null; }
        saveTasks(); renderApp();
        showToast(subtask.completed ? 'Langkah kecil diselesaikan.' : 'Langkah kecil dibuka kembali.');
        break;
      }
      case 'toggle':
        task.completed = !task.completed;
        if (task.subtasks) task.subtasks.forEach(item => { item.completed = task.completed; });
        task.completedAt = task.completed ? Date.now() : null;
        if (task.completed) task.started = false;
        saveTasks();
        renderApp();
        showToast(task.completed ? 'Kegiatan berhasil diselesaikan.' : 'Kegiatan dikembalikan ke daftar aktif.');
        break;
      case 'start':
        task.started = true;
        saveTasks();
        renderApp();
        showToast('Kegiatan dimulai. Semangat!');
        break;
      case 'edit':
        openTaskDialog(task);
        break;
      case 'delete':
        if (window.confirm(`Hapus kegiatan "${task.title}"?`)) {
          tasks = tasks.filter(item => item.id !== task.id);
          saveTasks();
          renderApp();
          showToast('Kegiatan dihapus.');
        }
        break;
    }
  }

  function changeView(viewName) {
    const showAnalytics = viewName === 'analytics';
    $('#todayView').classList.toggle('active', !showAnalytics);
    $('#analyticsView').classList.toggle('active', showAnalytics);
    $$('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === viewName));
    if (showAnalytics) renderAnalytics();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function exportData() {
    const backup = {
      app: 'Ritme Daily Planner',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const objectURL = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectURL;
    anchor.download = `ritme-backup-${todayKey()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectURL);
    showToast('Data kegiatan berhasil diekspor.');
  }

  function toggleTheme() {
    const light = !document.body.classList.contains('light');
    document.body.classList.toggle('light', light);
    try { localStorage.setItem(THEME_KEY, light ? 'light' : 'dark'); } catch {}
    $('#themeToggle').innerHTML = iconSvg(light ? 'moon' : 'sun');
    $('#themeToggle').setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
  }

  function bindEvents() {
    $('#addTaskButton').addEventListener('click', () => openTaskDialog());
    $('#emptyAddButton').addEventListener('click', () => openTaskDialog());
    $('#mobileAddButton').addEventListener('click', () => openTaskDialog());
    $('#closeDialog').addEventListener('click', closeTaskDialog);
    $('#cancelDialog').addEventListener('click', closeTaskDialog);
    $('#taskForm').addEventListener('submit', handleTaskSubmit);
    $('#taskList').addEventListener('click', handleTaskAction);
    $('#taskList').addEventListener('change', handleTaskAction);
    $('#addSubtaskButton').addEventListener('click', addSubtaskDraft);
    $('#subtaskInput').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); addSubtaskDraft(); } });
    $('#subtaskDraftList').addEventListener('click', event => { const button = event.target.closest('[data-remove-subtask]'); if (!button) return; subtaskDraft = subtaskDraft.filter(item => item.id !== button.dataset.removeSubtask); renderSubtaskEditor(); });
    $('#searchInput').addEventListener('input', renderTasks);
    $('#themeToggle').addEventListener('click', toggleTheme);
    $('#exportButton').addEventListener('click', exportData);
    $('#analyticsExport').addEventListener('click', exportData);

    $$('.filter-tab').forEach(button => button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      $$('.filter-tab').forEach(tab => tab.classList.toggle('active', tab === button));
      renderTasks();
    }));

    $$('[data-view]').forEach(button => button.addEventListener('click', () => changeView(button.dataset.view)));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeTaskDialog();
    });
  }

  function initializeTheme() {
    try {
      const light = localStorage.getItem(THEME_KEY) === 'light';
      document.body.classList.toggle('light', light);
      $('#themeToggle').innerHTML = iconSvg(light ? 'moon' : 'sun');
      $('#themeToggle').setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
    } catch {}
  }

  function registerServiceWorker() {
    const canRegister = 'serviceWorker' in navigator
      && (location.protocol === 'https:' || location.hostname === 'localhost');
    if (canRegister) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(error => {
          console.warn('Service worker tidak dapat didaftarkan:', error);
        });
      });
    }
  }

  initializeTheme();
  bindEvents();
  renderApp();
  registerServiceWorker();
})();
