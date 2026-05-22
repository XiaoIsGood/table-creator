(function () {
  'use strict';

  // ========== CSS Injection ==========
  function injectStyles() {
    if (document.getElementById('tc-styles')) return;
    const style = document.createElement('style');
    style.id = 'tc-styles';
    style.textContent = `
.tc-table-wrap {
  all: initial;
  display: block !important;
  box-sizing: border-box !important;
  --tc-font-family: system-ui, -apple-system, sans-serif;
  --tc-font-size: 14px;
  --tc-header-bg: #f5f5f5;
  --tc-header-color: #333;
  --tc-header-weight: 600;
  --tc-row-hover-bg: #f0f7ff;
  --tc-row-selected-bg: #e6f2ff;
  --tc-border-color: #e0e0e0;
  --tc-border-radius: 6px;
  --tc-cell-padding: 10px 14px;
  --tc-primary-color: #4a90d9;
  --tc-sort-icon-color: #999;
  --tc-pagination-gap: 8px;
  --tc-spacing: 16px;
  font-family: var(--tc-font-family) !important;
  font-size: var(--tc-font-size) !important;
  color: #333 !important;
}

.tc-table-wrap *,
.tc-table-wrap *::before,
.tc-table-wrap *::after { box-sizing: border-box !important; }

.tc-table {
  width: 100% !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: 1px solid var(--tc-border-color) !important;
  border-radius: var(--tc-border-radius) !important;
  overflow: hidden !important;
  table-layout: fixed !important;
}

.tc-thead .tc-th {
  background: var(--tc-header-bg) !important;
  color: var(--tc-header-color) !important;
  font-weight: var(--tc-header-weight) !important;
  text-align: left !important;
  padding: var(--tc-cell-padding) !important;
  border-bottom: 2px solid var(--tc-border-color) !important;
  position: relative !important;
  user-select: none !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.tc-th--sortable { cursor: pointer !important; }
.tc-th--sortable:hover { background: #e8e8e8 !important; }
.tc-th--center { text-align: center !important; }
.tc-th--right { text-align: right !important; }

.tc-sort-icon {
  display: inline-block !important; margin-left: 4px !important;
  font-size: 11px !important; color: var(--tc-sort-icon-color) !important;
}
.tc-sort-icon--active { color: var(--tc-primary-color) !important; }

.tc-row { border-bottom: 1px solid var(--tc-border-color) !important; }
.tc-row:last-child { border-bottom: none !important; }
.tc-row:hover { background: var(--tc-row-hover-bg) !important; }
.tc-row--selected { background: var(--tc-row-selected-bg) !important; }
.tc-row--selected:hover { background: #d4e8fc !important; }

.tc-td {
  padding: var(--tc-cell-padding) !important;
  border-bottom: 1px solid var(--tc-border-color) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.tc-row:last-child .tc-td { border-bottom: none !important; }
.tc-td--center { text-align: center !important; }
.tc-td--right { text-align: right !important; }

/* Column resize handle */
.tc-resize-handle {
  position: absolute !important; right: 0 !important; top: 0 !important; bottom: 0 !important;
  width: 4px !important; cursor: col-resize !important; background: transparent !important;
}
.tc-resize-handle:hover { background: var(--tc-primary-color) !important; }

/* Pagination */
.tc-pagination {
  display: flex !important; align-items: center !important; justify-content: center !important;
  gap: var(--tc-pagination-gap) !important; margin-top: var(--tc-spacing) !important;
}
.tc-page-btn {
  padding: 6px 14px !important; background: #fff !important;
  border: 1px solid var(--tc-border-color) !important; border-radius: 4px !important;
  cursor: pointer !important; font-size: var(--tc-font-size) !important;
  color: #333 !important;
}
.tc-page-btn:hover { background: var(--tc-header-bg) !important; }
.tc-page-btn:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
.tc-page-info { font-size: var(--tc-font-size) !important; color: #666 !important; }

/* Checkbox in select column */
.tc-th input[type="checkbox"],
.tc-td input[type="checkbox"] {
  width: 16px !important; height: 16px !important;
  accent-color: var(--tc-primary-color) !important; cursor: pointer !important;
  margin: 0 !important; vertical-align: middle !important;
}
`;
    document.head.appendChild(style);
  }

  // ========== Column Normalizer ==========
  function normalizeColumns(columns) {
    if (!Array.isArray(columns)) throw new Error('Columns must be an array');
    return columns.map((col, i) => {
      if (!col.key) throw new Error(`Column at index ${i} is missing a "key" property`);
      return {
        key: col.key,
        title: col.title || col.key,
        sortable: !!col.sortable,
        width: col.width || undefined,
        align: col.align || 'left',
        render: col.render || null,
      };
    });
  }

  // ========== DataStore ==========
  class DataStore {
    constructor(data, pageSize) {
      this._original = data ? [...data] : [];
      this._data = [...this._original];
      this._pageSize = pageSize || 0;
      this._sortKey = null;
      this._sortDir = 'asc';
      this._page = 1;
    }

    get page() { return this._page; }
    get totalPages() {
      if (!this._pageSize || this._pageSize <= 0) return 1;
      return Math.ceil(this._data.length / this._pageSize);
    }
    get sortKey() { return this._sortKey; }
    get sortDir() { return this._sortDir; }

    getPageData() {
      if (!this._pageSize || this._pageSize <= 0) return [...this._data];
      const start = (this._page - 1) * this._pageSize;
      return this._data.slice(start, start + this._pageSize);
    }

    getAllData() { return [...this._data]; }

    sortBy(key) {
      if (this._sortKey === key) {
        this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this._sortKey = key;
        this._sortDir = 'asc';
      }
      this._data.sort((a, b) => {
        const va = a[key], vb = b[key];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'number' && typeof vb === 'number') {
          return this._sortDir === 'asc' ? va - vb : vb - va;
        }
        return this._sortDir === 'asc'
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
      this._page = 1;
      return { sortKey: this._sortKey, sortDir: this._sortDir };
    }

    setData(data) {
      this._original = data ? [...data] : [];
      this._data = [...this._original];
      this._page = 1;
      if (this._sortKey) this.sortBy(this._sortKey);
    }

    goToPage(page) {
      if (page < 1 || page > this.totalPages) return false;
      this._page = page;
      return true;
    }

    getState() {
      return {
        sortKey: this._sortKey,
        sortDir: this._sortDir,
        page: this._page,
        totalPages: this.totalPages,
      };
    }
  }

  // ========== SelectManager ==========
  class SelectManager {
    constructor() {
      this._selected = new Set();
      this._allChecked = false;
    }

    toggle(key) {
      if (this._selected.has(key)) {
        this._selected.delete(key);
      } else {
        this._selected.add(key);
      }
      return this._selected.has(key);
    }

    toggleAll(pageKeys) {
      if (this._allChecked || this._selected.size > 0) {
        this._selected.clear();
        this._allChecked = false;
      } else {
        pageKeys.forEach(k => this._selected.add(k));
        this._allChecked = true;
      }
      return this._allChecked;
    }

    isSelected(key) { return this._selected.has(key); }
    isAllChecked() { return this._allChecked; }
    clear() { this._selected.clear(); this._allChecked = false; }
    getSelectedKeys() { return [...this._selected]; }
  }

  // ========== PaginationBar ==========
  function createPagination(onChange) {
    const $el = document.createElement('div');
    $el.className = 'tc-pagination';

    const $prev = document.createElement('button');
    $prev.className = 'tc-page-btn';
    $prev.textContent = '上一页';

    const $info = document.createElement('span');
    $info.className = 'tc-page-info';

    const $next = document.createElement('button');
    $next.className = 'tc-page-btn';
    $next.textContent = '下一页';

    $el.appendChild($prev);
    $el.appendChild($info);
    $el.appendChild($next);

    let _page = 1, _total = 1;

    $prev.addEventListener('click', () => {
      if (_page > 1 && onChange) onChange(_page - 1);
    });
    $next.addEventListener('click', () => {
      if (_page < _total && onChange) onChange(_page + 1);
    });

    return {
      $el,
      update(page, total) {
        _page = page;
        _total = total;
        $info.textContent = total > 0 ? `${page} / ${total}` : '1 / 1';
        $prev.disabled = page <= 1;
        $next.disabled = page >= total;
        $el.style.display = total <= 1 ? 'none' : '';
      },
    };
  }

})();
