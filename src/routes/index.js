import {createRoutes} from '@/utils/core'
import BasicLayout from '@/layouts/BasicLayout'
import UserLayout from '@/layouts/UserLayout'
import TabsLayout from '@/layouts/TabsLayout'
import CardLayout from '@/layouts/CardLayout'
import Login from './Login'
import Lessons from './Course/Lessons/Summary/index'
import Intro from './Course/Lessons/DetailIntro/index'
import PerComment from './Course/Lessons/PerCourseComment/index'
import Assign from './Course/Assign'
import Inform from './Course/Inform'
import Handle from './HomeWork/Handle'
import Edit from './HomeWork/Edit'
import Check from './HomeWork/Check'
import Preview from './HomeWork/Preview'
import ChangePwd from './ChangePassword'
import StuManagement from './StuManagement'
import TopicIntro from './Community/TopicIntro/index'
import Topic from './Community/Topic/index'
import Blank from './Blank'
import Home from './Home'
import NotFound from './404'

/**
 * 主路由配置
 *
 * path 路由地址
 * component 组件
 * indexRoute 默认显示路由
 * childRoutes 所有子路由
 * NotFound 路由要放到最下面，当所有路由当没匹配到时会进入这个页面
 */
const routesConfig = app => [
  {
    path: '/sign',              //URL地址
    title: '登录',
    indexRoute: '/sign/login',  //默认路由
    component: UserLayout,
    childRoutes: [
      Login(app),               //子路由页面
      NotFound()                //放在最后，当所有路由没有匹配时进入这个页面
    ]
  },
  {
    path: '/column/per',
    title: '课程详情',
    component: UserLayout,
    indexRoute: '/column/per/comment',       //默认路由
    childRoutes: [
      PerComment(app),
      TopicIntro(app)
    ]
  },
  {
    path: '/column',
    title: '课程中心',
    component: CardLayout,
    indexRoute: '/column/intro',       //默认路由
    childRoutes: [
      Intro(app),
    ]
  },
  {
    path: '/',
    title: '系统中心',
    component: BasicLayout,
    indexRoute: '/home',       //默认路由
    childRoutes: [
      Home(app),
      Blank(app),
      ChangePwd(app),
      Assign(app),
      Lessons(app),
      Handle(app),
      Inform(app),
      Edit(app),
      Check(app),
      Preview(app),
      StuManagement(app),
      Topic(app),
      NotFound()
    ]
  }

];

export default app => createRoutes(app, routesConfig);
