import request from '@/utils/request'

export function loginByUsername(username, password) {
  console.log("request-login.js:",username)
  const data = {
    username,
    password
  }

  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  console.log("token-getUserInfo", token)
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
