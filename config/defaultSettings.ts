import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#91cbfc',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '新闻管理系统',
  pwa: false,
  logo: "/logo.svg",
  footerRender: false,
  splitMenus: false,
  siderMenuType: "sub",
};

export default Settings;