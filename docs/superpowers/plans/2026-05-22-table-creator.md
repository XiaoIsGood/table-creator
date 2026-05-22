# TableCreator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency, JSON Schema-driven table library with sorting, pagination, row selection, and column resize.

**Architecture:** Single file `table-creator.js` structured as IIFE with internal modules: CSS injection → ColumnNormalizer → DataStore → SortManager → SelectManager → ResizeManager → PaginationBar → Renderer → TableCreator class. DataStore holds source data + sorted data + page slice. Renderer handles full DOM construction.

**Tech Stack:** Vanilla JS (ES6+), IIFE + ESM export, CSS variables, no dependencies.

---

### Task 1: Create project skeleton — index.html demo page

**Files:**
- Create: `d:/code/table_creator/index.html`
- Create: `d:/code/table_creator/table-creator.js` (empty)

- [ ] **Step 1: Create index.html with demo data and table container**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TableCreator Demo</title>
<style>
body { max-width: 960px; margin: 40px auto; padding: 0 20px; font-family: system-ui, sans-serif; }
h1 { margin-bottom: 24px; }
.tc-table-wrap { max-width: 100%; }
</style>
</head>
<body>
<h1>TableCreator Demo</h1>
<div id="table" class="tc-table-wrap"></div>

<pre id="output" style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:6px;font-size:13px;"></pre>

<script src="table-creator.js"></script>
<script>
const columns = [
  { key: 'id',     title: 'ID',    width: 60,  align: 'center' },
  { key: 'name',   title: '姓名',   width: 120, sortable: true },
  { key: 'age',    title: '年龄',   width: 80,  align: 'center', sortable: true },
  { key: 'gender', title: '性别',   width: 80,  align: 'center' },
  { key: 'city',   title: '城市',   width: 120, sortable: true },
  { key: 'email',  title: '邮箱',   width: 200 },
  { key: 'status', title: '状态',   width: 100, align: 'center',
    render: (val) => val === 'active' ? '<span style="color:#22c55e">在职</span>' : '<span style="color:#999">离职</span>' },
];

const generateData = (count) => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];
  const genders = ['男', '女'];
  const statuses = ['active', 'inactive'];
  const surnames = ['张', '李', '王', '赵', '陈', '刘', '黄', '周'];
  const names = ['伟', '芳', '娜', '敏', '静', '强', '磊', '洋', '勇', '军'];
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)],
      age: 22 + Math.floor(Math.random() * 40),
      gender: genders[Math.floor(Math.random() * 2)],
      city: cities[Math.floor(Math.random() * cities.length)],
      email: 'user' + i + '@example.com',
      status: statuses[Math.floor(Math.random() * 2)],
    });
  }
  return data;
};

const table = new TableCreator({
  container: '#table',
  columns: columns,
  data: generateData(50),
  pageSize: 10,
  selectable: true,
  resizable: true,
});

const $output = document.getElementById('output');
const update = () => {
  const state = {
    page: table.page,
    totalPages: table.totalPages,
    sortKey: table.sortKey,
    sortDir: table.sortDir,
    selectedCount: table.getSelected().length,
  };
  $output.textContent = JSON.stringify(state, null, 2);
};
table.onChange(update);
update();
</script>
</body>
</html>
```

- [ ] **Step 2: Create empty table-creator.js**

```js
// TableCreator - to be implemented
```

- [ ] **Step 3: Commit**

```bash
git add index.html table-creator.js
git commit -m "feat: project skeleton with demo page"
```

---

### Task 2: CSS injection and base styles

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Write IIFE with CSS injection**

Replace the placeholder with:

```js
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

})();
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`
Expected: no output (no errors)

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: CSS injection, base styles, and column normalizer"
```

---

### Task 3: DataStore class

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add DataStore before the closing `})();`**

```js
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
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: DataStore class with sort, pagination, data management"
```

---

### Task 4: SelectManager class

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add SelectManager before the closing `})();`**

```js
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
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: SelectManager class for row multi-select with select-all"
```

---

### Task 5: ResizeManager class

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add ResizeManager before the closing `})();`**

```js
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
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: ResizeManager class for column resize drag"
```

---

### Task 6: PaginationBar

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add renderPagination function before the closing `})();`**

```js
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
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: PaginationBar with prev/next and page info"
```

---

### Task 7: Renderer (thead + tbody)

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add renderTable function before the closing `})();`**

