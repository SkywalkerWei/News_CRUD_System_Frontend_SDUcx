import { message } from 'antd';
import axios from 'axios';

export async function downloadFile(url: string, data: any, filename: string) {
  try {
    const res = await axios.post(url, data, {
      headers: {
        filename: 'utf-8',
      },
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (ex: any) {
    message.error('导出失败：' + ex?.message);
  }
}
