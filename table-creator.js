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
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  table-layout: fixed !important;
}

.tc-table-scroll {
  overflow-x: auto !important;
  max-width: 100% !important;
  border: 1px solid var(--tc-border-color) !important;
  border-radius: var(--tc-border-radius) !important;
}

.tc-thead .tc-th {
  background: var(--tc-header-bg) !important;
  color: var(--tc-header-color) !important;
  font-weight: var(--tc-header-weight) !important;
  text-align: center !important;
  padding: var(--tc-cell-padding) !important;
  border-bottom: 2px solid var(--tc-border-color) !important;
  position: relative !important;
  user-select: none !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.tc-thead { position: sticky !important; top: 0 !important; z-index: 10 !important; }

/* Frozen columns: only draw the outer edges; no borders between fixed columns. */
.tc-thead .tc-th--fixed { position: sticky !important; z-index: 11 !important; background: var(--tc-header-bg) !important; border-right: none !important; box-shadow: none !important; }
.tc-thead .tc-th--last-fixed { box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.18), 1px 0 0 0 var(--tc-border-color) !important; }
.tc-td--fixed { position: sticky !important; z-index: 2 !important; background: #fff !important; border-right: none !important; box-shadow: none !important; }
.tc-td--last-fixed { box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.18), 1px 0 0 0 var(--tc-border-color) !important; }
.tc-row:hover .tc-td--fixed { background: var(--tc-row-hover-bg) !important; }
.tc-row--selected .tc-td--fixed { background: var(--tc-row-selected-bg) !important; }
.tc-row--selected:hover .tc-td--fixed { background: #d4e8fc !important; }
.tc-tbody .tc-row:hover .tc-td--fixed { background: var(--tc-row-hover-bg) !important; }
.tc-tbody .tc-row--selected .tc-td--fixed { background: var(--tc-row-selected-bg) !important; }
.tc-tbody .tc-row--selected:hover .tc-td--fixed { background: #d4e8fc !important; }
.tc-thead .tc-th--select,
.tc-tbody .tc-td--select { overflow: visible !important; text-overflow: clip !important; }
.tc-th--center { text-align: center !important; }
.tc-th--right { text-align: right !important; }

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
  text-align: center !important;
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
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  gap: var(--tc-pagination-gap) !important; margin-top: var(--tc-spacing) !important;
}
.tc-page-total { font-size: var(--tc-font-size) !important; color: #666 !important; }
.tc-page-btn {
  padding: 6px 14px !important; background: #fff !important;
  border: 1px solid var(--tc-border-color) !important; border-radius: 4px !important;
  cursor: pointer !important; font-size: var(--tc-font-size) !important;
  color: #333 !important;
}
.tc-page-btn:hover { background: var(--tc-header-bg) !important; }
.tc-page-btn:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
.tc-page-info { font-size: var(--tc-font-size) !important; color: #666 !important; }
.tc-page-jump { display: flex !important; gap: 4px !important; margin-left: 8px !important; }
.tc-page-jump-input {
  width: 50px !important; padding: 4px 6px !important; text-align: center !important;
  border: 1px solid var(--tc-border-color) !important; border-radius: 4px !important;
  font-size: var(--tc-font-size) !important;
}

/* Action buttons */
.tc-action-btn {
  padding: 3px 10px !important; margin: 0 2px !important;
  background: #fff !important; border: 1px solid var(--tc-border-color) !important;
  border-radius: 3px !important; cursor: pointer !important;
  font-size: 12px !important; color: var(--tc-primary-color) !important;
}
.tc-action-btn:hover { background: var(--tc-header-bg) !important; }
.tc-btn--danger { color: #e74c3c !important; border-color: #e74c3c !important; }

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
    let stickyOffset = 0;
    const fixedCols = columns.filter(c => c.fixed);
    return columns.map((col, i) => {
      if (!col.key)
        throw new Error(`Column at index ${i} is missing a "key" property`);
      const fixed = !!col.fixed;
      const width = col.width || undefined;
      const lastFixed = fixed && fixedCols[fixedCols.length - 1] === col;
      const result = {
        key: col.key,
        title: col.title || col.key,
        width: width,
        align: col.align || 'center',
        render: col.render || null,
        actions: col.actions || null,
        fixed: fixed,
        _stickyLeft: fixed ? stickyOffset : undefined,
        _lastFixed: lastFixed,
      };
      if (fixed && width) stickyOffset += width;
      return result;
    });
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
        pageKeys.forEach((k) => this._selected.add(k));
        this._allChecked = true;
      }
      return this._allChecked;
    }

    isSelected(key) {
      return this._selected.has(key);
    }
    isAllChecked() {
      return this._allChecked;
    }
    countSelected(keys) {
      return keys.filter((k) => this._selected.has(k)).length;
    }
    clear() {
      this._selected.clear();
      this._allChecked = false;
    }
    getSelectedKeys() {
      return [...this._selected];
    }
  }

  // ========== PaginationBar ==========
  function createPagination(onChange) {
    const $el = document.createElement('div');
    $el.className = 'tc-pagination';

    const $total = document.createElement('span');
    $total.className = 'tc-page-total';
    $total.textContent = '共 0 条';

    const $right = document.createElement('div');
    $right.style.display = 'flex';
    $right.style.alignItems = 'center';
    $right.style.gap = 'var(--tc-pagination-gap)';

    const $prev = document.createElement('button');
    $prev.className = 'tc-page-btn';
    $prev.textContent = '上一页';

    const $info = document.createElement('span');
    $info.className = 'tc-page-info';

    const $next = document.createElement('button');
    $next.className = 'tc-page-btn';
    $next.textContent = '下一页';

    const $jumpWrap = document.createElement('span');
    $jumpWrap.className = 'tc-page-jump';
    const $jumpInput = document.createElement('input');
    $jumpInput.type = 'number';
    $jumpInput.className = 'tc-page-jump-input';
    $jumpInput.min = 1;
    const $jumpBtn = document.createElement('button');
    $jumpBtn.className = 'tc-page-btn';
    $jumpBtn.textContent = '跳转';
    $jumpWrap.appendChild($jumpInput);
    $jumpWrap.appendChild($jumpBtn);

    $right.appendChild($prev);
    $right.appendChild($info);
    $right.appendChild($next);
    $right.appendChild($jumpWrap);

    $el.appendChild($total);
    $el.appendChild($right);

    let _page = 1,
      _total = 1;

    $prev.addEventListener('click', () => {
      if (_page > 1 && onChange) onChange(_page - 1);
    });
    $next.addEventListener('click', () => {
      if (_page < _total && onChange) onChange(_page + 1);
    });
    $jumpBtn.addEventListener('click', () => {
      const p = parseInt($jumpInput.value);
      if (p >= 1 && p <= _total && p !== _page && onChange) onChange(p);
    });
    $jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $jumpBtn.click();
    });

    return {
      $el,
      update(page, totalPages, totalCount) {
        _page = page;
        _total = totalPages;
        $total.textContent = totalCount > 0 ? `共 ${totalCount} 条` : '';
        $info.textContent = totalPages > 0 ? `${page} / ${totalPages}` : '1 / 1';
        $prev.disabled = page <= 1;
        $next.disabled = page >= totalPages;
        $jumpInput.max = totalPages;
        $jumpInput.value = '';
        $el.style.display = totalPages <= 1 ? 'none' : '';
      },
    };
  }

  // ========== ResizeManager ==========
  class ResizeManager {
    constructor(onResize) {
      this._onResize = onResize;
      this._startX = 0;
      this._startWidth = 0;
      this._currentTh = null;
      this._onMouseMove = null;
      this._onMouseUp = null;
    }

    attach(th) {
      const handle = document.createElement('div');
      handle.className = 'tc-resize-handle';
      handle.addEventListener('mousedown', (e) => this._startResize(e, th));
      th.appendChild(handle);
    }

    _startResize(e, th) {
      e.preventDefault();
      this._currentTh = th;
      this._startX = e.clientX;
      this._startWidth = th.offsetWidth;

      this._onMouseMove = (e) => this._doResize(e);
      this._onMouseUp = () => this._stopResize();
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    _doResize(e) {
      if (!this._currentTh) return;
      const delta = e.clientX - this._startX;
      const newWidth = Math.max(40, this._startWidth + delta);
      this._currentTh.style.width = newWidth + 'px';
      if (this._onResize) this._onResize(this._currentTh.dataset.key, newWidth);
    }

    _stopResize() {
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('mouseup', this._onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      this._currentTh = null;
    }

    destroy() {
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('mouseup', this._onMouseUp);
    }
  }

  // ========== Renderer ==========
  function createTable(columns, selectable) {
    const $table = document.createElement('table');
    $table.className = 'tc-table';

    // Thead
    const $thead = document.createElement('thead');
    $thead.className = 'tc-thead';
    const $headerRow = document.createElement('tr');

    if (selectable) {
      const $th = document.createElement('th');
      $th.className = 'tc-th tc-th--select';
      $th.style.width = '40px';
      $th.innerHTML = '<input type="checkbox">';
      $headerRow.appendChild($th);
    }

    const selectOffset = selectable ? 40 : 0;

    columns.forEach((col) => {
      const $th = document.createElement('th');
      $th.className = 'tc-th';
      if (col.align === 'center') $th.classList.add('tc-th--center');
      else if (col.align === 'right') $th.classList.add('tc-th--right');
      if (col.width) $th.style.width = col.width + 'px';
      if (col.fixed && col._stickyLeft != null) {
        $th.classList.add('tc-th--fixed');
        if (col._lastFixed) $th.classList.add('tc-th--last-fixed');
        const left = selectOffset + col._stickyLeft;
        $th.style.left = left + 'px';
        if (col.width) { $th.style.minWidth = col.width + 'px'; $th.style.maxWidth = col.width + 'px'; }
      }
      $th.dataset.key = col.key;
      $th.textContent = col.title;
      $headerRow.appendChild($th);
    });

    $thead.appendChild($headerRow);
    $table.appendChild($thead);

    // Tbody
    const $tbody = document.createElement('tbody');
    $tbody.className = 'tc-tbody';
    $table.appendChild($tbody);

    return { $table, $thead, $tbody, $headerRow };
  }

  function renderBody(
    $tbody,
    columns,
    data,
    selectable,
    selectManager,
    onSelect,
  ) {
    $tbody.innerHTML = '';
    const selectOffset = selectable ? 40 : 0;

    data.forEach((row) => {
      const $tr = document.createElement('tr');
      $tr.className = 'tc-row';

      if (selectable) {
        const $td = document.createElement('td');
        $td.className = 'tc-td tc-td--select';
        $td.style.width = '40px';
        const rowKey = row[columns[0].key];
        const $cb = document.createElement('input');
        $cb.type = 'checkbox';
        $cb.checked = selectManager ? selectManager.isSelected(rowKey) : false;
        $cb.addEventListener('change', () => {
          const selected = selectManager.toggle(rowKey);
          if (selected) $tr.classList.add('tc-row--selected');
          else $tr.classList.remove('tc-row--selected');
          if (onSelect) onSelect();
        });
        $td.appendChild($cb);
        $tr.appendChild($td);
        if (selectManager && selectManager.isSelected(rowKey)) {
          $tr.classList.add('tc-row--selected');
        }
      }

      columns.forEach((col) => {
        const $td = document.createElement('td');
        $td.className = 'tc-td';
        if (col.align === 'center') $td.classList.add('tc-td--center');
        else if (col.align === 'right') $td.classList.add('tc-td--right');
        if (col.fixed && col._stickyLeft != null) {
          $td.classList.add('tc-td--fixed');
          if (col._lastFixed) $td.classList.add('tc-td--last-fixed');
          const left = selectOffset + col._stickyLeft;
          $td.style.left = left + 'px';
          if (col.width) { $td.style.minWidth = col.width + 'px'; $td.style.maxWidth = col.width + 'px'; }
        }

        if (col.actions) {
          col.actions.forEach((action) => {
            const $btn = document.createElement('button');
            $btn.className = 'tc-action-btn';
            if (action.class) $btn.classList.add(action.class);
            $btn.textContent = action.text || action.name;
            $btn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (typeof action.onClick === 'function') action.onClick(row);
            });
            $td.appendChild($btn);
          });
        } else if (col.render) {
          $td.innerHTML = col.render(row[col.key], row);
        } else {
          $td.textContent = row[col.key] != null ? row[col.key] : '';
        }

        $tr.appendChild($td);
      });

      $tbody.appendChild($tr);
    });
  }

  // ========== TableCreator Class ==========
  class TableCreator {
    constructor(options = {}) {
      // Resolve container
      const container = options.container;
      if (typeof container === 'string') {
        this._$container = document.querySelector(container);
        if (!this._$container)
          throw new Error(`Container not found: "${container}"`);
      } else if (container instanceof HTMLElement) {
        this._$container = container;
      } else {
        throw new Error('Container must be a CSS selector or DOM element');
      }
      this._$container.classList.add('tc-table-wrap');

      injectStyles();

      // Config
      this._columns = normalizeColumns(options.columns || []);
      this._pageSize = options.pageSize || 0;
      this._selectable = !!options.selectable;
      this._resizable = !!options.resizable;
      this._maxHeight = options.maxHeight || 0;
      this._listeners = [];
      this._pageListeners = [];

      // State — starts empty
      this._data = [];
      this._page = 1;
      this._total = 0;

      if (this._selectable) {
        this._selectManager = new SelectManager();
      }
      this._resizeManager = null;

      this._init();
    }

    _init() {
      this._$container.innerHTML = '';

      // Create table structure
      const table = createTable(this._columns, this._selectable);
      this._$table = table.$table;
      this._$tbody = table.$tbody;
      this._$headerRow = table.$headerRow;

      const $scrollWrap = document.createElement('div');
      $scrollWrap.className = 'tc-table-scroll';
      if (this._maxHeight) {
        $scrollWrap.style.maxHeight = this._maxHeight + 'px';
        $scrollWrap.style.overflowY = 'auto';
      }
      $scrollWrap.appendChild(this._$table);
      this._$container.appendChild($scrollWrap);

      // Select-all: three-state checkbox (unchecked / indeterminate / checked)
      if (this._selectable) {
        const $selectAll = this._$headerRow.querySelector(
          'input[type="checkbox"]',
        );
        if ($selectAll) {
          $selectAll.addEventListener('click', (e) => {
            const pageKeys = this._data.map((row) => row[this._columns[0].key]);
            const selectedCount = this._selectManager.countSelected(pageKeys);
            // If some or all selected → deselect all; if none selected → select all
            if (selectedCount > 0) {
              pageKeys.forEach((k) => this._selectManager._selected.delete(k));
              this._selectManager._allChecked = false;
            } else {
              pageKeys.forEach((k) => this._selectManager._selected.add(k));
              this._selectManager._allChecked = true;
            }
            this._render();
            this._notify('select');
          });
        }
      }

      // Column resize
      if (this._resizable) {
        this._resizeManager = new ResizeManager((key, width) => {
          const col = this._columns.find((c) => c.key === key);
          if (col) col.width = width;
        });
        const ths = this._$headerRow.querySelectorAll('th:not(.tc-th--select)');
        ths.forEach((th) => this._resizeManager.attach(th));
      }

      // Pagination
      this._pagination = createPagination((page) => this.goToPage(page));
      this._$container.appendChild(this._pagination.$el);

      // Render empty shell, then trigger initial page load (deferred to allow callbacks to register)
      this._render();
      setTimeout(() => this._notify('page'), 0);
    }

    setData(data) {
      this._data = data.data || [];
      this._total = data.total || 0;
      this._render();
    }

    clearSelection() {
      if (this._selectManager) this._selectManager.clear();
      this._render();
    }

    _render() {
      renderBody(
        this._$tbody,
        this._columns,
        this._data,
        this._selectable,
        this._selectManager,
        () => {
          this._render();
          this._notify('select');
        },
      );

      if (this._selectable) {
        const $selectAll = this._$headerRow.querySelector(
          'input[type="checkbox"]',
        );
        if ($selectAll) {
          const pageKeys = this._data.map((row) => row[this._columns[0].key]);
          const count = this._selectManager.countSelected(pageKeys);
          $selectAll.checked = count > 0 && count === pageKeys.length;
          $selectAll.indeterminate = count > 0 && count < pageKeys.length;
        }
      }

      const totalPages = this._pageSize
        ? Math.ceil(this._total / this._pageSize)
        : 1;
      this._pagination.update(this._page, totalPages, this._total);
    }

    _buildState() {
      const totalPages = this._pageSize
        ? Math.ceil(this._total / this._pageSize)
        : 1;
      const selectedKeys = this._selectable
        ? this._selectManager.getSelectedKeys()
        : [];
      const selectedRows = this._selectable
        ? this._data.filter((row) =>
            selectedKeys.includes(row[this._columns[0].key]),
          )
        : [];
      return {
        page: this._page,
        pageSize: this._pageSize,
        total: this._total,
        totalPages: totalPages,
        data: [...this._data],
        selectedKeys: selectedKeys,
        selectedRows: selectedRows,
      };
    }

    _notify(type) {
      const state = { ...this._buildState(), type: type || 'select' };
      this._listeners.forEach((fn) => {
        try {
          fn(state);
        } catch (e) {
          /* silent */
        }
      });
      if (type === 'page') {
        const pageState = this._buildState();
        this._pageListeners.forEach((fn) => {
          try {
            fn(pageState);
          } catch (e) {
            /* silent */
          }
        });
      }
    }

    goToPage(page) {
      const totalPages = this._pageSize
        ? Math.ceil(this._total / this._pageSize)
        : 1;
      if (page < 1 || (totalPages > 0 && page > totalPages)) return false;
      this._page = page;
      this._render();
      this._notify('page');
      return true;
    }

    getSelected() {
      if (!this._selectManager) return [];
      const keys = this._selectManager.getSelectedKeys();
      const firstCol = this._columns[0].key;
      return this._data.filter((row) => keys.includes(row[firstCol]));
    }

    getData() {
      return [...this._data];
    }

    onChange(fn) {
      if (typeof fn !== 'function') return;
      this._listeners.push(fn);
      return () => {
        const idx = this._listeners.indexOf(fn);
        if (idx !== -1) this._listeners.splice(idx, 1);
      };
    }

    onPageChange(fn) {
      if (typeof fn !== 'function') return;
      this._pageListeners.push(fn);
      return () => {
        const idx = this._pageListeners.indexOf(fn);
        if (idx !== -1) this._pageListeners.splice(idx, 1);
      };
    }

    destroy() {
      this._listeners = [];
      this._pageListeners = [];
      if (this._resizeManager) this._resizeManager.destroy();
      this._$container.innerHTML = '';
      this._$container.classList.remove('tc-table-wrap');
    }

    get page() {
      return this._page;
    }
    get totalPages() {
      return this._pageSize ? Math.ceil(this._total / this._pageSize) : 1;
    }
    get total() {
      return this._total;
    }
    get pageSize() {
      return this._pageSize;
    }
  }

  // ========== Export ==========
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableCreator;
  } else {
    window.TableCreator = TableCreator;
  }
})();
