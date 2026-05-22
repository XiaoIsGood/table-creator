# TableCreator

纯 JavaScript 表格创建库，零依赖，服务端分页，支持多选、列宽拖拽。

## 特性

- **零依赖** — 纯 JS，不依赖任何框架或库
- **服务端分页** — 推模式，数据由你控制流入
- **跨页多选** — 翻页不丢失选中状态
- **三态全选框** — 未选 / 半选 / 全选
- **列宽拖拽** — 拖动列边界调整宽度
- **CSS 完全隔离** — `all: initial` + `!important` + `.tc-table-wrap` 前缀
- **CSS 变量主题** — 14 个变量控制所有样式

## 快速开始

```html
<script src="table-creator.js"></script>
<script>
  const table = new TableCreator({
    container: '#table',
    columns: [
      { key: 'id',   title: 'ID',   width: 60, align: 'center' },
      { key: 'name', title: '姓名', width: 120 },
      { key: 'age',  title: '年龄', width: 80, align: 'center' },
    ],
    pageSize: 10,
    selectable: true,
    resizable: true,
  });

  // 初始化时自动触发一次，之后翻页也会触发
  table.onPageChange(async ({ page, pageSize }) => {
    const res = await fetch(`/api?page=${page}&size=${pageSize}`);
    const json = await res.json();
    table.setData({ data: json.data, total: json.total });
  });
</script>
```

## 列配置

```js
columns: [
  {
    key: 'name',       // 数据字段名（必填）
    title: '姓名',      // 列头显示文本，默认取 key
    width: 120,        // 初始列宽(px)，不设则自动分配
    align: 'center',   // 对齐: left(默认) / center / right
    render: (val, row) => `<b>${val}</b>`,  // 自定义渲染，支持 HTML 字符串
    actions: [...],    // 操作按钮，见下方说明
  },
]
```

## API

### new TableCreator(options)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| container | String \| HTMLElement | 是 | 容器元素或 CSS 选择器 |
| columns | Array | 是 | 列配置数组 |
| pageSize | Number | 否 | 每页条数，0 = 不分页 |
| selectable | Boolean | 否 | 是否可多选，默认 false |
| resizable | Boolean | 否 | 是否可拖拽列宽，默认 false |

### 实例方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `setData({ data, total })` | — | 推入当前页数据和总数 |
| `getData()` | Array | 获取当前页数据 |
| `getSelected()` | Array | 获取所有选中行的完整数据（跨页） |
| `clearSelection()` | — | 清空所有选中 |
| `goToPage(page)` | Boolean | 跳到指定页 |
| `onChange(fn)` | Function | 监听所有变化，返回注销函数 |
| `onPageChange(fn)` | Function | 仅监听翻页，返回注销函数 |
| `destroy()` | — | 销毁实例，清理 DOM 和事件 |

### Getter

| 属性 | 类型 | 说明 |
|------|------|------|
| `page` | Number | 当前页码 |
| `pageSize` | Number | 每页条数 |
| `totalPages` | Number | 总页数 |
| `total` | Number | 总数据量 |

### onChange 回调

```js
table.onChange(state => {
  // state: { type, page, pageSize, total, totalPages, data, selectedKeys, selectedRows }
});
```

| 字段 | 说明 |
|------|------|
| type | `'page'` 翻页 / `'select'` 选择变化 |
| page | 当前页码 |
| pageSize | 每页条数 |
| total | 总数据量 |
| totalPages | 总页数 |
| data | 当前页完整数据 |
| selectedKeys | 选中行的 key 数组 |
| selectedRows | 选中行的完整数据（跨页） |

### onPageChange 回调

```js
table.onPageChange(({ page, pageSize, totalPages, data, selectedKeys, selectedRows }) => {
  // 仅翻页触发，字段同 onChange（不含 type）
});
```

## 使用模式

初始化时 `onPageChange` 自动触发一次，省去手动加载首页：

```js
const table = new TableCreator({ container: '#table', columns, pageSize: 10 });

// 初始化时自动调用，翻页时也会调用
table.onPageChange(async ({ page, pageSize }) => {
  const res = await fetch(`/api?page=${page}&size=${pageSize}`);
  const json = await res.json();
  table.setData({ data: json.data, total: json.total });
});
```

## 操作列（actions）

通过 `actions` 配置操作按钮，`onClick` 直接接收行数据：

```js
{
  key: 'actions',
  title: '操作',
  width: 130,
  actions: [
    { text: '编辑', onClick: (row) => openEditModal(row) },
    { text: '删除', onClick: (row) => deleteRow(row.id), class: 'tc-btn--danger' },
  ],
}
```

| 属性 | 类型 | 说明 |
|------|------|------|
| text | String | 按钮文字 |
| onClick | Function | 点击回调，参数为行数据 |
| class | String | 可选的附加样式类 |

## 自定义样式

```css
:root {
  --tc-font-family: 'PingFang SC', sans-serif;
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
}
```

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--tc-font-family` | system-ui, sans-serif | 字体 |
| `--tc-font-size` | 14px | 字号 |
| `--tc-header-bg` | #f5f5f5 | 表头背景 |
| `--tc-header-color` | #333 | 表头文字色 |
| `--tc-header-weight` | 600 | 表头字重 |
| `--tc-row-hover-bg` | #f0f7ff | 行悬停背景 |
| `--tc-row-selected-bg` | #e6f2ff | 行选中背景 |
| `--tc-border-color` | #e0e0e0 | 边框色 |
| `--tc-border-radius` | 6px | 圆角 |
| `--tc-cell-padding` | 10px 14px | 单元格内边距 |
| `--tc-primary-color` | #4a90d9 | 主色调 |
| `--tc-pagination-gap` | 8px | 分页按钮间距 |
| `--tc-spacing` | 16px | 表格与分页间距 |

## 兼容性

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- 支持 ESM（`module.exports`）和浏览器 `<script>` 两种引入方式

## 许可证

MIT
