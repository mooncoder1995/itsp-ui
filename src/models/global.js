import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';
import {routerRedux} from "dva/router";

export default modelEnhance({
  namespace: 'global',

  state: {
    menu: [],
    flatMenu: [],
  },

  effects: {
    *getMenu({ payload }, { call, put }) {
      const { success, data } = yield call(getMenu, payload);
      if (success) {
        const loopMenu = (menu, pitem = {}) => {
          menu.forEach(item => {
            if (pitem.path) {
              item.parentPath = pitem.parentPath ? pitem.parentPath.concat(pitem.path) : [pitem.path];
            }
            if (item.children && item.children.length) {
              loopMenu(item.children, item);
            }
          });
        };
        loopMenu(data);

        yield put({
          type: 'getMenuSuccess',
          payload: data,
        });
      } else {
        yield put(routerRedux.replace('/sign/login'));
      }
    },
  },

  reducers: {
    getMenuSuccess(state, { payload }) {
      return {
        ...state,
        menu: payload,
        flatMenu: getFlatMenu(payload),
      };
    }
  },
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}

export async function getMenu(payload) {
  return $$.get('http://192.168.0.8:8010/api/user/menu', payload);
}
