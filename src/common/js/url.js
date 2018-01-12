let url = process.env.NODE_ENV === 'production' ? "https://api.space-net.cn/api/v1" : "http://cus.app/api/v1"
// let url = process.env.NODE_ENV === 'production' ? "https://api.space-net.cn/api/v1" : "https://api.space-net.cn/api/v1"
let front = process.env.NODE_ENV === 'production' ? "https://space-net.cn/#" : "http://localhost:8080/#"
let storage = process.env.NODE_ENV === 'production' ? "https://api.space-net.cn/storage" : "http://cus.app/storage"
export default {
  url, front, storage,
  uploadAction: `${url}/upload`,

}
