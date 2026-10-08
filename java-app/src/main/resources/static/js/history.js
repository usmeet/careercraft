/* ============================================================
   history.js — Searchable, manageable history workspace
   ============================================================ */

(function () {
  'use strict';

  var TOOL_COLORS = {
    'JD Decoder': 'tag--sky',
    'Resume Enhancer': 'tag--sunflower',
    'LinkedIn Builder': 'tag--violet',
    'Culture Analyzer': 'tag--lime',
    'Interview Simulator': 'tag--coral'
  };

  var allEntries = [];

  function formatDate(isoString) {
    var d = new Date(isoString);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderFormattedResult(rawText) {
    try {
      var json = JSON.parse(rawText);
      // If structured JSON, render a readable summary preview
      if (json.verdict) {
        return '<strong>Verdict:</strong> ' + escapeHtml(json.verdict) + '<br><small>Skills: ' + escapeHtml((json.mustHaveSkills || []).join(', ')) + '</small>';
      }
      if (json.variants && json.variants.length) {
        return '<strong>Top Variant:</strong> ' + escapeHtml(json.variants[0].bullet);
      }
      if (json.headlines && json.headlines.length) {
        return '<strong>Headline:</strong> ' + escapeHtml(json.headlines[0].text);
      }
      if (json.culturePersona) {
        return '<strong>Culture:</strong> ' + escapeHtml(json.culturePersona) + '<br><small>Values: ' + escapeHtml((json.coreValuesIdentified || []).join(', ')) + '</small>';
      }
    } catch (e) {
      // Plain text fallback
    }
    return escapeHtml(rawText);
  }

  function renderEntry(entry) {
    var colorClass = TOOL_COLORS[entry.toolName] || 'tag--slate';
    var card = document.createElement('div');
    card.className = 'history-entry card';
    card.style.marginBottom = '20px';
    card.style.padding = '20px 24px';
    card.style.position = 'relative';

    card.innerHTML =
      '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
          '<span class="tag ' + colorClass + '">' + escapeHtml(entry.toolName) + '</span>' +
          '<span style="font-size: 13px; color: var(--color-mist);">' + formatDate(entry.createdAt) + '</span>' +
        '</div>' +
        '<div style="display: flex; gap: 8px;">' +
          '<button class="btn-copy-entry btn-ghost" style="padding: 6px 12px; font-size: 12px; border-radius: 8px;">Copy</button>' +
          '<button class="btn-rerun-entry btn-ghost" style="padding: 6px 12px; font-size: 12px; border-radius: 8px;">Re-run</button>' +
          '<button class="btn-delete-entry btn-ghost" style="padding: 6px 12px; font-size: 12px; border-radius: 8px; color: var(--color-tag-coral);">Delete</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size: 14px; color: var(--color-paper-white); background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 10px; margin-bottom: 12px; line-height: 1.5;">' +
        '<strong>Input:</strong> ' + escapeHtml(entry.inputText) +
      '</div>' +
      '<div style="font-size: 14px; color: var(--color-fog); line-height: 1.6;">' +
        renderFormattedResult(entry.resultText) +
      '</div>';

    // Copy event
    card.querySelector('.btn-copy-entry').addEventListener('click', function () {
      var btn = this;
      navigator.clipboard.writeText(entry.resultText).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
      });
    });

    // Re-run event: store in session and navigate to try.html
    card.querySelector('.btn-rerun-entry').addEventListener('click', function () {
      sessionStorage.setItem('careercraft_rerun_tool', entry.toolName);
      sessionStorage.setItem('careercraft_rerun_input', entry.inputText);
      window.location.href = 'try.html';
    });

    // Delete event
    card.querySelector('.btn-delete-entry').addEventListener('click', function () {
      if (!confirm('Are you sure you want to delete this saved result?')) return;
      API.deleteHistory(entry.id).then(function (res) {
        if (res.success) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(-10px)';
          card.style.transition = 'all 0.3s ease';
          setTimeout(function () {
            card.remove();
            allEntries = allEntries.filter(function (e) { return e.id !== entry.id; });
            if (allEntries.length === 0) {
              document.getElementById('history-empty').style.display = 'block';
            }
          }, 300);
        } else {
          alert('Could not delete: ' + (res.message || 'Error'));
        }
      });
    });

    return card;
  }

  function filterAndRender() {
    var list = document.getElementById('history-list');
    var emptyState = document.getElementById('history-empty');
    var searchVal = (document.getElementById('history-search').value || '').toLowerCase();
    var filterVal = document.getElementById('history-filter').value;

    var filtered = allEntries.filter(function (e) {
      var matchesTool = (filterVal === 'ALL' || e.toolName === filterVal);
      var matchesSearch = !searchVal ||
        (e.inputText && e.inputText.toLowerCase().indexOf(searchVal) !== -1) ||
        (e.resultText && e.resultText.toLowerCase().indexOf(searchVal) !== -1);
      return matchesTool && matchesSearch;
    });

    list.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach(function (e) {
        list.appendChild(renderEntry(e));
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.getElementById('history-list');
    var emptyState = document.getElementById('history-empty');
    if (!list) return;

    var searchInput = document.getElementById('history-search');
    var filterSelect = document.getElementById('history-filter');

    if (searchInput) searchInput.addEventListener('input', filterAndRender);
    if (filterSelect) filterSelect.addEventListener('change', filterAndRender);

    if (typeof API === 'undefined') return;

    API.getHistory().then(function (data) {
      if (data.error || !Array.isArray(data) || data.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        list.innerHTML = '';
        return;
      }

      allEntries = data;
      filterAndRender();
    }).catch(function () {
      if (emptyState) emptyState.style.display = 'block';
      list.innerHTML = '';
    });
  });
})();
