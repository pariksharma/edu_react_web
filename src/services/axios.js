import axios from "axios";

let appIdStore = null;

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

// export const setAppId = (appId) => {
//     appIdStore = appId;
//     console.log('appIdStore', appIdStore)
// };

axiosClient.interceptors.request.use((req) => {
    const jwt = localStorage.getItem('jwt')
    const user_id = localStorage.getItem('user_id')
    const app_id = localStorage.getItem('appId')


    const headers = {
            'Jwt': jwt ? jwt : "jwt",
            'Userid': user_id ? user_id : 0,
            'Devicetype': 4,
            'Version': 1,
            'Lang': 1,
            // 'Centerid:'.$Centerid,
            'Content-Type': 'application/json',
            "Authorization": "Bearer 01*#NerglnwwebOI)30@I*Dm'@@",
            "Appid": app_id ? app_id : '' 
    }

    req.headers = headers

    return req
}, (error) => Promise.reject(error))

export default axiosClient