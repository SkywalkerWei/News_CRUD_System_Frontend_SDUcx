# 前端代码仓库：概述

本项目为山东大学崇新学堂2025年春季开放性创新实践1课程软件开发部分相关代码仓库，本仓库为前端部分的代码。

## 技术栈

- React
- Ant Design Pro
- TypeScript

由于必须使用Ant Design作为前端框架，为了避免大量的兼容性和依赖的版本新旧问题，全部基于给定框架的`package.json`中指出的版本进行修改，不更新。

## 实现功能

### 新闻管理功能

- 新闻列表展示，支持分页
- 新闻搜索（按标题、栏目、时间范围）
- 新闻的增删改操作
- 新闻表单（标题、内容、所属栏目）

### 栏目管理功能

- 栏目列表展示
- 栏目搜索
- 栏目的增删改操作
- 删除栏目时支持新闻转移

### 路由配置

- 添加新闻管理相关路由
- 配置权限控制

### 多语言本地化

- 添加中文菜单项翻译

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

### Start project

```bash
npm start
```