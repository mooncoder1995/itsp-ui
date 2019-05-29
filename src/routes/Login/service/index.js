import $$ from 'cmn-utils';

export async function login(payload) {
  return $$.post('http://192.168.43.191:8010/api/user/login', payload);
}