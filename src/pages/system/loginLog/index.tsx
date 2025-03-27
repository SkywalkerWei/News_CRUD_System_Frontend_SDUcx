import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { convertPageData, orderBy } from '@/utils/request';
import { listLoginLog } from '@/services/api/loginLog';
import MouseTrail from '../../../components/MouseTrail';

export default () => {
  const refAction = useRef<ActionType>(null);
  const columns: ProColumns<API.LoginLogVO>[] = [
    {
      title: '序列号',
      dataIndex: 'id',
      fixed: true,
      width: 100,
      search: false,
    },
    {
      title: '用户ID',
      dataIndex: 'userCode',
      sorter: true,
      fixed: true,
      width: 100,
    },
    {
      title: '姓名',
      search: false,
      dataIndex: 'name',
      width: 100,
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      width: 150,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      search: false,
      width: 100,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      search: false,
      ellipsis: true,
    },
    {
      title: '登录时间',
      width: 150,
      search: false,
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '登录日期',
      key: 'createdAt',
      hideInTable: true,
      valueType: 'date',
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.LoginLogVO>
        actionRef={refAction}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
        }}
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 100 }}
        request={async (params = {}, sort) => {
          console.log(sort);
          return convertPageData(await listLoginLog({ ...params, orderBy: orderBy(sort) }));
        }}
        columns={columns}
      />
      <MouseTrail />
    </PageContainer>
  );
};
