# TableCreator: 纯 JS 表格创建器

## 概述

零依赖、纯 JavaScript 的表格生成库。开发者传入列配置和数据，库自动渲染表格 DOM，支持排序、分页、行多选、列宽拖拽。

## 架构

```
TableCreator (入口，接收 columns + data + container)
├── ColumnNormalizer (校验 & 规范化列配置，填充默认值)
├── SortManager (排序状态管理，点击表头触发)
├── SelectManager (行多选，全选联动)
├── ResizeManager (列宽拖拽)
├── DataStore (持有原始数据、排序数据、分页切片)
├── Renderer (渲染 thead + tbody + 分页条)
└── PaginationBar (上一页/下一页/页码)
```

**流程**: `new TableCreator({ container, columns, data, ... })` → ColumnNormalizer → Renderer 渲染表头+表体+分页条 → 用户点击表头排序 / 点击复选框选择 / 拖拽列宽 / 翻页 → DataStore 更新切片 → 重渲染 tbody。

## 列配置

```js
columns: [
  { key: 'name',   title: '姓名',   sortable: true,  width: 150 },
  { key: 'age',    title: '年龄',   sortable: true,  width: 80,  align: 'center' },
  { key: 'city',   title: '城市',   sortable: false },
  { key: 'action', title: '操作',   width: 120,      render: (val, row) => `<button>编辑</button>` },
]
```

### 列属性

| 属性       | 类型               | 默认值    | 说明                      |
|-----------|-------------------|----------|--------------------------|
| key       | String            | —        | 数据字段名                  |
| title     | String            | key 值   | 列头显示文本                |
| sortable  | Boolean           | false    | 是否可排序                  |
| width     | Number            | —        | 初始列宽(px)，不设则自动分配   |
| align     | String            | 'left'   | 对齐方式: left/center/right |
| render    | Function          | —        | 自定义单元格渲染（JS 对象用法） |

## Schema 结构

```js
{
  columns: [ /* 列配置 */ ],
  data: [ /* 数据行 */ ],
}
```

每一行是一个对象，对象的 key 对应 columns 中的 key。

## API

```js
const table = new TableCreator({
  container: '#table',    // CSS 选择器 或 DOM 元素（必填）
  columns: [ /* ... */ ], // 列配置（必填）
  data: [ /* ... */ ],    // 数据（必填）
  pageSize: 20,           // 每页条数，默认 0 = 不分页
  selectable: true,       // 是否可多选，默认 false
  resizable: true,        // 是否可拖拽列宽，默认 false
});

// 实例方法
table.getSelected();        // → [{ name: '张三', age: 28 }]  当前选中行数据
table.getData();            // → 当前页面显示的数据（排序后 + 分页切片）
table.sortBy(key);          // 按指定列排序，切换 asc/desc
table.setData(newData);     // 更新数据，自动重新渲染
table.onChange(fn);         // 监听变化(排序/分页/选择)，返回注销函数
table.destroy();            // 清理 DOM 和事件
```

### onChange 回调

```js
table.onChange((state) => {
  // state = { sortKey, sortDir, page, totalPages, selectedRows }
});
```

## 渲染结构

```html
<div class="tc-table-wrap">
  <table class="tc-table">
    <thead>
      <tr>
        <th class="tc-th tc-th--select"><input type="checkbox"></th>
        <th class="tc-th tc-th--sortable">姓名 <span class="tc-sort-icon">▲</span></th>
        <th class="tc-th">城市</th>
      </tr>
    </thead>
    <tbody>
      <tr class="tc-row tc-row--selected">
        <td class="tc-td"><input type="checkbox" checked></td>
        <td class="tc-td">张三</td>
        <td class="tc-td">北京</td>
      </tr>
    </tbody>
  </table>
  <div class="tc-pagination">
    <button class="tc-page-btn">上一页</button>
    <span class="tc-page-info">1 / 10</span>
    <button class="tc-page-btn">下一页</button>
  </div>
</div>
```

### 列宽拖拽

每个 `<th>` 末尾有一个不可见的拖拽手柄（4px 宽），hover 时显示 `col-resize` 光标，拖拽调整列宽。

## CSS 变量

所有变量作用于 `.tc-table-wrap` 容器内：

```css
--tc-font-family: system-ui, sans-serif;
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
```

## 样式策略

- `all: initial` + `!important` + `.tc-table-wrap` 前缀，与 FormCreator 同级隔离
- 单文件 `table-creator.js`，IIFE + ESM 双格式导出

## 文件结构

单文件 `table-creator.js`，内部按模块组织：

1. CSS 变量注入 + 基础样式
2. ColumnNormalizer
3. SortManager
4. SelectManager
5. ResizeManager
6. DataStore
7. PaginationBar
8. Renderer
9. TableCreator 类
10. Export

## 不使用

- 无框架依赖
- 无第三方库
- 无 UI 组件库
