import { routerRedux } from 'dva/router';
import { login } from '../service';
import { normal } from 'components/Notification';
import $$ from 'cmn-utils';
import { message } from 'antd'

const notice = normal;

export default {
  //表示全局state上的key
  namespace: 'login',

  //初始值
  state: {
    loggedIn: false,
    message: '',
    user: {},
  },

  //订阅数据源的subscriptions
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/sign/login') !== -1) {
          $$.removeStore('user');
        }
      });
    }
  },

  //处理异步逻辑的effects
  effects: {
    *login({ payload }, { call, put }) {
      const { success, message, data } = yield call(login, payload);
      if (success) {
        $$.setStore('user', data);
        message.success(message);
        //put:发出一个Action，类似于dispatch；call:执行异步函数
        //effect是一个Generate函数；yield标识每一步操作
        yield put(routerRedux.replace('/'));

        //建立与消息推送服务器的连接
        const WS_HOST = 'ws://192.168.1.3:8010'
        let msgSocket = new WebSocket(`${WS_HOST}/ws/${$$.getStore('user').userId}`)
        msgSocket.onopen = function (e) {
            console.log("connected")
        }
        msgSocket.onmessage = data => {
          console.log(`Received message ${data.data}`)
          notice.success(data.data)
        }
        msgSocket.onclose = e => {

        }

      } else {
        message.error(message);
        yield put({
          type: 'loginError',
          payload: { message }
        });
      }
    },
    *logout(_, { put }) {
      yield put(routerRedux.replace('/sign/login'));
      $$.removeStore('user');
    }
  },

  //同步更新state的reducers，接收action
  reducers: {
    loginSuccess(state, { payload }) {
      return {
        ...state,
        loggedIn: true,
        message: '',
        user: payload
      };
    },
    loginError(state, { payload }) {
      return {
        ...state,
        loggedIn: false,
        message: payload.message
      };
    },
  }
};
