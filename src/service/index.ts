import axios from 'axios'
import { BASE_URL, TIME_OUT } from './config'

// 发送验证码
export const sendVerificationCode = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/send-code`, data)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || '发送验证码失败'
  }
}

// 验证验证码并登录
export const loginWithCode = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || '验证码错误或已过期'
  }
}
// export default myRequest
