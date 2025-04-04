import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React, { useEffect, useRef } from 'react';
import MouseTrail from '../components/MouseTrail';

const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage: "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        进入页面 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (parallaxRef.current) {
        parallaxRef.current.style.backgroundPosition = `calc(50% + ${scrollY * 0.5}px) calc(50% + ${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <div
        ref={parallaxRef}
        style={{
          backgroundImage: 'url(https://media.prts.wiki/f/fa/Avg_38_ex06.png)',
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          padding: '0px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Card
          style={{
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            margin: 24,
          }}
          bodyStyle={{
            background: 'transparent',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: token.colorTextHeading,
              }}
            >
              欢迎使用新闻管理系统
            </div>
            <p
              style={{
                fontSize: '14px',
                color: token.colorTextSecondary,
                lineHeight: '22px',
                marginTop: 16,
                marginBottom: 32,
                width: '65%',
              }}
            >
              这是一个新闻管理系统。您可以在这里管理新闻文章、栏目分类，以及管理站内用户。
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <InfoCard
                index={1}
                href="/news"
                title="新闻管理"
                desc="在这里您可以查看、编辑、删除和发布新闻文章。"
              />
              <InfoCard
                index={2}
                title="栏目管理"
                href="/news/category"
                desc="管理新闻栏目，您可以创建、编辑和删除栏目分类。"
              />
              <InfoCard
                index={3}
                title="管理员管理"
                href="/system/admin"
                desc="查看系统内的管理员相关的信息。"
              />
            </div>
          </div>
        </Card>
        <MouseTrail />
      </div>
  );
};

export default Welcome;