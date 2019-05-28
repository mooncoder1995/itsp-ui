import { dynamicWrapper, createRoute } from '@/utils/core';

//定义子路由
const routesConfig = app => ({
  path: '/lessons',   //url
  title: '课程',  //页面标题
  component: dynamicWrapper(app, [import('./model/index')], () => import('./components/index')) //如果没有 model 可以不写import('./model')
});

export default app => createRoute(app, routesConfig);
