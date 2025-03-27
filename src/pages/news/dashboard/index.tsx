import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic } from 'antd';
import { Line, Pie, Bar } from '@ant-design/charts';
import { queryNewsStatistics } from '@/services/api/news-manager';
import MouseTrail from '../../../components/MouseTrail';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<API.NewsStatistics | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await queryNewsStatistics();
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  };

  const clickTrendConfig = {
    data: statistics?.clickTrend || [],
    xField: 'date',
    yField: 'clicks',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v: string) => `${v}次`,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const categoryDistributionConfig = {
    data: statistics?.categoryDistribution || [],
    angleField: 'count',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const publishTrendConfig = {
    data: statistics?.publishTrend || [],
    xField: 'date',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      date: {
        alias: '日期',
      },
      count: {
        alias: '发布数量',
      },
    },
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="总点击量" value={statistics?.totalClicks || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总点赞量" value={statistics?.totalLikes || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="当日点击量" value={statistics?.todayClicks || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="当日点赞量" value={statistics?.todayLikes || 0} />
          </Card>
        </Col>
      </Row>

      <Card title="点击量和点赞量趋势" style={{ marginTop: 16 }}>
        <Line {...clickTrendConfig} />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="栏目分布">
            <Pie {...categoryDistributionConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="新闻发布趋势">
            <Bar {...publishTrendConfig} />
          </Card>
        </Col>
      </Row>
      <MouseTrail />
    </PageContainer>
  );
};

export default Dashboard;