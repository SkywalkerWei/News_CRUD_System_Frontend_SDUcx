import { request as umiRequest } from '@umijs/max';

export async function request<T>(
  url: string,
  options: any = { method: 'GET' },
): Promise<T | undefined> {
  if (!options['throwError']) {
    try {
      const resp: any = await umiRequest(url, options);
      // 处理可能的嵌套响应
      if (resp.data && resp.data.data) {
        return resp.data;
      }
      return resp.data;
    } catch (ex) {
      return undefined;
    }
  }
  const resp: any = await umiRequest(url, options);
  // 处理可能的嵌套响应
  if (resp.data && resp.data.data) {
    return resp.data;
  }
  return resp.data;
}

export function convertPageData(result: any) {
  return {
    data: result?.list || [],
    total: result?.total || 0,
    success: true,
  };
}
export function orderBy(sort: any) {
  if (!sort) return;
  const keys = Object.keys(sort);
  if (keys.length !== 1) return;
  return keys[0] + ' ' + sort[keys[0]];
}

export async function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

const requestInterceptor = (url: string, options: RequestOptions) => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  return {
    url,
    options: { ...options, headers },
  };
};