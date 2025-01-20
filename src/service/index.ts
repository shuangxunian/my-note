import { BASE_URL, TIME_OUT } from './config'
import IMyRequest from './request'

const myRequest = new IMyRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

export default myRequest