```js
  // ========== Renderer ==========
  function createTable(columns, selectable, sortCallback) {
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

    columns.forEach(col => {
      const $th = document.createElement('th');
      $th.className = 'tc-th';
      if (col.sortable) $th.classList.add('tc-th--sortable');
      if (col.align === 'center') $th.classList.add('tc-th--center');
      else if (col.align === 'right') $th.classList.add('tc-th--right');
      if (col.width) $th.style.width = col.width + 'px';
      $th.dataset.key = col.key;
      $th.textContent = col.title;

      if (col.sortable) {
        const $icon = document.createElement('span');
        $icon.className = 'tc-sort-icon';
        $icon.textContent = ' ▸';
        $th.appendChild($icon);
        $th.addEventListener('click', () => {
          if (sortCallback) sortCallback(col.key);
        });
      }

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

  function renderBody($tbody, columns, data, selectable, selectManager) {
    $tbody.innerHTML = '';

    data.forEach(row => {
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
        });
        $td.appendChild($cb);
        $tr.appendChild($td);
        if (selectManager && selectManager.isSelected(rowKey)) {
          $tr.classList.add('tc-row--selected');
        }
      }

      columns.forEach(col => {
        const $td = document.createElement('td');
        $td.className = 'tc-td';
        if (col.align === 'center') $td.classList.add('tc-td--center');
        else if (col.align === 'right') $td.classList.add('tc-td--right');

        if (col.render) {
          $td.innerHTML = col.render(row[col.key], row);
        } else {
          $td.textContent = row[col.key] != null ? row[col.key] : '';
        }

        $tr.appendChild($td);
      });

      $tbody.appendChild($tr);
    });
  }

  function updateSortIcons($headerRow, sortKey, sortDir) {
    const icons = $headerRow.querySelectorAll('.tc-sort-icon');
    icons.forEach(icon => {
      icon.classList.remove('tc-sort-icon--active');
      icon.textContent = ' ▸';
    });
    if (sortKey) {
      const $th = $headerRow.querySelector(`[data-key="${sortKey}"]`);
      if ($th) {
        const $icon = $th.querySelector('.tc-sort-icon');
        if ($icon) {
          $icon.classList.add('tc-sort-icon--active');
          $icon.textContent = sortDir === 'asc' ? ' ▲' : ' ▼';
        }
      }
    }
  }
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Commit**

```bash
git add table-creator.js
git commit -m "feat: Renderer — createTable, renderBody, updateSortIcons"
```

---

### Task 8: TableCreator class — constructor and rendering

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add TableCreator class before the closing `})();`**

```js
  // ========== TableCreator Class ==========
  class TableCreator {
    constructor(options = {}) {
      // Resolve container
      const container = options.container;
      if (typeof container === 'string') {
        this._$container = document.querySelector(container);
        if (!this._$container) throw new Error(`Container not found: "${container}"`);
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
      this._listeners = [];

      // State managers
      this._store = new DataStore(options.data || [], this._pageSize);
      if (this._selectable) {
        this._selectManager = new SelectManager();
      }
      this._resizeManager = null;

      this._init();
    }

    _init() {
      this._$container.innerHTML = '';

      // Create table structure
      const table = createTable(
        this._columns,
        this._selectable,
        (key) => this.sortBy(key)
      );
      this._$table = table.$table;
      this._$tbody = table.$tbody;
      this._$headerRow = table.$headerRow;

      this._$container.appendChild(this._$table);

      // Column resize
      if (this._resizable) {
        this._resizeManager = new ResizeManager((key, width) => {
          const col = this._columns.find(c => c.key === key);
          if (col) col.width = width;
        });
        const ths = this._$headerRow.querySelectorAll('th:not(.tc-th--select)');
        ths.forEach(th => this._resizeManager.attach(th));
      }

      // Pagination
      this._pagination = createPagination((page) => this._goToPage(page));
      this._$container.appendChild(this._pagination.$el);

      // Initial render
      this._render();
    }

    _render() {
      const data = this._store.getPageData();
      renderBody(this._$tbody, this._columns, data, this._selectable, this._selectManager);

      // Update sort icons
      updateSortIcons(this._$headerRow, this._store.sortKey, this._store.sortDir);

      // Update select-all checkbox
      if (this._selectable) {
        const $selectAll = this._$headerRow.querySelector('input[type="checkbox"]');
        if ($selectAll) {
          $selectAll.checked = this._selectManager.isAllChecked();
          $selectAll.onchange = null;
          $selectAll.addEventListener('change', () => {
            const pageKeys = data.map(row => row[this._columns[0].key]);
            const allChecked = this._selectManager.toggleAll(pageKeys);
            $selectAll.checked = allChecked;
            this._render();
            this._notify();
          });
        }
      }

      // Pagination
      this._pagination.update(this._store.page, this._store.totalPages);
    }

    _goToPage(page) {
      if (this._store.goToPage(page)) {
        this._render();
        this._notify();
      }
    }

    _notify() {
      const state = this._store.getState();
      state.selectedKeys = this._selectable ? this._selectManager.getSelectedKeys() : [];
      this._listeners.forEach(fn => {
        try { fn(state); } catch (e) { /* silent */ }
      });
    }

    sortBy(key) {
      const result = this._store.sortBy(key);
      this._render();
      this._notify();
      return result;
    }
  }
```

- [ ] **Step 2: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 3: Verify in browser**

Open `d:/code/table_creator/index.html` in browser. Table should render with 50 rows, 10 per page, sortable columns, selection checkboxes, column resize handles.

- [ ] **Step 4: Commit**

```bash
git add table-creator.js
git commit -m "feat: TableCreator class with rendering, sort, pagination, select, resize"
```

---

### Task 9: TableCreator — remaining methods + export

**Files:**
- Modify: `d:/code/table_creator/table-creator.js`

- [ ] **Step 1: Add remaining methods inside TableCreator class (after sortBy)**

```js
    getSelected() {
      if (!this._selectManager) return [];
      const keys = this._selectManager.getSelectedKeys();
      const firstCol = this._columns[0].key;
      return this._store.getAllData().filter(row => keys.includes(row[firstCol]));
    }

    getData() {
      return this._store.getPageData();
    }

    setData(data) {
      this._store.setData(data);
      if (this._selectManager) this._selectManager.clear();
      this._render();
      this._notify();
    }

    onChange(fn) {
      if (typeof fn !== 'function') return;
      this._listeners.push(fn);
      return () => {
        const idx = this._listeners.indexOf(fn);
        if (idx !== -1) this._listeners.splice(idx, 1);
      };
    }

    destroy() {
      this._listeners = [];
      if (this._resizeManager) this._resizeManager.destroy();
      this._$container.innerHTML = '';
      this._$container.classList.remove('tc-table-wrap');
    }

    get page() { return this._store.page; }
    get totalPages() { return this._store.totalPages; }
    get sortKey() { return this._store.sortKey; }
    get sortDir() { return this._store.sortDir; }
```

- [ ] **Step 2: Add module export before `})();`**

```js
  // ========== Export ==========
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableCreator;
  } else {
    window.TableCreator = TableCreator;
  }

})();
```

- [ ] **Step 3: Verify syntax**

Run: `node -c d:/code/table_creator/table-creator.js`

- [ ] **Step 4: Commit**

```bash
git add table-creator.js
git commit -m "feat: getSelected, getData, setData, onChange, destroy, getters + export"
```

---

### Task 10: Final testing — all features

**Files:**
- Verify: `d:/code/table_creator/index.html`

- [ ] **Step 1: Open index.html in browser and verify**

Open `d:/code/table_creator/index.html`. Verify:

1. Table renders with 7 columns, 10 rows
2. Click "姓名" header → sorts ascending, icon shows ▲
3. Click "姓名" again → sorts descending, icon shows ▼  
4. Click "年龄" → switches to sort by age ascending
5. Unselect/select a row checkbox → row background highlights
6. Click "下一页" → page 2 data shown
7. Click "上一页" → back to page 1
8. Drag column resize handle → column width changes
9. `$output` shows `{ page, totalPages, sortKey, sortDir, selectedCount }`
10. No console errors

- [ ] **Step 2: Commit if any fixes needed**

```bash
git add index.html
git commit -m "test: final interaction verification for all features"
```

---

### Spec Coverage Checklist

| Spec requirement | Covered by |
|-----------------|------------|
| Column config (key/title/sortable/width/align/render) | Task 2 (normalizer), Task 7 (renderer) |
| CSS variables (14 vars) | Task 2 |
| CSS isolation (all:initial + !important) | Task 2 |
| DOM structure (tc-table/tc-thead/tc-tbody/tc-row) | Task 7 |
| Sorting (click header, toggle asc/desc) | Task 3 (DataStore), Task 8 (_render) |
| Pagination (prev/next, page info) | Task 6 (PaginationBar), Task 3 (DataStore) |
| Row selection (checkbox, select-all) | Task 4 (SelectManager), Task 7 (renderBody) |
| Column resize (drag handle) | Task 5 (ResizeManager), Task 8 (_init) |
| render cell function | Task 7 (renderBody) |
| API: getSelected/getData/setData/sortBy/onChange/destroy | Task 8 + 9 |
| IIFE + ESM export | Task 9 |
| Zero dependencies | All tasks |
