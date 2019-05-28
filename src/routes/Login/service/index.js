import $$ from 'cmn-utils';

export async function login(payload) {
  return $$.post('http://192.168.0.8:8010/api/user/login', payload);
}