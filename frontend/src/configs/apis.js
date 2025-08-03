import axios from "axios"
import cookie from 'react-cookies'
const BASE_URL = process.env.REACT_APP_API_BASE_URL

export const endpoints = {
    'auth' : {
        'token': '/auth/token',
        'logout': '/auth/logout',
        'outbound': '/auth/outbound/authentication',
        'introspect': '/auth/introspect',
    },
    'users': {
        'my_info': '/users/my-info',
        'register': '/users/register',
    },
}

export const authApis = ()=>{
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load("token")}`
        }
    })
}

export const publicApis = axios.create({
    baseURL: BASE_URL
});