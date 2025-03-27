// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 创建新闻栏目 POST /api/news/categories */
export async function createCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.createCategoryParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultNewsCategory>('/api/news-category-manager', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取栏目详情 GET /api/news/categories/${param0} */
export async function getCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultNewsCategory>(`/api/news-category-manager/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新新闻栏目 PUT /api/news/categories/${param0} */
export async function updateCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCategoryParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/news-category-manager/${param0}`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 删除新闻栏目 删除栏目时可以指定将该栏目下的新闻转移到其他栏目 DELETE /api/news/categories/${param0} */
export async function deleteCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCategoryParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/news-category-manager/${param0}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 检查栏目名称是否已存在 GET /api/news/categories/exists */
export async function categoryExists(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.categoryExistsParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean>('/api/news-category-manager/exists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 搜索栏目 支持按名称模糊查询 GET /api/news/categories/search */
export async function searchCategories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchCategoriesParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultListNewsCategory>('/api/news-category-manager/search', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}