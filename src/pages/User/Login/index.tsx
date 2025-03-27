import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect } from 'react';
import MouseTrail from '../../../components/MouseTrail';
import { flushSync } from 'react-dom';
import { login } from '@/services/api/authentication';

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      position: 'relative',
    };
  });

  const intl = useIntl();

  useEffect(() => {
    // Initialize the star background
    const STAR_COLOR = '#ffffff';
    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;
    const canvas = document.querySelector('canvas');
    const context = canvas?.getContext('2d');
    let scale = 1;
    let width: number;
    let height: number;
    let stars: { x: number; y: number; z: number }[] = [];
    let pointerX: number | null;
    let pointerY: number | null;
    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
    let touchInput = false;

    function generate() {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
        });
      }
    }

    function placeStar(star: { x: number; y: number; z: number }) {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    }

    function recycleStar(star: { x: number; y: number; z: number }) {
      let direction = 'z';
      let vx = Math.abs(velocity.x);
      let vy = Math.abs(velocity.y);
      if (vx > 1 || vy > 1) {
        let axis;
        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
        } else {
          axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
        }
        if (axis === 'h') {
          direction = velocity.x > 0 ? 'l' : 'r';
        } else {
          direction = velocity.y > 0 ? 't' : 'b';
        }
      }
      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
      if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
      } else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
      }
    }

    function resize() {
      scale = window.devicePixelRatio || 1;
      width = window.innerWidth * scale;
      height = window.innerHeight * scale;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      stars.forEach(placeStar);
    }

    function update() {
      velocity.tx *= 0.9;
      velocity.ty *= 0.9;
      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;
      stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;
        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;
        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    }

    function render() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = STAR_COLOR;
        context.beginPath();
        context.moveTo(star.x, star.y);
        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;
        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;
        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      });
    }

    function step() {
      if (context) {
        context.clearRect(0, 0, width, height);
      }
      update();
      render();
      requestAnimationFrame(step);
    }

    function movePointer(x: number, y: number) {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX;
        let oy = y - pointerY;
        velocity.tx = velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
        velocity.ty = velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
      }
      pointerX = x;
      pointerY = y;
    }

    function onMouseMove(event: MouseEvent) {
      touchInput = false;
      movePointer(event.clientX, event.clientY);
    }

    function onTouchMove(event: TouchEvent) {
      touchInput = true;
      movePointer(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    }

    function onMouseLeave() {
      pointerX = null;
      pointerY = null;
    }

    if (canvas && context) {
      generate();
      resize();
      step();

      window.onresize = resize;
      canvas.onmousemove = onMouseMove as any;
      canvas.ontouchmove = onTouchMove as any;
      canvas.ontouchend = onMouseLeave as any;
      document.onmouseleave = onMouseLeave;
    }

    return () => {
      if (canvas) {
        canvas.onmousemove = null;
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
      }
      document.onmouseleave = null;
      window.onresize = null;
    };
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentToken: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const msg = await login({ userId: values.username!, password: values.password! });
      if (!msg) return;

      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    } catch (error: any) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(error?.message || defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <canvas
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundImage: 'linear-gradient(-180deg, #102ea1 0%, #5361c9 29%, #4eabe6 100%)',
        }}
      />
      <Lang />
      <div
        style={{
          display: 'flex',
          flex: '1',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            padding: '24px',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title={
            <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
              新闻管理系统
            </span>
          }
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
            username: 'root',
            password: '1',
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.username.placeholder',
              defaultMessage: '用户名: root',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: '密码: 1',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
      <MouseTrail /> {}
    </div>
  );
};

export default Login;

