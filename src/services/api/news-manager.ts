// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 查询新闻列表 支持按标题、栏目、创建时间等条件分页查询 GET /api/news */
export async function queryNews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryNewsParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageNews>('/api/news-manager', {
    method: 'GET',
    params: {
      ...params,
      queryDTO: undefined,
      ...params['queryDTO'],
    },
    ...(options || {}),
  });
}

/** 创建新闻 POST /api/news */
export async function createNews(body: API.NewsDTO, options?: { [key: string]: any }) {
  return request<API.ResultNews>('/api/news-manager', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取新闻详情 GET /api/news/${param0} */
export async function getNews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNewsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultNews>(`/api/news-manager/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新新闻 PUT /api/news/${param0} */
export async function updateNews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateNewsParams,
  body: API.NewsDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/news-manager/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除新闻 DELETE /api/news/${param0} */
export async function deleteNews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteNewsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/news-manager/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}