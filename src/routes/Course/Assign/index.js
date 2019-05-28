import { dynamicWrapper, createRoute } from '@/utils/core';

//定义子路由
const routesConfig = app => ({
  path: '/assign',   //url
  title: '今日课程安排',  //页面标题
  component: dynamicWrapper(app, [import('./model')], () => import('./components')) //如果没有 model 可以不写import('./model')
});

export default app => createRoute(app, routesConfig);
