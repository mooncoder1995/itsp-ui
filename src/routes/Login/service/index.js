import $$ from 'cmn-utils';

export async function login(payload) {
  return $$.post('http://59.67.107.169:8010/api/user/login', payload);
}