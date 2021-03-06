/**
 * 模拟请求数据
 * @param {FetchMock} fetchMock 当现有条件不满足时，可以使用fetchMock来进行扩展
 * @param {function} delay 增加延迟时间 ms 例: delay(mockData) 或 delay(mockData, 200)
 * @param {function} mock 使用mock生成数据，例:

   mock({
     'string|1-10': '★' // 生成最少1颗，最多10颗星字符
   })

   // {'string': '★★★★★★'} 

  更多用法参考 http://mockjs.com/examples.html
 */
export default ({fetchMock, delay, mock, toSuccess, toError}) => {
  // 如果现有扩展不满足需求，可以直接使用fetchMock方法
  // fetchMock.mock(/httpbin.org\/post/, {/* response */}, {/* options */});

  return {
    '': (options) => {
      if (options.body) {
        const user = JSON.parse(options.body);
        if (user.userName === 'admin' && user.password === 'admin') {
          return toSuccess(mock({
            'userName': 'admin',                // 用户名
            'name': '@cname',                   // 中文名称
            'age|1-100': 100,                   // 100以内随机整数
            'birthday': '@date("yyyy-MM-dd")',  // 日期
            'city': '@city(true)',              // 中国城市
            'phone': /^1[385][1-9]\d{8}/,       // 手机号
            'token': '@guid'                    // token
          }), 400);
        } else {
          return toError('用户名或密码错误 admin/admin');
        }
      } else {
        return toError('请输入用户名和密码');
      }
    },
    '/user/register': options => toSuccess(),
    '/user/menu': options => toSuccess([
      {
        name: '首页',
        icon: 'dashboard',
        path: '/home',
      },
      {
        name: '我的课表',
        icon: 'desktop',
        path: '/component',
        // children: [
        //   {
        //     name: '我的课表',
        //     path: '/toolbar',
        //   },
      }, 
      {
        name: '今日课程安排',
        icon: 'search',
        path: '/assign',
      },
      {
        name: '我的课程',
        icon: 'book',
        path: '/lessons',
      },
      {
        name: '作业提交',
        icon: 'upload',
        path: '/handle'
      },
      {
        name: '作业查看',
        icon: 'check',
        path: '/check',
      },
      {
        name: '交流中心',
        icon: 'dropbox',
        path: '/page',
      },
      {
        name: '人员管理',
        icon: 'edit',
        path: '/business',
        children: [
          {
            name: '教师管理',
            path: '/crud',
          },{
            name: '学生管理',
            path: '/crudd',
          },{
            name: '作业管理',
            path: '/curddd',
          },{
            name: '资料管理',
            path: '/curdddd'
          }
        ],
      },
    ], 400)
  } 
}